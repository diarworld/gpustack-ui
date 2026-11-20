import assert from 'node:assert/strict';
import { test } from 'node:test';

const {
  formatCount,
  formatLatencySeconds,
  formatRatioPercent,
  formatTokensPerSecond,
  severityLevel
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

test('severity is green below the warning bound and strict about it', () => {
  assert.equal(severityLevel(null, 20, 50), null);
  assert.equal(severityLevel(undefined, 20, 50), null);
  assert.equal(severityLevel(0, 20, 50), 'success');
  // The bound itself is still healthy: the value must exceed it.
  assert.equal(severityLevel(20, 20, 50), 'success');
  assert.equal(severityLevel(21, 20, 50), 'warning');
  assert.equal(severityLevel(50, 20, 50), 'warning');
  assert.equal(severityLevel(51, 20, 50), 'error');
});
