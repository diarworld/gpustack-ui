import { useQueryData } from '@/hooks/use-query-data-list';
import {
  queryResourceEventsStats,
  ResourceEventStatsResponse
} from '../../apis/resource';

export default function useQueryResourceEventsStats(option?: { key?: string }) {
  const { detailData, loading, cancelRequest, fetchData } =
    useQueryData<ResourceEventStatsResponse>({
      fetchDetail: queryResourceEventsStats,
      key: option?.key || 'resourceEventsStats'
    });
  return {
    detailData,
    loading,
    cancelRequest,
    fetchData
  };
}
