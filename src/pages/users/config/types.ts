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
}

export interface ListItem extends FormData {
  id: number;
  source: string;
  avatar_url: string;
  created_at: string;
  updated_at: string;
}
