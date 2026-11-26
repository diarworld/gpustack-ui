import { request } from '@umijs/max';
import {
  BreakdownItem,
  FilterOptionType,
  RateLimitResetStatus,
  RateLimitResetsResponse,
  RateLimitSettings,
  RateLimitsResponse,
  UsageBreakdownResponse,
  UsageExportEstimate,
  UsageExportRequest,
  UsageMeta,
  UsersRateLimitsResponse
} from '../config/types';

export const USAGE_META = '/usage/meta';
export const USAGE_BREAKDOWN = '/usage/breakdown';
export const USAGE_BREAKDOWN_EXPORT = '/usage/breakdown/export';
export const USAGE_BREAKDOWN_EXPORT_ESTIMATE =
  '/usage/breakdown/export/estimate';
export const USAGE_RATE_LIMITS = '/usage/rate-limits';
export const USAGE_RATE_LIMITS_RESET = '/usage/rate-limits/reset';
export const USAGE_RATE_LIMITS_USERS = '/usage/rate-limits/users';
export const USAGE_RATE_LIMITS_RESETS = '/usage/rate-limits/resets';
export const RATE_LIMIT_SETTINGS = '/rate-limit-settings';

export const MODEL_ROUTE_TARGETS = '/model-route-targets';

export async function queryUsageMetaData(
  params: Record<string, any>,
  options?: any
): Promise<UsageMeta> {
  return request<UsageMeta>(USAGE_META, {
    params,
    method: 'GET',
    cancelToken: options?.token
  });
}

// Rate limits + live usage for one user. Self-scoped by default; an admin
// may pin another user via ``user_id`` — the backend silently degrades a
// foreign id back to the caller for anyone who may not see it.
export async function queryRateLimits(
  params?: {
    user_id?: number;
  },
  options?: any
): Promise<RateLimitsResponse> {
  return request<RateLimitsResponse>(USAGE_RATE_LIMITS, {
    method: 'GET',
    params,
    cancelToken: options?.token
  });
}

// The admin's cross-user limits table, one row per active user: the
// effective limits (groups and deployment defaults resolved) paired with
// the live window counters, plus the tooltip identity fields. Server-side
// pagination and sorting; ``user_id`` narrows the table to one user.
// Platform-wide admins only — the backend 403s everyone else.
export async function queryUsersRateLimits(
  params?: {
    page?: number;
    perPage?: number;
    sort_by?: string;
    user_id?: number;
  },
  options?: any
): Promise<UsersRateLimitsResponse> {
  return request<UsersRateLimitsResponse>(USAGE_RATE_LIMITS_USERS, {
    method: 'GET',
    params,
    cancelToken: options?.token
  });
}

// The admin's rate-limit resets table, one row per recorded press —
// approved and decision-model-rejected alike. Server-side pagination;
// ``user_id`` narrows the table to one budget owner and ``outcome`` to
// one verdict (the UI lands on 'approved'). Platform-wide admins only —
// the backend 403s everyone else.
export async function queryRateLimitResets(
  params?: {
    page?: number;
    perPage?: number;
    user_id?: number;
    outcome?: string;
  },
  options?: any
): Promise<RateLimitResetsResponse> {
  return request<RateLimitResetsResponse>(USAGE_RATE_LIMITS_RESETS, {
    method: 'GET',
    params,
    cancelToken: options?.token
  });
}

// One press of a reset button: forgives the target user's weekly or
// monthly token budget and answers with the fresh quota state. The reason
// note is required server-side; a self-service press is first judged by
// the decision model, and a rejection answers with status='rejected' and
// the model's reason — the quota state is then as-it-was. An admin may
// target another user (the model does not judge those presses).
export async function resetRateLimit(
  data: {
    kind: 'weekly' | 'monthly';
    description: string;
    user_id?: number;
  },
  options?: any
): Promise<RateLimitResetStatus> {
  return request<RateLimitResetStatus>(USAGE_RATE_LIMITS_RESET, {
    method: 'POST',
    data,
    cancelToken: options?.token
  });
}

// The editable deployment defaults (admin only; the endpoint 403s for
// everyone else). The row is what the gateway's reconciler publishes, so a
// PUT lands on the CR at the next reconcile pass without a restart.
export async function queryRateLimitSettings(
  options?: any
): Promise<RateLimitSettings> {
  return request<RateLimitSettings>(RATE_LIMIT_SETTINGS, {
    method: 'GET',
    cancelToken: options?.token
  });
}

export async function updateRateLimitSettings(
  data: RateLimitSettings,
  options?: any
): Promise<RateLimitSettings> {
  return request<RateLimitSettings>(RATE_LIMIT_SETTINGS, {
    method: 'PUT',
    data,
    cancelToken: options?.token
  });
}

export async function queryUsageTimeSeriesData(
  params: {
    start_date: string;
    end_date: string;
    scope: string;
    metric: string;
    group_by: string[];
    granularity: string;
    page?: number;
    perPage?: number;
    sort_by?: string;
    filters: {
      routes?: FilterOptionType[];
      users?: FilterOptionType[];
      api_keys?: FilterOptionType[];
    };
  },
  options?: any
): Promise<UsageBreakdownResponse> {
  return request<UsageBreakdownResponse>(USAGE_BREAKDOWN, {
    data: params,
    method: 'POST',
    cancelToken: options?.token
  });
}

export async function queryUsageBreakdownList(
  params: Global.SearchParams & {
    filters: {
      routes?: FilterOptionType[];
      users?: FilterOptionType[];
      api_keys?: FilterOptionType[];
    };
  },
  options?: any
) {
  return request<Global.PageResponse<BreakdownItem>>(USAGE_BREAKDOWN, {
    data: params,
    method: 'POST',
    cancelToken: options?.token
  });
}

// How many rows an export would produce, per sheet. Called before the user
// commits so the dialog can state the size (and refuse) up front instead of
// failing thirty seconds into a download.
// Takes the url so ONE pair of functions serves every Usage tab. They used to
// differ only in whether the endpoint was baked in, which forced the caller to
// dispatch on a string comparison against this module's constant.
export async function queryUsageExportEstimate(
  url: string,
  params: UsageExportRequest | Record<string, any>,
  options?: any
): Promise<UsageExportEstimate> {
  return request<UsageExportEstimate>(url, {
    data: params,
    method: 'POST',
    cancelToken: options?.token,
    // The estimate's own failure is handled by the caller, which deliberately
    // stays quiet: a sizing call that didn't come back should leave the button
    // usable, not raise an alarm. Without this the global handler pops
    // "Request failed with status code 500" anyway, turning a designed silence
    // into noise the user can do nothing about.
    skipErrorHandler: true
  });
}

// The file itself. ``getResponse`` keeps the headers reachable so the server
// stays in charge of the filename (and therefore of the extension, which
// varies with format and sheet count: .csv, .xlsx or .zip).
export async function downloadUsageExport(
  url: string,
  params: UsageExportRequest | Record<string, any>,
  options?: any
): Promise<{ data: Blob; headers: Record<string, any> }> {
  return request(url, {
    data: params,
    method: 'POST',
    responseType: 'blob',
    getResponse: true,
    cancelToken: options?.token,
    // The caller reads the error body itself to produce an actionable message
    // (how far to narrow the range, how many files a split needs). Leaving the
    // global handler on adds a second toast beside it — and a useless one:
    // ``response.data`` is a Blob here, so it degrades to axios's own
    // "Request failed with status code 422".
    skipErrorHandler: true
  });
}
