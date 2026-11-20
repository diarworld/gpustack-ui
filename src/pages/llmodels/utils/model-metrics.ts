// Compact rendering of the my-models card metric strip. Pure functions:
// the strip component stays dumb and the formatting is testable alone.

export const formatCount = (value?: number | null): string | null => {
  if (value === null || value === undefined) {
    return null;
  }
  return String(Math.round(value));
};

// Card strips have no room for long numbers: 1.2k instead of 1234.
export const formatTokensPerSecond = (value?: number | null): string | null => {
  if (value === null || value === undefined) {
    return null;
  }
  if (value >= 1000) {
    const thousands = value / 1000;
    const rounded =
      thousands >= 100
        ? Math.round(thousands)
        : Math.round(thousands * 10) / 10;
    return `${rounded}k`;
  }
  return String(Math.round(value));
};

// The exporter reports the cache fields as 0..1 ratios.
export const formatRatioPercent = (value?: number | null): string | null => {
  if (value === null || value === undefined) {
    return null;
  }
  return `${Math.round(value * 100)}%`;
};

export const formatLatencySeconds = (value?: number | null): string | null => {
  if (value === null || value === undefined) {
    return null;
  }
  if (value < 1) {
    return `${Math.max(1, Math.round(value * 1000))}ms`;
  }
  if (value < 100) {
    return `${Math.round(value * 10) / 10}s`;
  }
  return `${Math.round(value)}s`;
};
