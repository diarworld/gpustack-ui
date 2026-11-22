export interface FormData {
  name: string;
  description?: string | null;
  id?: number;
}

export interface ListItem extends FormData {
  id: number;
  // Human-readable label carried from the IdP (title, department name).
  // Admin-created groups have none and render `name` instead.
  display_name?: string | null;
  // Derived type token: profession | department | business-unit |
  // local | idp. Rendered through the groups.type.* i18n keys.
  group_type?: string;
  member_count: number;
  source: string;
  created_at: string;
  updated_at: string;
}

export interface MembershipItem {
  // The member principal's id — a user's id for `user` rows, the
  // subgroup's principal id for `group` rows.
  member_principal_id: number;
  member_kind: 'user' | 'group';
  user_id?: number | null;
  group_id: number;
  created_at: string;
  // Users: login name + display label. Subgroups surface their
  // name / display_name through the same fields.
  username?: string | null;
  full_name?: string | null;
  // Only for `group` rows: the subgroup's derived type and its
  // transitive unique-user count, so the Subgroups tab renders both
  // without extra requests.
  group_type?: string | null;
  group_member_count?: number | null;
  // Only for `user` rows: labels from the user's attribute-derived
  // groups (raw title / department / store value), server-resolved.
  profession?: string | null;
  department?: string | null;
  business_unit?: string | null;
}
