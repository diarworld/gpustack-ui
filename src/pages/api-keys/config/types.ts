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
  // The key's own gateway limit, admin-settable. Null/undefined means the
  // key inherits the deployment-wide daily default. Rate and per-minute
  // token caps are user-level.
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
  daily_token_limit?: number | null;
}
