/**
 * Resource Events panel — lifecycle event list.
 *
 * Each row is one ``resource_events`` row: when a GPU instance / PV was
 * created, transitioned metered, attached / detached, deleted, etc.
 *
 * Mounted as a stretch tab in the Usage page. Filter bar matches the Tokens
 * tab (date range + "filter by user" for managers); the resource-type /
 * event-type selects ride in the bar's ``extra`` slot.
 */
import { type StatusType } from '@/config/types';
import { SimpleSelect, StatusDot } from '@gpustack/core-ui';
import { useAccess, useIntl } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { Input, Table, Tooltip } from 'antd';
import dayjs from 'dayjs';
import _ from 'lodash';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  RESOURCE_EVENTS_EXPORT_ENDPOINTS,
  ResourceEventItem
} from '../apis/resource';
import ResourceFilterBar from '../components/resource-filter-bar';
import useExportUsage from '../services/use-export-usage';
import { parseRollup } from '../utils/time-buckets';
import useQueryResourceEvents from './services/use-query-resource-events';

// Only these four are ever emitted for instance/PV lifecycle rows (see
// resource_event_logger): create/delete + the metering-window pair.
// updated/attached/detached exist as enum values but are intentionally not
// recorded, so they're not offered as filters. Rate-limit rejections are the
// other family: the limit axes, all reported as one kind of thing happening
// (a limit tripping — hence the shared error status).
const EVENT_STATUS: Record<string, StatusType> = {
  created: 'success',
  deleted: 'error',
  phase_to_metered: 'transitioning',
  phase_left_metered: 'warning',
  limit_rate_requests: 'error',
  limit_rate_tokens: 'error',
  limit_concurrency: 'error',
  limit_quota_weekly: 'error',
  limit_quota_monthly: 'error',
  limit_event: 'error'
};

// Humanize a failure phase enum for display, e.g. "SSHPublicKeyCreateFailed" →
// "SSH Public Key Create Failed" (fallback when the backend has no detail).
const humanizePhase = (phase: string): string =>
  phase
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .replace(/([a-z\d])([A-Z])/g, '$1 $2');

