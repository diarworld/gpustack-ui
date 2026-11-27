/**
 * "Limit resets" tab of the Usage page — the platform admin's audit view.
 *
 * One row per recorded press on the reset buttons, read back from the
 * gateway's ``gateway_rate_limit_resets`` trail: whose budget was
 * forgiven (or refused), which window, and what the decision model made
 * of the description. The tab mounts behind the canSeeAdmin gate — the
 * backend 403s everyone else — and its filter set mirrors the limits
 * table's shape: the user picker (a server-side user_id filter), the
 * work-type select (a server-side work_type filter) and the verdict
 * select, landing on approved.
 */
import { PaginationKey } from '@/config/settings';
import useTableFetch from '@/hooks/use-table-fetch';
import { SyncOutlined } from '@ant-design/icons';
import { AutoTooltip } from '@gpustack/core-ui';
import { useIntl } from '@umijs/max';
import { Button, Flex, Select, Table, Tooltip } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useMemo } from 'react';
import {
  queryRateLimitResets,
  USAGE_RATE_LIMITS_RESETS_EXPORT,
  USAGE_RATE_LIMITS_RESETS_EXPORT_ESTIMATE
} from '../apis';
import ExportDropdown from '../components/export-dropdown';
import { REJECTION_REASON_IDS } from '../components/rate-limits-card';
import UserAttributeFilters from '../components/user-attribute-filters';
import { RateLimitResetUsage } from '../config/types';
import useExportUsage from '../services/use-export-usage';
import useQueryUsageMetaData from '../services/use-query-meta-data';
import useQueryUserAttributeOptions from '../services/use-query-user-attribute-options';

// The decision model's task classifications, mapped to their locale
// keys; a value the backend adds later falls back to the raw code.
const WORK_TYPE_IDS: Record<string, string> = {
  SoftwareDevelopment: 'usage.rateLimits.workTypes.SoftwareDevelopment',
  QA: 'usage.rateLimits.workTypes.QA',
  Data: 'usage.rateLimits.workTypes.Data',
  Run: 'usage.rateLimits.workTypes.Run',
  InfoSec: 'usage.rateLimits.workTypes.InfoSec',
  UIUX: 'usage.rateLimits.workTypes.UIUX',
  Management: 'usage.rateLimits.workTypes.Management',
  SupportServiceDesk: 'usage.rateLimits.workTypes.SupportServiceDesk',
  Unknown: 'usage.rateLimits.workTypes.Unknown'
};

