export interface ListItem {
  name: string;
  description: string;
  id: number;
  value: string;
  masked_value?: string;
  user_id?: number;
  user_name?: string;
  // The owning principal — an Org, or a USER principal for a
  // personal-scope key, or NULL for an admin "All" mode key (no
  // tenant pinning).
  owner_principal_id?: number | null;
  created_at: string;
  updated_at: string;
  expires_at: string;
  allowed_model_names: string[];
  custom?: string;
  scope?: string[];
  is_custom?: boolean;
  // Gateway rate limits, admin-settable. Null/undefined means the key
  // inherits the deployment-wide default for that limit.
  rpm_limit?: number | null;
  tpm_limit?: number | null;
  daily_token_limit?: number | null;
}

export interface FormData {
  name: string;
  allowed_type: 'all' | 'custom' | 'management';
  key_type: 'auto' | 'custom';
  description: string;
  allowed_model_names: string[];
  expires_in: number | null;
  custom?: string;
  scope?: string[];
  rpm_limit?: number | null;
  tpm_limit?: number | null;
  daily_token_limit?: number | null;
}
