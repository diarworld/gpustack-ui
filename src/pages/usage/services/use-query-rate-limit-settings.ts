import { useQueryData } from '@/hooks/use-query-data-list';
import { queryRateLimitSettings } from '../apis';
import { RateLimitSettings } from '../config/types';

// The editable deployment defaults (admin-only endpoint). The caller gates
// on access.canSeeAdmin before mounting anything that uses this hook, so a
// 403 never happens in practice.
export default function useQueryRateLimitSettings() {
  const { detailData, loading, cancelRequest, fetchData } =
    useQueryData<RateLimitSettings>({
      fetchDetail: (_params, options) => queryRateLimitSettings(options),
      key: 'rateLimitSettings'
    });

  const fetchSettings = async () => {
    await fetchData(undefined);
  };

  return {
    detailData,
    loading,
    cancelRequest,
    fetchData: fetchSettings
  };
}