const ResourceEvents: React.FC = () => {
  const access = useAccess();
  const intl = useIntl();
  const canManageUsers = !!access.canSeeOrgAdmin;
  const scope = canManageUsers ? 'all' : 'self';

  // Users only ever see "Storage" in the product — never "Persistent Volume".
  const RESOURCE_TYPE_LABELS: Record<string, string> = useMemo(
    () => ({
      gpu_instance: intl.formatMessage({
        id: 'usage.events.resource.gpuInstance'
      }),
      cpu_instance: intl.formatMessage({
        id: 'usage.events.resource.cpuInstance'
      }),
      persistent_volume: intl.formatMessage({ id: 'usage.tabs.storage' }),
      limit: intl.formatMessage({ id: 'usage.events.resource.limit' })
    }),
    [intl]
  );

  // The filter offers only the limit axes — the event types this page exists
  // for. Lifecycle rows (created / deleted / the metering-window pair) still
  // appear in the table, they are just not filterable here.
  const EVENT_TYPE_OPTIONS = useMemo(
    () => [
      // Rate-limit rejections: the axis that tripped. Every one is the same
      // kind of event (a limit tripping), the enum names the axis; the
      // concrete window (per minute vs the rolling week) rides in the
      // message. The quotas mirror what the product actually configures —
      // the weekly rolling budget and the monthly calendar one.
      {
        value: 'limit_rate_requests',
        label: intl.formatMessage({ id: 'usage.events.type.limitRateRequests' })
      },
      {
        value: 'limit_rate_tokens',
        label: intl.formatMessage({ id: 'usage.events.type.limitRateTokens' })
      },
      {
        value: 'limit_concurrency',
        label: intl.formatMessage({ id: 'usage.events.type.limitConcurrency' })
      },
      {
        value: 'limit_quota_weekly',
        label: intl.formatMessage({ id: 'usage.events.type.limitQuotaWeekly' })
      },
      {
        value: 'limit_quota_monthly',
        label: intl.formatMessage({ id: 'usage.events.type.limitQuotaMonthly' })
      }
    ],
    [intl]
  );

  // Raw event_type → human-readable label. ``phase_to_metered`` /
  // ``phase_left_metered`` bracket the metering window — when the resource
  // starts / stops accruing metered uptime (the OSS build only meters, it
  // doesn't charge). These lifecycle rows are not filter options anymore,
  // but they still appear in the table and keep their wording — users
  // shouldn't see the internal enum names. ``limit_event`` is the backend's
  // fallback for a limit axis this build does not enumerate yet — still a
  // tripped limit, still labelled.
  const EVENT_LABEL: Record<string, string> = useMemo(
    () => ({
      ...Object.fromEntries(EVENT_TYPE_OPTIONS.map((o) => [o.value, o.label])),
      created: intl.formatMessage({ id: 'usage.events.type.created' }),
      deleted: intl.formatMessage({ id: 'usage.events.type.deleted' }),
      phase_to_metered: intl.formatMessage({
        id: 'usage.events.type.started'
      }),
      phase_left_metered: intl.formatMessage({
        id: 'usage.events.type.stopped'
      }),
      limit_event: intl.formatMessage({ id: 'usage.events.type.limitGeneric' })
    }),
    [EVENT_TYPE_OPTIONS, intl]
  );

  // All filters live in one query-params object; ``resourceType`` is single
  // (the backend filters by one) and ``nameQuery`` is the debounced substring.
  type QueryParams = {
    dateRange: [dayjs.Dayjs, dayjs.Dayjs];
    eventTypes: string[];
    nameQuery: string;
    page: number;
    perPage: number;
  };
  const [queryParams, setQueryParams] = useState<QueryParams>({
    dateRange: [dayjs().subtract(29, 'day'), dayjs()],
    eventTypes: [],
    nameQuery: '',
    perPage: 50,
    page: 1
  });
  const { detailData: data, loading, fetchData } = useQueryResourceEvents();

  // Latest params, so the stable debounced name handler reads current values.
  const queryRef = useRef(queryParams);
  queryRef.current = queryParams;

  // "Export Table Data" streams the events list as one file — the same
  // predicate as the query below (dates, scope, name search, event-type
  // set), with the name column's tooltip fields spelled out as columns.
  const { exportWithPreflight, exporting: exportingTable } = useExportUsage(
    RESOURCE_EVENTS_EXPORT_ENDPOINTS
  );
  const handleExportTable = () => {
    const params = queryRef.current;
    exportWithPreflight({
      start_date: params.dateRange[0].format('YYYY-MM-DD'),
      end_date: params.dateRange[1].format('YYYY-MM-DD'),
      scope,
      resource_name: params.nameQuery || undefined,
      event_types: params.eventTypes.length ? params.eventTypes : undefined,
      format: 'xlsx'
    });
  };

  // Single fetch entry point: merge the patch into the current params, persist
  // them, then request — triggered from each handler rather than from effect
  // dependencies, so there's exactly one request per user action.
  const fetchEvents = useMemoizedFn((patch: Partial<QueryParams>) => {
    const params = { ...queryRef.current, ...patch };
    setQueryParams(params);
    return fetchData({
      start_date: params.dateRange[0].format('YYYY-MM-DD'),
      end_date: params.dateRange[1].format('YYYY-MM-DD'),
      scope,
      resource_name: params.nameQuery || undefined,
      event_types: params.eventTypes,
      page: params.page,
      perPage: 50
    });
  });

  // First load only — subsequent fetches are driven by the handlers below.
  useEffect(() => {
    fetchEvents({});
  }, []);

  // Debounced name search; a filter change always resets to page 1.
  const onNameChange = useMemo(
    () =>
      _.debounce(
        (value: string) => fetchEvents({ nameQuery: value.trim(), page: 1 }),
        400
      ),
    [fetchEvents]
  );

  const columns = useMemo(
    () => [
      {
        title: intl.formatMessage({ id: 'usage.events.col.time' }),
        dataIndex: 'occurred_at',
        key: 'occurred_at',
        // Backend sends the rollup-tz instant with its offset; parseRollup keeps
        // it (no conversion to the browser tz).
        render: (v: string) =>
          v ? parseRollup(v).format('YYYY-MM-DD HH:mm:ss') : '-',
        width: 200
      },
      {
        title: intl.formatMessage({ id: 'usage.events.col.resource' }),
        dataIndex: 'resource_type',
        key: 'resource_type',
        render: (v: string) => RESOURCE_TYPE_LABELS[v] || v,
        width: 160
      },
      {
        title: intl.formatMessage({ id: 'usage.table.name' }),
        dataIndex: 'resource_name',
        key: 'resource_name',
        render: (v: string, row?: ResourceEventItem) => {
          // Hover tooltip on the creator: the full name line first (the
          // literal English label, not localized — it names the directory
          // field), then the attribute-derived labels the row carries —
          // rows attributable to a raw (unresolved) consumer have none.
          const attrs: [string, string][] = [];
          (
            [
              ['usage.events.tooltip.businessUnit', row?.creator_business_unit],
              ['usage.events.tooltip.department', row?.creator_department],
              ['usage.events.tooltip.profession', row?.creator_profession]
            ] as [string, string | undefined][]
          ).forEach(([id, val]) => {
            if (val) {
              attrs.push([id, val]);
            }
          });
          const fullName = row?.creator_full_name;
          if (!v || (!fullName && attrs.length === 0)) {
            return v ?? '-';
          }
          return (
            <Tooltip
              title={
                <>
                  {fullName && <div>Full name: {fullName}</div>}
                  {attrs.map(([id, val]) => (
                    <div key={id}>
                      {intl.formatMessage({ id })}: {val}
                    </div>
                  ))}
                </>
              }
            >
              <span style={{ cursor: 'default' }}>{v}</span>
            </Tooltip>
          );
        }
      },
      {
        title: intl.formatMessage({ id: 'usage.events.col.event' }),
        dataIndex: 'event_type',
        key: 'event_type',
        render: (v: string) => (
          <StatusDot
            statusValue={{
              status: EVENT_STATUS[v] ?? 'inactive',
              text: EVENT_LABEL[v] ?? v
            }}
          />
        ),
        width: 180
      },
      {
        title: intl.formatMessage({ id: 'usage.events.col.message' }),
        dataIndex: 'event_message',
        key: 'event_message',
        render: (v?: string, row?: ResourceEventItem) => {
          // A failure phase (…Failed) is the one thing not already shown in the
          // Event column — surface it (with its detail) as an error message.
          if (row?.phase && /failed$/i.test(row.phase)) {
            return (
              <span style={{ color: 'var(--color-status-error-text)' }}>
                {row.phase_message || humanizePhase(row.phase)}
              </span>
            );
          }
          return v ?? '-';
        }
      }
    ],
    [intl, RESOURCE_TYPE_LABELS, EVENT_LABEL]
  );

  return (
    <div>
      <ResourceFilterBar
        style={{ marginBottom: 16 }}
        value={queryParams.dateRange}
        onChange={(dates) => fetchEvents({ dateRange: dates, page: 1 })}
        // No user filter here — the events list has no User column. Scope is
        // still applied to the query (members see only their own events).
        canManageUsers={false}
        userOptions={[]}
        selectedUsers={[]}
        onUsersChange={() => {}}
        onRefresh={() => fetchEvents({})}
        onExportTable={handleExportTable}
        exportingTable={exportingTable}
        extra={
          <>
            <Input
              allowClear
              placeholder={intl.formatMessage({
                id: 'usage.events.resourceName'
              })}
              onChange={(e) => onNameChange(e.target.value)}
              style={{ width: 200 }}
            />
            <SimpleSelect
              mode="multiple"
              allowClear
              showSearch
              maxTagCount={'responsive'}
              placeholder={intl.formatMessage({
                id: 'usage.events.eventType'
              })}
              value={queryParams.eventTypes}
              onChange={(v) => fetchEvents({ eventTypes: v, page: 1 })}
              options={EVENT_TYPE_OPTIONS}
              style={{ width: 240 }}
              styles={{
                wrapper: {
                  flex: 'unset'
                }
              }}
            />
          </>
        }
      />

      <Table
        rowKey="id"
        dataSource={data?.items ?? []}
        columns={columns as any}
        loading={{
          spinning: loading,
          size: 'middle'
        }}
        pagination={{
          size: 'middle',
          current: queryParams.page,
          pageSize: data?.pagination?.perPage ?? 50,
          total: data?.pagination?.total ?? 0,
          showSizeChanger: false,
          hideOnSinglePage: queryParams.perPage === 50,
          onChange: (p) => fetchEvents({ page: p })
        }}
      />
    </div>
  );
};

export default ResourceEvents;
