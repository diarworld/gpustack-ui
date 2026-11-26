/**
 * One limit cell of the admin's cross-user limits table.
 *
 * Resting state is the personal card's "used / limit" over a mini bar
 * (red at the limit); a click turns the cell into an inline editor — one
 * number and confirm / cancel buttons — without opening any popup, the
 * same affordance the PD replicas cell offers. An empty input saves
 * ``null`` ("the deployment default governs this axis"), matching the
 * users form's cleared field.
 */
import { formatCompactNumber } from '@/utils/format-compact-number';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';
import { Button, Flex, InputNumber, Progress, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { RateLimitWindowUsage } from '../../config/types';

// Progress-bar props shared with the personal card: the percent clamps
// to [0, 100] and the bar turns red at the limit. `used` unknown (local
// mode / Redis error) yields percent 0 — the caller renders no bar.
const usageProgressProps = (w: RateLimitWindowUsage) => ({
  percent:
    w.used == null || w.limit <= 0
      ? 0
      : Math.min(100, (w.used / w.limit) * 100),
  status:
    w.used != null && w.used >= w.limit ? ('exception' as const) : undefined
});

const LimitCell: React.FC<{
  window?: RateLimitWindowUsage;
  // Persist one typed value; empty input arrives as null ("inherit").
  // Resolves after the row is saved (or throws, keeping the editor open
  // over the global error toast).
  onSave: (value: number | null) => Promise<void>;
}> = ({ window: rateWindow, onSave }) => {
  const intl = useIntl();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState<number | null | undefined>(undefined);
  const [saving, setSaving] = useState(false);

  // Resting value each time the editor opens: the effective limit — the
  // same number the cell shows — so confirm without changes is a no-op
  // and the dirty check starts from what is on screen.
  const initial = rateWindow?.limit ?? null;

  useEffect(() => {
    if (editing) {
      setValue(initial);
    }
  }, [editing, initial]);

  const dirty = (value ?? null) !== initial;
  const confirm = async () => {
    if (!dirty || saving) return;
    setSaving(true);
    try {
      await onSave(value ?? null);
      setEditing(false);
    } catch {
      // The global request handler reported the failure; keep the
      // editor open so the typed value survives a retry.
    } finally {
      setSaving(false);
    }
  };

  if (!editing) {
    const { used, limit } = rateWindow ?? {};
    return (
      <Flex
        vertical
        gap={2}
        style={{ minWidth: 96, cursor: 'pointer' }}
        onClick={() => setEditing(true)}
      >
        <span style={{ whiteSpace: 'nowrap' }}>
          {used == null ? '—' : formatCompactNumber(used, intl.locale)} /{' '}
          {rateWindow ? formatCompactNumber(limit, intl.locale) : '—'}
        </span>
        {rateWindow && used != null && (
          <Progress
            size="small"
            showInfo={false}
            {...usageProgressProps(rateWindow)}
          />
        )}
      </Flex>
    );
  }

  return (
    <Flex align="center" gap={4} onClick={(e) => e.stopPropagation()}>
      <InputNumber
        size="small"
        min={1}
        precision={0}
        style={{ width: 100 }}
        value={value ?? undefined}
        onChange={(v) => setValue(v ?? null)}
        onPressEnter={confirm}
        onKeyDown={(e) => {
          if (e.key === 'Escape') setEditing(false);
        }}
        autoFocus
      />
      <Tooltip title={intl.formatMessage({ id: 'common.button.confirm' })}>
        <Button
          type="text"
          size="small"
          loading={saving}
          disabled={!dirty}
          icon={<CheckOutlined />}
          onClick={confirm}
          aria-label={intl.formatMessage({ id: 'common.button.confirm' })}
        />
      </Tooltip>
      <Tooltip title={intl.formatMessage({ id: 'common.button.cancel' })}>
        <Button
          type="text"
          size="small"
          icon={<CloseOutlined />}
          onClick={() => setEditing(false)}
          aria-label={intl.formatMessage({ id: 'common.button.cancel' })}
        />
      </Tooltip>
    </Flex>
  );
};

export default LimitCell;
