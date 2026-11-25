import { request } from '@umijs/max';
import { FormData, ListItem } from '../config/types';

export const USERS_API = '/users';
export const USER_DIRECTORY_API = '/user-directory';

export async function queryUsersList(params: Global.SearchParams) {
  return request<Global.PageResponse<ListItem>>(`${USERS_API}`, {
    method: 'GET',
    params
  });
}

// Slim user-list endpoint open to platform admin OR an org owner.
// Use this from picker UIs (Route Access Settings, Add Member, ...)
// where the caller may not be an admin; the admin-only `queryUsersList`
// would 403 for org owners.
export async function queryUserDirectory(params: Global.SearchParams) {
  return request<Global.PageResponse<ListItem>>(USER_DIRECTORY_API, {
    method: 'GET',
    params
  });
}

export async function createUser(params: { data: FormData }) {
  return request(`${USERS_API}`, {
    method: 'POST',
    data: params.data
  });
}

export async function updateUser(params: { data: FormData }) {
  return request(`${USERS_API}/${params.data.id}`, {
    method: 'PUT',
    data: params.data
  });
}

// The full user row — the Usage page's limits editor seeds its form from
// the stored (not effective) values the card cannot show.
export async function getUser(id: number) {
  return request<ListItem>(`${USERS_API}/${id}`, { method: 'GET' });
}

// Partial limits update used by the Usage page's limits editor. The
// endpoint validates the full UserUpdate schema before its
// exclude_unset write, so the identity field the schema requires —
// username — travels along unchanged from the row the editor read;
// everything else the body omits (password, groups, source) is left as
// it is. A null limit clears the override and the axis falls back to
// the deployment default.
export async function updateUserLimits(
  id: number,
  data: {
    username: string;
    rpm_limit?: number | null;
    tpm_limit?: number | null;
    weekly_token_limit?: number | null;
    monthly_token_limit?: number | null;
    model_concurrency_limits?: Record<string, number> | null;
  }
) {
  return request<ListItem>(`${USERS_API}/${id}`, { method: 'PUT', data });
}

export async function deleteUser(id: number) {
  return request(`${USERS_API}/${id}`, {
    method: 'DELETE'
  });
}

export async function updateUserStatus(params: {
  id: number;
  data: { is_active: boolean };
}) {
  return request(`${USERS_API}/${params.id}/activation`, {
    method: 'PATCH',
    data: params.data
  });
}

// All groups the user belongs to, any source: the picker renders
// Local rows as editable checkboxes and IdP-synced ones read-only.
export async function queryUserGroups(id: number) {
  return request<
    Array<{
      id: number;
      name: string;
      display_name?: string | null;
      group_type?: string;
    }>
  >(`${USERS_API}/${id}/groups`, { method: 'GET' });
}

// Distinct attribute-derived labels per kind — the option lists for
// the users-page filters.
export async function queryUserAttributeValues() {
  return request<{
    business_unit: string[];
    department: string[];
    profession: string[];
  }>(`${USERS_API}/attribute-values`, { method: 'GET' });
}
