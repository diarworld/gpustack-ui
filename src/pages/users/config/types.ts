export interface FormData {
  username: string;
  id?: number;
  is_admin: boolean | string;
  full_name: string;
  password: string;
  is_active?: boolean;
  source?: string;
  // Gateway token budgets, admin-settable. Undefined means the user has
  // no budget of that kind.
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
