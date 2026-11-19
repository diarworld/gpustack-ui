import { useQueryData } from '@/hooks/use-query-data-list';
import { queryRateLimits } from '../apis';
import { RateLimitsResponse } from '../config/types';

// ``userId`` pins whose limits to show: undefined = the caller (regular
// users and the unfiltered admin view), a number = the admin's single-user
// filter selection. The endpoint degrades a foreign id to the caller when
// the caller may not see it, so forwarding is always safe.
export default function useQueryRateLimits(userId?: number) {
  const { detailData, loading, cancelRequest, fetchData } =
    useQueryData<RateLimitsResponse>({
      fetchDetail: (_params, options) =>
        queryRateLimits(
          userId == null ? undefined : { user_id: userId },
          options
        ),
      key: 'rateLimits'
    });

  // One optional param: refetching on a filter change is the caller's
  // effect's job (it keys on userId).
  const fetchRateLimits = async () => {
    await fetchData(undefined);
  };

  return {
    detailData,
    loading,
    cancelRequest,
    fetchData: fetchRateLimits
  };
}
