import assert from 'node:assert/strict';
import { test } from 'node:test';

const {
  formatCount,
  formatLatencySeconds,
  formatRatioPercent,
  formatTokensPerSecond
} = await import('./model-metrics.ts');

test('unknown values render as nothing, never as a zero', () => {
  for (const format of [
    formatCount,
    formatTokensPerSecond,
    formatRatioPercent,
    formatLatencySeconds
  ]) {
    assert.equal(format(null), null);
    assert.equal(format(undefined), null);
  }
});

test('token rates compact into the card strip scale', () => {
  assert.equal(formatTokensPerSecond(0), '0');
  assert.equal(formatTokensPerSecond(35.4), '35');
  assert.equal(formatTokensPerSecond(1234), '1.2k');
  assert.equal(formatTokensPerSecond(145_000), '145k');
});

test('ratios and counts round to their display unit', () => {
  assert.equal(formatRatioPercent(0.428), '43%');
  assert.equal(formatRatioPercent(1), '100%');
  assert.equal(formatCount(2.4), '2');
});

test('latency switches unit at one second', () => {
  assert.equal(formatLatencySeconds(0.0004), '1ms');
  assert.equal(formatLatencySeconds(0.231), '231ms');
  assert.equal(formatLatencySeconds(1.04), '1s');
  assert.equal(formatLatencySeconds(12.34), '12.3s');
  assert.equal(formatLatencySeconds(140), '140s');
});
