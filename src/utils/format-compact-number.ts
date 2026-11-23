// Quota values in the reader's locale: 100000000 → '100M' (en) / '100 млн'
// (ru). `notation: 'compact'` picks each locale's own scale words — the
// rendering the Usage overview limit cards use.
export const formatCompactNumber = (n: number, locale: string): string =>
  new Intl.NumberFormat(locale, {
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(Math.round(n * 100) / 100);
