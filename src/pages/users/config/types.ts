export interface FormData {
  username: string;
  id?: number;
  is_admin: boolean | string;
  full_name: string;
  password: string;
  is_active?: boolean;
  source?: string;
  // Gateway rate limits, admin-settable. Undefined means the deployment
  // default governs that axis (none for the weekly budget).
  rpm_limit?: number | null;
  tpm_limit?: number | null;
  weekly_token_limit?: number | null;
  monthly_token_limit?: number | null;
  // Per-model in-flight caps: model name -> cap, 0 = explicit unlimited.
  // Models absent from the map follow the deployment default (1). Entries
  // equal to the default are not stored as overrides.
  model_concurrency_limits?: Record<string, number> | null;
}

export interface ListItem extends FormData {
  id: number;
  source: string;
  avatar_url: string;
  created_at: string;
  updated_at: string;
  // Labels from the user's attribute-derived groups (raw title /
  // department / store value), server-resolved; null when the user
  // holds no group of that kind.
  profession?: string | null;
  department?: string | null;
  business_unit?: string | null;
}
