/**
 * Rate Limits section, hosted on the Usage page's "Limits" tab.
 *
 * Fed by GET /usage/rate-limits, which reports the target user's limits and
 * their live usage. Self-scoped by default; an admin's single-user filter
 * selection pins the target via ``user_id`` — the endpoint degrades a
 * foreign id back to the caller when the caller may not see it.
 *
 * Layout mirrors the Token tab: user-level cards (RPM / TPM rate caps and
 * the weekly / monthly token budgets) on top, a per-model concurrency table
 * below. Every number is the target user's own: the gateway keys the
 * counters on the user, so ``running`` is their in-flight requests, not the
 * engine's global count. The server's `mode` drives the display:
 *   'disabled' — render nothing at all (feature off server-side);
 *   'local'    — limits without counters (no shared Redis), plus an info note;
 *   'redis'    — limits plus live usage; a `usage_error` blanks the counters
 *                again and surfaces a warning instead.
 *
 * While the deployment's free-window schedule covers the moment of the
 * read, the gateway is admitting everything and the counters are frozen —
 * a "Free hours" badge says so, so a stuck-looking number is not mistaken
 * for a broken fetch.
 */
import { formatCompactNumber as num } from '@/utils/format-compact-number';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { CardWrapper } from '@gpustack/core-ui';
import { useIntl } from '@umijs/max';
import {
  Alert,
  Button,
  Flex,
  Progress,
  Spin,
  Table,
  Tag,
  Tooltip,
  message
} from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { resetRateLimit } from '../apis';
import {
  ModelConcurrencyUsage,
  RateLimitResetStatus,
  RateLimitWindowUsage
} from '../config/types';
import useQueryRateLimits from '../services/use-query-rate-limits';
import ResetLimitModal from './reset-limit-modal';

// 9075 → '11 дней 6 часов' (ru) / '11d 6h' (en). The two largest non-zero
// units are enough at a glance; a full breakdown only helps under a minute.
// Unit words come from ICU plural messages so each locale inflects properly.
const DURATION_UNITS = [
  { size: 86400, id: 'usage.rateLimits.duration.days' },
  { size: 3600, id: 'usage.rateLimits.duration.hours' },
  { size: 60, id: 'usage.rateLimits.duration.minutes' },
  { size: 1, id: 'usage.rateLimits.duration.seconds' }
] as const;

const humanizeDuration = (
  seconds: number,
  intl: ReturnType<typeof useIntl>
): string => {
  const zero = intl.formatMessage(
    { id: 'usage.rateLimits.duration.seconds' },
    { count: 0 }
  );
  if (!Number.isFinite(seconds) || seconds <= 0) return zero;
  let rest = Math.floor(seconds);
  const parts: string[] = [];
  for (const { size, id } of DURATION_UNITS) {
    if (parts.length === 2) break;
    const value = Math.floor(rest / size);
    rest -= value * size;
    if (value > 0) parts.push(intl.formatMessage({ id }, { count: value }));
  }
  return parts.length ? parts.join(' ') : zero;
};

// Progress-bar props shared by every used/limit display on the card: the
// percent clamps to [0, 100] and the bar turns red at the limit. `used`
// unknown (local mode / Redis error) yields percent 0 — callers render no
// bar at all in that case.
const usageProgressProps = (w: RateLimitWindowUsage) => ({
  percent:
    w.used == null || w.limit <= 0
      ? 0
      : Math.min(100, (w.used / w.limit) * 100),
  status:
    w.used != null && w.used >= w.limit ? ('exception' as const) : undefined
});

// The user-level cards, in display order: the rate caps (requests and tokens
// per minute, bucketed across all the user's keys) and the token budgets.
// The decision model's rejection causes, mapped to the locale key of the
// message the dialog shows. A cause the backend enumerates later (or none
// at all) falls back to the generic wording — '' is the wildcard key.
// Exported for the admin's resets table, which renders the same codes.
export const REJECTION_REASON_IDS: Record<string, string> = {
  '': 'usage.rateLimits.resetRejected.generic',
  TooVague: 'usage.rateLimits.resetRejected.tooVague',
  BypassAttempt: 'usage.rateLimits.resetRejected.bypassAttempt',
  NonIT: 'usage.rateLimits.resetRejected.nonIT',
  Gibberish: 'usage.rateLimits.resetRejected.gibberish'
};

