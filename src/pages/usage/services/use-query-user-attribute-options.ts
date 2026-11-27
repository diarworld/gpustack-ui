import { useQueryData } from '@/hooks/use-query-data-list';
import { queryUserAttributeOptions } from '../apis';
import { UserAttributeOptions } from '../config/types';

/**
 * The overview tables' attribute picker options — the sorted Business
 * Unit / Department / Profession labels, shared across the tabs through
 * one fetch key so the page makes a single request. Platform admins
 * only: the backend 403s everyone else, so callers gate the pickers on
 * access and leave this unmounted otherwise.
 */
export default function useQueryUserAttributeOptions() {
  const { detailData, loading, fetchData } = useQueryData<UserAttributeOptions>(
    {
      fetchDetail: queryUserAttributeOptions,
      key: 'userAttributeOptions'
    }
  );

  return {
    detailData,
    loading,
    fetchData
  };
}
