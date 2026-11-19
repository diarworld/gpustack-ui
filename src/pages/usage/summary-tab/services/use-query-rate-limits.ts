import { useQueryData } from '@/hooks/use-query-data-list';
import { queryRateLimits } from '../../apis';
import { RateLimitsResponse } from '../../config/types';

export default function useQueryRateLimits() {
  const { detailData, loading, cancelRequest, fetchData } =
    useQueryData<RateLimitsResponse>({
      // The endpoint takes no params (always self-scoped); this adapter only
      // forwards the hook's options so the cancel token reaches the request.
      fetchDetail: (_params, options) => queryRateLimits(options),
      key: 'rateLimits'
    });

  // Param-less fetch: the endpoint accepts no query parameters.
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