// Each card's ``?`` tooltip explains the axis, mirroring the user form's
// description tooltips. A window the server did not send (cap unset with no
// deployment default) simply renders no card. The long token budgets carry
// a ``resetKind``: their card gets a reset button (the server records each
// press and enforces the floating quota).
const USER_CARDS: {
  kind: 'query' | 'token_rolling' | 'token_calendar';
  period: string;
  titleId: string;
  hintId: string;
  // Set on the long token budgets: their card carries a reset button.
  resetKind?: 'weekly' | 'monthly';
}[] = [
  {
    kind: 'query',
    period: '60s',
    titleId: 'usage.rateLimits.rpm',
    hintId: 'usage.rateLimits.rpmHint'
  },
  {
    kind: 'token_rolling',
    period: '60s',
    titleId: 'usage.rateLimits.tpm',
    hintId: 'usage.rateLimits.tpmHint'
  },
  {
    kind: 'token_rolling',
    period: '604800s',
    titleId: 'usage.rateLimits.weekly',
    hintId: 'usage.rateLimits.weeklyHint',
    resetKind: 'weekly'
  },
  {
    kind: 'token_calendar',
    period: 'each_month',
    titleId: 'usage.rateLimits.monthly',
    hintId: 'usage.rateLimits.monthlyHint',
    resetKind: 'monthly'
  }
];

// One user-level period tile, styled after the Token tab's SimpleCard
// items: filled tile, period label, "used / limit", progress, reset hint.
// The long token budgets also carry a reset button in the header row:
// enabled while presses remain, disabled (with the renewal date) once the
// floating quota is spent.
const UserCard: React.FC<{
  title: string;
  hint: string;
  rateWindow: RateLimitWindowUsage;
  resetStatus?: RateLimitResetStatus;
  onReset?: () => void;
}> = ({ title, hint, rateWindow, resetStatus, onReset }) => {
  const intl = useIntl();
  const t = (id: string) => intl.formatMessage({ id });
  const { used, limit, reset_seconds } = rateWindow;

  const resetButton =
    onReset && resetStatus ? (
      resetStatus.available <= 0 ? (
        <Tooltip
          title={intl.formatMessage(
            { id: 'usage.rateLimits.resetQuotaExhausted' },
            {
              date: resetStatus.next_available_at
                ? new Intl.DateTimeFormat(intl.locale, {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                  }).format(new Date(resetStatus.next_available_at))
                : '—'
            }
          )}
        >
          {/* The tooltip must survive the disabled state: a disabled button
              swallows pointer events, the span keeps them alive. */}
          <span>
            <Button size="small" disabled>
              {t('usage.rateLimits.resetButton')}
            </Button>
          </span>
        </Tooltip>
      ) : (
        <Button size="small" onClick={onReset}>
          {t('usage.rateLimits.resetButton')}
        </Button>
      )
    ) : null;

  return (
    <Flex
      vertical
      gap={4}
      style={{
        flex: 1,
        minWidth: 200,
        padding: '12px 16px',
        backgroundColor: 'var(--ant-color-fill-quaternary)',
        borderRadius: 6
      }}
    >
      <Flex align="center" justify="space-between" gap={8}>
        <Tooltip title={hint}>
          <span className="text-secondary" style={{ fontSize: 13 }}>
            {title}{' '}
            <QuestionCircleOutlined style={{ color: 'gray', fontSize: 12 }} />
          </span>
        </Tooltip>
        {resetButton}
      </Flex>
      <span style={{ fontSize: 20, fontWeight: 600, whiteSpace: 'nowrap' }}>
        {used == null ? '—' : num(used, intl.locale)}{' '}
        <span
          className="text-secondary"
          style={{ fontSize: 13, fontWeight: 400 }}
        >
          / {num(limit, intl.locale)}
        </span>
      </span>
      {used != null && (
        <Progress
          size="small"
          showInfo={false}
          {...usageProgressProps(rateWindow)}
        />
      )}
      {reset_seconds != null && (
        <span className="text-secondary" style={{ fontSize: 12 }}>
          {intl.formatMessage(
            { id: 'usage.rateLimits.resetsIn' },
            { time: humanizeDuration(reset_seconds, intl) }
          )}
        </span>
      )}
    </Flex>
  );
};

