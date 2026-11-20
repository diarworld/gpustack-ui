import { useIntl } from '@umijs/max';
import { Tooltip } from 'antd';
import { createStyles } from 'antd-style';
import React from 'react';
import styled from 'styled-components';
import type { MyModelMetrics } from '../hooks/use-my-models-metrics';
import {
  formatCount,
  formatLatencySeconds,
  formatRatioPercent,
  formatTokensPerSecond
} from '../utils/model-metrics';

const useStyles = createStyles(({ css }) => ({
  strip: css`
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
    margin: 8px 0 10px;
    color: var(--ant-color-text-secondary);
    font-size: 12px;
    line-height: 18px;
    .value {
      color: var(--ant-color-text);
      font-variant-numeric: tabular-nums;
    }
  `
}));

const Dot = styled.span`
  background-color: var(--ant-color-text-quaternary);
  border-radius: 50%;
  flex: none;
  height: 3px;
  width: 3px;
`;

interface MetricItem {
  key: string;
  tooltipId: string;
  text: React.ReactNode;
}

/**
 * The live utilization row of a my-model card. Everything unknown is
 * left out; a card without any live series renders nothing at all, so a
 * stopped deployment keeps its original shape.
 */
const ModelMetricsStrip: React.FC<{ metrics?: MyModelMetrics | null }> = ({
  metrics
}) => {
  const intl = useIntl();
  const { styles } = useStyles();
  if (!metrics) {
    return null;
  }

  const running = formatCount(metrics.requests_running);
  const waiting = formatCount(metrics.requests_waiting);
  const prompt = formatTokensPerSecond(metrics.prompt_tokens_per_second);
  const generation = formatTokensPerSecond(
    metrics.generation_tokens_per_second
  );
  const kvCache = formatRatioPercent(metrics.kv_cache_usage_ratio);
  const prefixHit = formatRatioPercent(metrics.prefix_cache_hit_rate);
  const ttft = formatLatencySeconds(metrics.avg_time_to_first_token_seconds);

  const items: MetricItem[] = [];
  if (running !== null || waiting !== null) {
    let tooltipId = 'models.card.metrics.running';
    if (running !== null && waiting !== null) {
      tooltipId = 'models.card.metrics.runningAndWaiting';
    } else if (waiting !== null) {
      tooltipId = 'models.card.metrics.waiting';
    }
    items.push({
      key: 'requests',
      tooltipId,
      text: (
        <>
          {running !== null && <span className="value">▶ {running}</span>}
          {running !== null && waiting !== null && <span>&nbsp;</span>}
          {waiting !== null && <span className="value">⏳ {waiting}</span>}
        </>
      )
    });
  }
  if (prompt !== null || generation !== null) {
    items.push({
      key: 'tokens',
      tooltipId: 'models.card.metrics.tokensPerSecond',
      text: (
        <>
          {prompt !== null && <span className="value">↑ {prompt}</span>}
          {prompt !== null && generation !== null && <span>&nbsp;</span>}
          {generation !== null && <span className="value">↓ {generation}</span>}
        </>
      )
    });
  }
  if (kvCache !== null) {
    items.push({
      key: 'kv',
      tooltipId: 'models.card.metrics.kvCacheUsage',
      text: (
        <span>
          KV&nbsp;<span className="value">{kvCache}</span>
        </span>
      )
    });
  }
  if (prefixHit !== null) {
    items.push({
      key: 'prefix',
      tooltipId: 'models.card.metrics.prefixCacheHit',
      text: (
        <span>
          Prefix&nbsp;<span className="value">{prefixHit}</span>
        </span>
      )
    });
  }
  if (ttft !== null) {
    items.push({
      key: 'ttft',
      tooltipId: 'models.card.metrics.ttft',
      text: (
        <span>
          TTFT&nbsp;<span className="value">{ttft}</span>
        </span>
      )
    });
  }
  if (items.length === 0) {
    return null;
  }

  return (
    <div className={styles.strip}>
      {items.map((item, index) => (
        <React.Fragment key={item.key}>
          {index > 0 && <Dot />}
          <Tooltip title={intl.formatMessage({ id: item.tooltipId })}>
            <span>{item.text}</span>
          </Tooltip>
        </React.Fragment>
      ))}
    </div>
  );
};

export default ModelMetricsStrip;
