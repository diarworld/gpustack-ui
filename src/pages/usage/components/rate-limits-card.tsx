/**
 * Rate Limits section of the Usage page.
 *
 * Fed by GET /usage/rate-limits, which reports the target user's limits and
 * their live usage. Self-scoped by default; an admin's single-user filter
 * selection pins the target via ``user_id`` — the endpoint degrades a
 * foreign id back to the caller when the caller may not see it.
 *
 * Layout mirrors the Token tab: user-level cards (RPM / TPM rate caps and
 * the weekly / monthly token budgets — all shared across the user's keys) on
 * top, the per-key table (its own daily quota) below. The server's `mode`
 * drives the display:
 *   'disabled' — render nothing at all (feature off server-side);
 *   'local'    — limits without counters (no shared Redis), plus an info note;
 *   'redis'    — limits plus live usage; a `usage_error` blanks the counters
 *                again and surfaces a warning instead.
 */
import { QuestionCircleOutlined } from '@ant-design/icons';
import { CardWrapper } from '@gpustack/core-ui';
import { useIntl } from '@umijs/max';
import { Alert, Flex, Progress, Spin, Table, Tooltip } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useEffect } from 'react';
import { ApiKeyRateLimits, RateLimitWindowUsage } from '../config/types';
import useQueryRateLimits from '../services/use-query-rate-limits';

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

// Quota values in the reader's locale: 100000000 → '100M' (en) / '100 млн'
// (ru). `notation: 'compact'` picks each locale's own scale words.
const num = (n: number, locale: string): string =>
  new Intl.NumberFormat(locale, {
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(Math.round(n * 100) / 100);

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

// One cell of the per-key table: "used / limit" over a mini bar that turns
// red at the limit. `used` missing (local mode / usage error) degrades the
// cell to "— / limit" — the cap is still real, only the counter is unknown —
// and a missing window (limit not set) collapses to a bare dash.
const WindowUsageCell: React.FC<{
  rateWindow?: RateLimitWindowUsage;
}> = ({ rateWindow }) => {
  const intl = useIntl();
  if (!rateWindow) return <span className="text-secondary">—</span>;
  const { used, limit } = rateWindow;
  return (
    <Flex vertical gap={2} style={{ minWidth: 96 }}>
      <span style={{ whiteSpace: 'nowrap' }}>
        {used == null ? '—' : num(used, intl.locale)} /{' '}
        {num(limit, intl.locale)}
      </span>
      {used != null && (
        <Progress
          size="small"
          showInfo={false}
          {...usageProgressProps(rateWindow)}
        />
      )}
    </Flex>
  );
};

// The windows the per-key table shows, in display order. Rate caps and the
// weekly / monthly budgets are user-level (shared across all the user's
// keys, rendered on the cards above), so a key row only carries the window
// that actually buckets on the key: its daily quota.
const WINDOWS = [
  {
    kind: 'token_calendar',
    period: 'each_day',
    titleId: 'usage.rateLimits.daily'
  }
] as const;

// The user-level cards, in display order: the rate caps (requests and tokens
// per minute, bucketed across all the user's keys) and the token budgets.
// Each card's ``?`` tooltip explains the axis, mirroring the user form's
// description tooltips. A window the server did not send (cap unset with no
// deployment default) simply renders no card.
const USER_CARDS = [
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
    hintId: 'usage.rateLimits.weeklyHint'
  },
  {
    kind: 'token_calendar',
    period: 'each_month',
    titleId: 'usage.rateLimits.monthly',
    hintId: 'usage.rateLimits.monthlyHint'
  }
] as const;

// One user-level period tile, styled after the Token tab's SimpleCard
// items: filled tile, period label, "used / limit", progress, reset hint.
const UserCard: React.FC<{
  title: string;
  hint: string;
  rateWindow: RateLimitWindowUsage;
}> = ({ title, hint, rateWindow }) => {
  const intl = useIntl();
  const { used, limit, reset_seconds } = rateWindow;
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
      <Tooltip title={hint}>
        <span className="text-secondary" style={{ fontSize: 13 }}>
          {title}{' '}
          <QuestionCircleOutlined style={{ color: 'gray', fontSize: 12 }} />
        </span>
      </Tooltip>
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

const RateLimitsCard: React.FC<{
  userId?: number;
  // Bumped by the toolbar refresh to refetch alongside the breakdown.
  refreshKey?: number;
}> = ({ userId, refreshKey }) => {
  const intl = useIntl();
  const t = (id: string) => intl.formatMessage({ id });
  const { detailData: data, loading, fetchData } = useQueryRateLimits(userId);

  // Refetch on a filter change (userId pins the target user — undefined =
  // the caller) and on the toolbar's refresh bump. fetchData's identity
  // changes every render, so it stays out of the dependency list on purpose.
  useEffect(() => {
    fetchData();
  }, [userId, refreshKey]);

  // Live counters exist only when the server reads them from Redis and the
  // read succeeded — the window's own `used` absence encodes exactly that
  // (the backend omits it in local mode and on usage errors), so every cell
  // keys off `used != null` rather than a separate mode check.

  const columns: ColumnsType<ApiKeyRateLimits> = [
    {
      title: t('usage.rateLimits.key'),
      dataIndex: 'name',
      ellipsis: true
    },
    ...WINDOWS.map(({ kind, period, titleId }) => ({
      title: t(titleId),
      width: 120,
      render: (_: unknown, record: ApiKeyRateLimits) => (
        <WindowUsageCell
          rateWindow={record.windows?.find(
            (w) => w.kind === kind && w.period === period
          )}
        />
      )
    }))
  ];

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

  const userWindows = USER_CARDS.map(({ kind, period, titleId, hintId }) => ({
    title: t(titleId),
    hint: t(hintId),
    window: data.user.windows.find(
      (w) => w.kind === kind && w.period === period
    )
  })).filter(
    (
      card
    ): card is {
      title: string;
      hint: string;
      window: RateLimitWindowUsage;
    } => card.window != null
  );
  const hasKeys = (data.api_keys?.length ?? 0) > 0;

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

      {userWindows.length > 0 || hasKeys ? (
        <>
          {userWindows.length > 0 && (
            <Flex
              gap={12}
              wrap="wrap"
              style={{ marginBottom: hasKeys ? 16 : 0 }}
            >
              {userWindows.map(({ title, hint, window }) => (
                <UserCard
                  key={`${window.kind}:${window.period}`}
                  title={title}
                  hint={hint}
                  rateWindow={window}
                />
              ))}
            </Flex>
          )}
          {hasKeys && (
            <Table<ApiKeyRateLimits>
              rowKey="id"
              columns={columns}
              dataSource={data.api_keys}
              loading={loading}
              pagination={false}
              scroll={{ x: 'max-content' }}
            />
          )}
        </>
      ) : (
        <span className="text-secondary">{t('usage.rateLimits.noLimits')}</span>
      )}
    </CardWrapper>
  );
};

export default RateLimitsCard;
