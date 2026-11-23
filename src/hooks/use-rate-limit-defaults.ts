import { queryRateLimitSettings } from '@/pages/usage/apis';
import { RateLimitSettings } from '@/pages/usage/config/types';
import { formatCompactNumber } from '@/utils/format-compact-number';
import { useIntl } from '@umijs/max';
import { useEffect, useState } from 'react';

// The deployment defaults the limit editors quote in their placeholders
// (GET /rate-limit-settings, platform admin — both editors are admin
// surfaces). A null on the settings row means "inherit the config file",
// which the client cannot resolve, so such a default falls back to the
// "no limit" placeholder.
const useRateLimitDefaults = (): RateLimitSettings | null => {
  const [defaults, setDefaults] = useState<RateLimitSettings | null>(null);

  useEffect(() => {
    let alive = true;
    queryRateLimitSettings()
      .then((settings) => {
        if (alive) setDefaults(settings);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  return defaults;
};

// The "follow the deployment default" ghost text: the actual default when
// one exists ("По умолчанию: 10", compact-formatted like the Usage cards),
// otherwise "no limit" — there is nothing to inherit.
export const quotaPlaceholder = (
  intl: ReturnType<typeof useIntl>,
  value?: number | null
): string => {
  if (value == null || value <= 0) {
    return intl.formatMessage({ id: 'users.form.tokenBudgets.none' });
  }
  return intl.formatMessage(
    { id: 'users.form.defaultPlaceholder' },
    { default: formatCompactNumber(value, intl.locale) }
  );
};

export { useRateLimitDefaults };
export default useRateLimitDefaults;
