/**
 * Admin's cross-user limits table data.
 *
 * Fed by GET /usage/rate-limits/users — one row per active user with the
 * effective limits (groups and deployment defaults already resolved) and
 * the live window counters. Server-side pagination and sorting; the
 * ``mode`` / ``usage_error`` pair rides along on every response and is
 * kept here so the table can degrade its counters the way the personal
 * card does (absent counters render as "—", not as zero).
 */
import { queryUsersRateLimits } from '@/pages/usage/apis';
import {
  UserRateLimitUsage,
  UsersRateLimitsResponse
} from '@/pages/usage/config/types';
import { useMemo, useState } from 'react';

export default function useQueryUsersRateLimits() {
  // The last response's counter-backend state; refreshed on every
  // page/sort/filter load so the table can degrade its counters the way
  // the personal card does (absent counters render as "—", not zero).
  const [backend, setBackend] = useState<{
    mode?: UsersRateLimitsResponse['mode'];
    usage_error?: string | null;
  }>({});

  const fetchAPI = useMemo(() => {
    return async (
      params: Record<string, any>,
      options?: any
    ): Promise<Global.PageResponse<UserRateLimitUsage>> => {
      const res = await queryUsersRateLimits(params, options);
      setBackend({ mode: res.mode, usage_error: res.usage_error });
      return res;
    };
  }, []);

  return { fetchAPI, backend };
}