// The per-model concurrency table. Rows arrive from the rate-limits
// endpoint already itemized over the user's ready models, busiest first:
// ``running`` is the user's own in-flight count from the gateway's
// per-user counter, ``limit`` their per-model override or the deployment
// default. A count at the limit is where the user's 429 concurrent-request
// rejections come from, so the bar lights up red there. A missing count
// (local mode, Redis error) renders as a dash.
const ModelConcurrencyTable: React.FC<{
  rows: ModelConcurrencyUsage[];
}> = ({ rows }) => {
  const intl = useIntl();
  const t = (id: string) => intl.formatMessage({ id });

  const columns: ColumnsType<ModelConcurrencyUsage> = [
    {
      title: t('usage.rateLimits.concurrency.model'),
      dataIndex: 'model',
      ellipsis: true
    },
    {
      title: t('usage.rateLimits.concurrency.running'),
      width: 190,
      render: (_, record) => {
        const { running, limit } = record;
        if (running == null) return <span className="text-secondary">—</span>;
        // An explicit 0 cap means the model is unlimited for this account:
        // no bar, just the count.
        if (!limit) return running;
        return (
          <Progress
            size="small"
            percent={Math.min(100, (running / limit) * 100)}
            status={running >= limit ? ('exception' as const) : undefined}
            showInfo
            format={() => `${running} / ${limit}`}
          />
        );
      }
    }
  ];

  return (
    <Table<ModelConcurrencyUsage>
      rowKey="model"
      columns={columns}
      dataSource={rows}
      pagination={false}
      scroll={{ x: 'max-content' }}
    />
  );
};

