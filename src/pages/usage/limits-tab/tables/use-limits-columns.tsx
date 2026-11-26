/**
 * Columns of the admin's cross-user limits table.
 *
 * The name column sorts alphabetically (server-side) and carries the
 * hover tooltip the Events tab's name cell established: "Full name" as
 * the first line — the literal English label, not localized, because it
 * names the directory field — then the non-empty attribute lines. The
 * four limit columns share the personal card's window identities
 * (kind + period) and its hint texts, render the inline editor cell,
 * and sort server-side on the live counter falling back to the limit.
 */
import { tableSorter } from '@/config/settings';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { DropdownButtons, icons } from '@gpustack/core-ui';
import { useIntl } from '@umijs/max';
import { Tooltip } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useMemo } from 'react';
import { UserRateLimitUsage } from '../../config/types';
import LimitCell from './limit-cell';

export interface LimitColumnConfig {
  key: 'rpm' | 'tpm' | 'weekly' | 'monthly';
  kind: 'query' | 'token_rolling' | 'token_calendar';
  period: string;
  titleId: string;
  hintId: string;
  // The users API field the inline editor persists to.
  field:
    | 'rpm_limit'
    | 'tpm_limit'
    | 'weekly_token_limit'
    | 'monthly_token_limit';
}

// Same identities the personal card and the backend table window map use;
// a user without an effective limit for an axis has no window there and
// the cell renders its editor against nothing (dash until edited).
export const LIMIT_COLUMNS: LimitColumnConfig[] = [
  {
    key: 'rpm',
    kind: 'query',
    period: '60s',
    titleId: 'usage.rateLimits.rpm',
    hintId: 'usage.rateLimits.rpmHint',
    field: 'rpm_limit'
  },
  {
    key: 'tpm',
    kind: 'token_rolling',
    period: '60s',
    titleId: 'usage.rateLimits.tpm',
    hintId: 'usage.rateLimits.tpmHint',
    field: 'tpm_limit'
  },
  {
    key: 'weekly',
    kind: 'token_rolling',
    period: '604800s',
    titleId: 'usage.rateLimits.weekly',
    hintId: 'usage.rateLimits.weeklyHint',
    field: 'weekly_token_limit'
  },
  {
    key: 'monthly',
    kind: 'token_calendar',
    period: 'each_month',
    titleId: 'usage.rateLimits.monthly',
    hintId: 'usage.rateLimits.monthlyHint',
    field: 'monthly_token_limit'
  }
];

interface ColumnsHookProps {
  handleSelect: (val: string, record: UserRateLimitUsage) => void;
  // Persist one typed limit value for the row; resolves after the row is
  // saved (or throws, leaving the cell's editor open).
  handleSaveLimit: (
    record: UserRateLimitUsage,
    field: LimitColumnConfig['field'],
    value: number | null
  ) => Promise<void>;
}

const useLimitsColumns = ({
  handleSelect,
  handleSaveLimit
}: ColumnsHookProps): ColumnsType<UserRateLimitUsage> => {
  const intl = useIntl();

  return useMemo(() => {
    return [
      {
        title: intl.formatMessage({ id: 'common.table.name' }),
        dataIndex: 'username',
        key: 'username',
        width: 260,
        sorter: tableSorter(1),
        render: (text: string, record: UserRateLimitUsage) => {
          // The tooltip mirrors the Events tab's name cell: the full
          // name line first, then only the attributes the user holds.
          const attrs: [string, string][] = [];
          (
            [
              ['usage.events.tooltip.businessUnit', record.business_unit],
              ['usage.events.tooltip.department', record.department],
              ['usage.events.tooltip.profession', record.profession]
            ] as [string, string | undefined][]
          ).forEach(([id, val]) => {
            if (val) {
              attrs.push([id, val]);
            }
          });
          return (
            <Tooltip
              title={
                <>
                  <div>Full name: {record.full_name || record.username}</div>
                  {attrs.map(([id, val]) => (
                    <div key={id}>
                      {intl.formatMessage({ id })}: {val}
                    </div>
                  ))}
                </>
              }
            >
              <span className="text-primary" style={{ cursor: 'default' }}>
                {text}
              </span>
            </Tooltip>
          );
        }
      },
      ...LIMIT_COLUMNS.map(
        ({ key, kind, period, titleId, hintId, field }: LimitColumnConfig) => ({
          title: (
            <span>
              {intl.formatMessage({ id: titleId })}
              <Tooltip title={intl.formatMessage({ id: hintId })}>
                <QuestionCircleOutlined style={{ opacity: 0.6 }} />
              </Tooltip>
            </span>
          ),
          dataIndex: key,
          key,
          width: 150,
          sorter: tableSorter(1),
          // Server-sorted (the sort_by param rides the query); the table
          // loads busiest-month first, this only puts the arrow in the
          // matching state.
          ...(key === 'monthly' ? { defaultSortOrder: 'descend' } : {}),
          render: (_: unknown, record: UserRateLimitUsage) => (
            <LimitCell
              window={record.windows.find(
                (w) => w.kind === kind && w.period === period
              )}
              onSave={(value) => handleSaveLimit(record, field, value)}
            />
          )
        })
      ),
      {
        title: intl.formatMessage({ id: 'common.table.operation' }),
        key: 'operation',
        dataIndex: 'operation',
        width: 100,
        render: (_: unknown, record: UserRateLimitUsage) => (
          <DropdownButtons
            items={[
              {
                label: 'common.button.edit',
                key: 'edit',
                icon: icons.EditOutlined
              }
            ]}
            onSelect={(val: string) => handleSelect(val, record)}
          />
        )
      }
    ];
  }, [intl, handleSelect, handleSaveLimit]);
};

export default useLimitsColumns;
