/**
 * The admin's cross-user limits table — the "Limits" tab for platform
 * admins.
 *
 * One row per active user: effective limits (groups and deployment
 * defaults already resolved server-side) paired with the live window
 * counters, served with server-side pagination and sorting. The filter
 * set mirrors the tab's old shape — a user picker and refresh — because
 * nothing here is time-ranged. The personal cards are not duplicated
 * here: the admin edits any user's limits inline in the cells, opens the
 * full user drawer from the row menu, and keeps the reset buttons out of
 * the way (regular users still have them on their own cards).
 */
import { PageAction } from '@/config';
import { PaginationKey, TABLE_SORT_DIRECTIONS } from '@/config/settings';
import type { PageActionType } from '@/config/types';
import useTableFetch from '@/hooks/use-table-fetch';
import { getUser, updateUser, updateUserLimits } from '@/pages/users/apis';
import AddModal from '@/pages/users/components/add-modal';
import { UserRoles } from '@/pages/users/config';
import { FormData, ListItem } from '@/pages/users/config/types';
import { SyncOutlined } from '@ant-design/icons';
import { IconFont, NoResult } from '@gpustack/core-ui';
import { useIntl } from '@umijs/max';
import {
  Alert,
  Button,
  ConfigProvider,
  Flex,
  Select,
  Table,
  message
} from 'antd';
import _ from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import {
  USAGE_RATE_LIMITS_USERS_EXPORT,
  USAGE_RATE_LIMITS_USERS_EXPORT_ESTIMATE
} from '../../apis';
import ExportDropdown from '../../components/export-dropdown';
import { UserRateLimitUsage } from '../../config/types';
import useExportUsage from '../../services/use-export-usage';
import useQueryUsageMetaData from '../../services/use-query-meta-data';
import useQueryUsersRateLimits from '../services/use-query-users-rate-limits';
import useLimitsColumns, { LimitColumnConfig } from './use-limits-columns';