const UsersRateLimitResets: React.FC = () => {
  const intl = useIntl();
  const { detailData: metaData, fetchData: fetchMetaData } =
    useQueryUsageMetaData();
  const { detailData: attributeOptions, fetchData: fetchAttributeOptions } =
    useQueryUserAttributeOptions();
  const {
    dataSource,
    queryParams,
    fetchData,
    handlePageChange,
    handleQueryChange,
    handleSearch
  } = useTableFetch<RateLimitResetUsage>({
    key: PaginationKey.UserRateLimitResets,
    fetchAPI: queryRateLimitResets,
    // Approved presses only on landing — the refused ones are audit
    // noise until someone asks for them ('' selects every verdict).
    defaultQueryParams: { outcome: 'approved' }
  });

  useEffect(() => {
    // include_all_users: the meta options derive from usage rows, so a
    // provisioned account that never called would be unpickable — the
    // table must list every account's presses, not just its callers.
    fetchMetaData({ include_all_users: true });
    // The attribute pickers' label lists (one request per page, shared
    // with the other tabs through the fetch key).
    fetchAttributeOptions({});
  }, []);

  // "Export Table Data" streams the audit table as one file — the same
  // rows the list serves (the picker, verdict and work-type filters
  // included), with the tooltip's user fields spelled out as columns.
  const { exportWithPreflight, exporting: exportingTable } = useExportUsage({
    exportUrl: USAGE_RATE_LIMITS_RESETS_EXPORT,
    estimateUrl: USAGE_RATE_LIMITS_RESETS_EXPORT_ESTIMATE
  });
  const handleExportTable = () => {
    exportWithPreflight({
      user_id: queryParams.user_id || undefined,
      outcome: queryParams.outcome || undefined,
      work_type: queryParams.work_type || undefined,
      business_unit: queryParams.business_unit || undefined,
      department: queryParams.department || undefined,
      profession: queryParams.profession || undefined,
      format: 'xlsx'
    });
  };

  const userOptions = useMemo(() => {
    return (metaData?.users ?? [])
      .map((item) => {
        // "Full name [login]" — the Users table's option format, so a
        // search on either part hits.
        const displayName = item.display_name?.trim();
        const label =
          displayName && displayName !== item.label
            ? `${displayName} [${item.label}]`
            : item.label;
        return {
          value: item.identity?.current?.user_id ?? null,
          label
        };
      })
      .filter(
        (opt): opt is { value: number; label: string } => opt.value != null
      );
  }, [metaData?.users]);

  const workTypeOptions = useMemo(
    () => [
      ...Object.entries(WORK_TYPE_IDS).map(([value, id]) => ({
        value,
        label: intl.formatMessage({ id })
      })),
      {
        value: '',
        label: intl.formatMessage({ id: 'usage.rateLimits.resets.statusAll' })
      }
    ],
    [intl]
  );

  const statusOptions = useMemo(
    () => [
      {
        value: 'approved',
        label: intl.formatMessage({
          id: 'usage.rateLimits.resets.statusApproved'
        })
      },
      {
        value: 'rejected',
        label: intl.formatMessage({
          id: 'usage.rateLimits.resets.statusRejected'
        })
      },
      {
        value: '',
        label: intl.formatMessage({ id: 'usage.rateLimits.resets.statusAll' })
      }
    ],
    [intl]
  );

  const columns = useMemo(
    () => [
      {
        title: intl.formatMessage({ id: 'usage.events.col.time' }),
        dataIndex: 'reset_at',
        key: 'reset_at',
        // Wide enough for the formatted instant to stay on one line, the
        // way the Events tab's time column sits.
        width: 200,
        render: (v: string) =>
          v ? dayjs(v).format('YYYY-MM-DD HH:mm:ss') : '-'
      },
      {
        title: intl.formatMessage({ id: 'usage.table.name' }),
        dataIndex: 'username',
        key: 'username',
        width: 220,
        render: (v: string | undefined, record: RateLimitResetUsage) => {
          // A deleted account leaves the row nameless: the id keeps the
          // audit trail pointing at something, with no tooltip (the
          // directory has nothing left to resolve).
          const label = v || `#${record.user_id}`;
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
          if (!record.full_name && attrs.length === 0) {
            return label;
          }
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
              placement="topLeft"
            >
              <span className="text-primary" style={{ cursor: 'default' }}>
                {label}
              </span>
            </Tooltip>
          );
        }
      },
      {
        title: intl.formatMessage({ id: 'usage.rateLimits.resets.colLimit' }),
        dataIndex: 'kind',
        key: 'kind',
        width: 120,
        render: (v: string) => {
          // The forgiven budget; only the long token windows have reset
          // buttons, so anything else is a future kind — raw until named.
          const id =
            v === 'weekly'
              ? 'usage.rateLimits.weekly'
              : v === 'monthly'
                ? 'usage.rateLimits.monthly'
                : null;
          return id ? intl.formatMessage({ id }) : v;
        }
      },
      {
        title: intl.formatMessage({
          id: 'usage.rateLimits.resets.colWorkType'
        }),
        dataIndex: 'work_type',
        key: 'work_type',
        width: 200,
        render: (v?: string | null) => {
          // The gate classifies approved presses only; a refused one (or
          // an ungated admin press) has nothing to show.
          if (!v) return '-';
          const id = WORK_TYPE_IDS[v];
          return id ? intl.formatMessage({ id }) : v;
        }
      },
      {
        title: intl.formatMessage({
          id: 'usage.rateLimits.resets.colRejectionReason'
        }),
        dataIndex: 'rejection_reason',
        key: 'rejection_reason',
        width: 240,
        render: (v?: string | null) => {
          if (!v) return '-';
          const id = REJECTION_REASON_IDS[v];
          return id ? intl.formatMessage({ id }) : v;
        }
      },
      {
        title: intl.formatMessage({
          id: 'usage.rateLimits.resets.colDescription'
        }),
        dataIndex: 'description',
        key: 'description',
        render: (v?: string) => (
          <AutoTooltip style={{ maxWidth: 520 }} title={v || '-'}>
            <span>{v || '-'}</span>
          </AutoTooltip>
        )
      }
    ],
    [intl]
  );

  return (
    <div>
      {/* The filter row owns the spacing to the table (marginBottom: 16,
          gap: 8) — the same layout the limits table sits in. */}
      <Flex gap={8} align="center" wrap="wrap" style={{ marginBottom: 16 }}>
        {/* The picker doubles as the table's server-side user_id filter. */}
        <Select
          allowClear
          showSearch
          optionFilterProp="label"
          style={{ minWidth: 220 }}
          value={queryParams.user_id || undefined}
          onChange={(value) =>
            handleQueryChange({ page: 1, user_id: value ?? '' })
          }
          options={userOptions}
          placeholder={intl.formatMessage({ id: 'usage.filter.user' })}
        />
        {/* '' selects every classification; absent from the query. */}
        <Select
          style={{ minWidth: 200 }}
          value={queryParams.work_type || ''}
          onChange={(value) =>
            handleQueryChange({ page: 1, work_type: value ?? '' })
          }
          options={workTypeOptions}
          placeholder={intl.formatMessage({
            id: 'usage.rateLimits.resets.colWorkType'
          })}
        />
        <Select
          style={{ minWidth: 160 }}
          value={queryParams.outcome || ''}
          onChange={(value) =>
            handleQueryChange({ page: 1, outcome: value ?? '' })
          }
          options={statusOptions}
          placeholder={intl.formatMessage({
            id: 'usage.rateLimits.resets.status'
          })}
        />
        {/* The attribute pickers narrow the presses to the budget owners
            whose OIDC attribute labels match — server-resolved, like the
            user_id filter. */}
        <UserAttributeFilters
          value={queryParams}
          onChange={(values) => handleQueryChange({ page: 1, ...values })}
          options={attributeOptions}
        />
        <Button
          type="text"
          style={{ color: 'var(--ant-color-text-tertiary)' }}
          onClick={handleSearch}
          aria-label={intl.formatMessage({ id: 'common.button.refresh' })}
          title={intl.formatMessage({ id: 'common.button.refresh' })}
          icon={<SyncOutlined />}
        />
        <ExportDropdown
          onExportTable={handleExportTable}
          exporting={exportingTable}
        />
      </Flex>
      <Table<RateLimitResetUsage>
        className={'scroll-table'}
        columns={columns as any}
        dataSource={dataSource.dataList}
        loading={{
          spinning: dataSource.loading,
          size: 'middle'
        }}
        showSorterTooltip={false}
        rowKey="id"
        pagination={{
          size: 'middle',
          showSizeChanger: true,
          pageSize: queryParams.perPage,
          current: queryParams.page,
          total: dataSource.total,
          hideOnSinglePage: queryParams.perPage === 10,
          onChange: handlePageChange
        }}
      ></Table>
    </div>
  );
};

export default UsersRateLimitResets;
