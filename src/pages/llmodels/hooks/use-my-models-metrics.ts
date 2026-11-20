import { systemConfigAtom } from '@/atoms/system';
import { request } from '@umijs/max';
import { useAtomValue } from 'jotai';
import { useEffect, useMemo, useState } from 'react';

export const MY_MODELS_METRICS_API = '/my-models/metrics';

// Live card values: fast enough that running/waiting reads as "now",
// slow enough that one batch request per tick is nothing.
const POLL_INTERVAL_MS = 15_000;

export interface MyModelMetrics {
  id: number;
  requests_running?: number | null;
  requests_waiting?: number | null;
  prompt_tokens_per_second?: number | null;
  generation_tokens_per_second?: number | null;
  kv_cache_usage_ratio?: number | null;
  prefix_cache_hit_rate?: number | null;
  avg_time_to_first_token_seconds?: number | null;
}

/**
 * Poll the batch utilization endpoint for the currently rendered cards.
 * The metrics come from the observability stack, so an unconfigured
 * deployment polls nothing; a failed or empty answer hides the strips
 * instead of flashing stale numbers.
 */
const useMyModelsMetrics = (models: Array<{ id: number }>) => {
  const systemConfig = useAtomValue(systemConfigAtom);
  // The batch endpoint keys on the id list: one request per tick, not one
  // per card. A stable string also keeps the effect from re-arming on
  // every parent render that recreates the models array.
  const ids = useMemo(
    () => models.map((model) => model.id).join(','),
    [models]
  );
  const [metricsById, setMetricsById] = useState<
    Record<number, MyModelMetrics>
  >({});

  const monitoringEnabled = !!systemConfig?.showMonitoring;

  useEffect(() => {
    if (!monitoringEnabled || !ids) {
      setMetricsById({});
      return;
    }
    let cancelled = false;
    const fetchMetrics = async () => {
      try {
        const data = await request<MyModelMetrics[]>(
          `${MY_MODELS_METRICS_API}?ids=${ids}`
        );
        if (!cancelled) {
          setMetricsById(
            Object.fromEntries((data || []).map((row) => [row.id, row]))
          );
        }
      } catch {
        // Unknown is rendered as "no strip": polling continues so a
        // recovered Prometheus lights the cards back up on its own.
        if (!cancelled) {
          setMetricsById({});
        }
      }
    };
    fetchMetrics();
    const timer = setInterval(fetchMetrics, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [ids, monitoringEnabled]);

  return metricsById;
};

export default useMyModelsMetrics;