const UsersLimitsTable: React.FC = () => {
  const intl = useIntl();
  const { detailData: metaData, fetchData: fetchMetaData } =
    useQueryUsageMetaData();
  const { fetchAPI, backend } = useQueryUsersRateLimits();

  const {
    dataSource,
    queryParams,
    fetchData,
    handlePageChange,
    handleTableChange,
    handleSearch,
    handleQueryChange
  } = useTableFetch<UserRateLimitUsage>({
    key: PaginationKey.UserRateLimits,
    fetchAPI,
    // Busiest monthly budget first — the columns' arrows are controlled
    // from this same param, so the indicator always matches the served
    // order; the backend derives the composite usage key.
    defaultQueryParams: { sort_by: '-monthly' }
  });

  // "Export Table Data" streams the table as one file — the same rows in
  // the served order (the picker's user filter and the column arrows'
  // sort included), with the tooltip's user fields spelled out as
  // columns. Direct (no dialog), so the trigger carries the spinner.
  const { exportWithPreflight, exporting: exportingTable } = useExportUsage({
    exportUrl: USAGE_RATE_LIMITS_USERS_EXPORT,
    estimateUrl: USAGE_RATE_LIMITS_USERS_EXPORT_ESTIMATE
  });
  const handleExportTable = () => {
    exportWithPreflight({
      user_id: queryParams.user_id || undefined,
      sort_by: queryParams.sort_by,
      format: 'xlsx'
    });
  };

  useEffect(() => {
    // include_all_users: the meta options derive from usage rows, so a
    // provisioned account that never called would be unpickable — the
    // table must list every account's limits, not just its callers.
    fetchMetaData({ include_all_users: true });
  }, []);

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

  const handleUserChange = (value?: number) => {
    handleQueryChange({ page: 1, user_id: value ?? '' });
  };

  // --- Inline limit editing -------------------------------------------------

  // The row's stored username travels with every PUT: the users endpoint
  // validates the full UserUpdate schema before its exclude_unset write.
  const handleSaveLimit = async (
    record: UserRateLimitUsage,
    field: LimitColumnConfig['field'],
    value: number | null
  ) => {
    await updateUserLimits(record.user_id, {
      username: record.username,
      [field]: value
    });
    fetchData();
  };

  // --- The full user drawer -------------------------------------------------

  const [editUser, setEditUser] = useState<{
    action: PageActionType;
    title: string;
    data?: ListItem | null;
  } | null>(null);

  const handleSelect = async (val: string, record: UserRateLimitUsage) => {
    if (val !== 'edit') return;
    setEditUser({
      action: PageAction.EDIT,
      title: intl.formatMessage({ id: 'users.form.edit' }),
      data: null
    });
    try {
      // The drawer seeds from the stored (not effective) values — the
      // same fetch the Users page's edit flow performs.
      const data = await getUser(record.user_id);
      setEditUser((prev) => (prev ? { ...prev, data } : prev));
    } catch {
      setEditUser(null);
    }
  };

  const handleEditModalOk = async (values: FormData) => {
    if (!editUser?.data?.id) return;
    try {
      await updateUser({
        data: {
          ...values,
          // The form carries the role as the picker's 'admin'/'user' string;
          // the API's UserUpdate wants the boolean.
          is_admin: values.is_admin === UserRoles.ADMIN,
          id: editUser.data.id
        }
      });
      setEditUser(null);
      message.success(intl.formatMessage({ id: 'common.message.success' }));
      fetchData();
    } catch {
      // The global request handler reported the failure; the drawer stays
      // open over the typed values, the Users page's flow does the same.
    }
  };

  const columns = useLimitsColumns({
    handleSelect,
    handleSaveLimit,
    // The arrows read off the param the table sorts by; an empty value
    // falls back to the backend's -monthly default (the hook owns that).
    sortBy: queryParams.sort_by
  });

  // The feature is off server-side: render nothing at all, the way the
  // personal card does — an empty table of dashes would read as broken.
  if (backend.mode === 'disabled') return null;

  const renderEmpty = (type?: string) => {
    if (type !== 'Table') return;
    return (
      <NoResult
        minHeight="calc(100vh - 300px)"
        loading={dataSource.loading}
        loadend={dataSource.loadend}
        dataSource={dataSource.dataList}
        image={<IconFont type="icon-users" />}
        filters={_.omit(queryParams, ['sort_by'])}
        noFoundText={intl.formatMessage({
          id: 'usage.rateLimits.table.noUsersFound'
        })}
        title={intl.formatMessage({ id: 'usage.rateLimits.table.noUsers' })}
        subTitle={intl.formatMessage({
          id: 'usage.rateLimits.table.noUsersSubTitle'
        })}
      ></NoResult>
    );
  };

  return (
    <div>
      {/* Breathing room between the filter row and the table (and the
          degradation alerts that may sit between them). */}
      <Flex gap={8} align="center" wrap="wrap" style={{ marginBottom: 16 }}>
        {/* The picker doubles as the table's server-side user_id filter. */}
        <Select
          allowClear
          showSearch
          optionFilterProp="label"
          style={{ minWidth: 220 }}
          value={queryParams.user_id || undefined}
          onChange={handleUserChange}
          options={userOptions}
          placeholder={intl.formatMessage({ id: 'usage.filter.user' })}
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
      {/* Counter degradation mirrors the personal card: local mode keeps
          limits without counters, a failed read warns instead, and the
          feature being off removes the section entirely. `backend` is
          empty until the first page answers. */}
      {backend.mode === 'local' && (
        <Alert
          type="info"
          showIcon
          message={intl.formatMessage({
            id: 'usage.rateLimits.usageUnavailable'
          })}
          style={{ marginBlock: 16 }}
        />
      )}
      {backend.usage_error && (
        <Alert
          type="warning"
          showIcon
          message={intl.formatMessage({ id: 'usage.rateLimits.usageError' })}
          style={{ marginBlock: 16 }}
        />
      )}
      <ConfigProvider renderEmpty={renderEmpty}>
        <Table<UserRateLimitUsage>
          className={'scroll-table'}
          columns={columns}
          dataSource={dataSource.dataList}
          loading={{
            spinning: dataSource.loading,
            size: 'middle'
          }}
          sortDirections={TABLE_SORT_DIRECTIONS}
          showSorterTooltip={false}
          rowKey="user_id"
          onChange={handleTableChange}
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
      </ConfigProvider>
      {/* The same drawer the Users page edits with — per-model
          concurrency, groups and the rest ride along; the table's
          single-axis cells stay for quick nudges. */}
      {editUser && editUser.data && (
        <AddModal
          open
          action={editUser.action}
          title={editUser.title}
          data={editUser.data}
          onCancel={() => setEditUser(null)}
          onOk={handleEditModalOk}
        />
      )}
    </div>
  );
};

export default UsersLimitsTable;