const RateLimitsCard: React.FC<{
  userId?: number;
  // Bumped by the toolbar refresh to refetch alongside the breakdown.
  refreshKey?: number;
}> = ({ userId, refreshKey }) => {
  const intl = useIntl();
  const t = (id: string) => intl.formatMessage({ id });
  const { detailData: data, loading, fetchData } = useQueryRateLimits(userId);
  // Which long budget's reset dialog is open, and whether its POST is in
  // flight — the dialog's OK button shows the spinner and stays disabled.
  const [resetKind, setResetKind] = useState<'weekly' | 'monthly' | null>(null);
  const [resetLoading, setResetLoading] = useState(false);

  // Refetch on a filter change (userId pins the target user — undefined =
  // the caller) and on the toolbar's refresh bump. fetchData's identity
  // changes every render, so it stays out of the dependency list on purpose.
  useEffect(() => {
    fetchData();
  }, [userId, refreshKey]);

  const submitReset = async (description: string) => {
    if (!resetKind) return;
    setResetLoading(true);
    try {
      const status = await resetRateLimit({
        kind: resetKind,
        description,
        user_id: userId
      });
      // The decision model judged the description before the counters
      // cleared. A rejection answers 200 with the model's reason — the
      // press consumed nothing, so the dialog stays open with the note and
      // the page needs no refetch.
      if (status?.status === 'rejected') {
        message.error(
          t(
            REJECTION_REASON_IDS[status.rejection_reason ?? ''] ??
              REJECTION_REASON_IDS['']
          )
        );
        return;
      }
      message.success(t('usage.rateLimits.resetSuccess'));
      setResetKind(null);
      // The counters are gone server-side; refetch shows the fresh window.
      await fetchData();
    } catch {
      // The global request handler reported the failure; keep the dialog
      // open so the reason note is not lost to a retry.
    } finally {
      setResetLoading(false);
    }
  };

  // Live counters exist only when the server reads them from Redis and the
  // read succeeded — the window's own `used` absence encodes exactly that
  // (the backend omits it in local mode and on usage errors), so every card
  // keys off `used != null` rather than a separate mode check. The
  // concurrency table's counts ride the same payload and degrade to dashes
  // on their own.

  // Unknown mode = the first fetch has not answered yet: hold the section's
  // place so the page does not jump when it fills in. 'disabled' then
  // removes it entirely — the feature is off server-side.
  if (!data?.mode) {
    return loading ? (
      <CardWrapper style={{ paddingBlock: 16 }}>
        <Flex justify="center" align="center" style={{ minHeight: 80 }}>
          <Spin />
        </Flex>
      </CardWrapper>
    ) : null;
  }
  if (data.mode === 'disabled') return null;

  const userWindows = USER_CARDS.map(
    ({ kind, period, titleId, hintId, resetKind }) => ({
      title: t(titleId),
      hint: t(hintId),
      window: data.user.windows.find(
        (w) => w.kind === kind && w.period === period
      ),
      resetStatus:
        resetKind != null ? data.user.resets?.[resetKind] : undefined,
      resetKind
    })
  ).filter(
    (
      card
    ): card is {
      title: string;
      hint: string;
      window: RateLimitWindowUsage;
      resetStatus: RateLimitResetStatus | undefined;
      resetKind: 'weekly' | 'monthly' | undefined;
    } => card.window != null
  );
  const hasModels = (data.user.model_concurrency ?? []).length > 0;

  return (
    <CardWrapper style={{ paddingBlock: 16 }}>
      {/* Same header shape as the domain sections; the bar keeps the secondary
          text color (currentColor) — this section is informational, not one of
          the three charted domains that each carry a vivid accent. */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          rowGap: 4,
          flexWrap: 'wrap',
          marginBottom: 12
        }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <span
            className="text-secondary"
            style={{
              width: 4,
              height: 14,
              borderRadius: 2,
              background: 'currentColor'
            }}
          />
          <span className="font-600" style={{ fontSize: 15 }}>
            {t('usage.rateLimits.title')}
          </span>
        </span>
        {data.free?.active && (
          <Tooltip title={t('usage.rateLimits.freeActiveHint')}>
            <Tag color="green" style={{ marginInlineEnd: 0 }}>
              {t('usage.rateLimits.freeActive')}
            </Tag>
          </Tooltip>
        )}
      </div>

      {data.mode === 'local' && (
        <Alert
          type="info"
          showIcon
          message={t('usage.rateLimits.usageUnavailable')}
          style={{ marginBottom: 16 }}
        />
      )}
      {data.usage_error && (
        <Alert
          type="warning"
          showIcon
          // Deliberately generic: the server error string is not shown.
          message={t('usage.rateLimits.usageError')}
          style={{ marginBottom: 16 }}
        />
      )}

      {userWindows.length > 0 || hasModels ? (
        <>
          {userWindows.length > 0 && (
            <Flex
              gap={12}
              wrap="wrap"
              style={{ marginBottom: hasModels ? 16 : 0 }}
            >
              {userWindows.map(
                ({ title, hint, window, resetStatus, resetKind }) => (
                  <UserCard
                    key={`${window.kind}:${window.period}`}
                    title={title}
                    hint={hint}
                    rateWindow={window}
                    resetStatus={resetStatus}
                    onReset={
                      resetKind != null
                        ? () => setResetKind(resetKind)
                        : undefined
                    }
                  />
                )
              )}
            </Flex>
          )}
          {hasModels && (
            <>
              <Flex align="center" gap={4} style={{ marginBottom: 8 }}>
                <Tooltip title={t('usage.rateLimits.concurrency.hint')}>
                  <span
                    className="text-secondary"
                    style={{ fontSize: 13, cursor: 'help' }}
                  >
                    {t('usage.rateLimits.concurrency.title')}{' '}
                    <QuestionCircleOutlined
                      style={{ color: 'gray', fontSize: 12 }}
                    />
                  </span>
                </Tooltip>
              </Flex>
              <ModelConcurrencyTable rows={data.user.model_concurrency ?? []} />
            </>
          )}
        </>
      ) : (
        <span className="text-secondary">{t('usage.rateLimits.noLimits')}</span>
      )}

      <ResetLimitModal
        open={resetKind != null}
        status={resetKind ? data.user.resets?.[resetKind] : undefined}
        confirmLoading={resetLoading}
        onOk={submitReset}
        onCancel={() => setResetKind(null)}
      />
    </CardWrapper>
  );
};

export default RateLimitsCard;
