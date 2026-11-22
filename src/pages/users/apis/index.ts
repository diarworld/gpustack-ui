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

// Admin-curated (source=Local) groups the user belongs to — the set
// the edit modal manages. IdP-synced memberships are not included.
export async function queryUserGroups(id: number) {
  return request<
    Array<{ id: number; name: string; display_name?: string | null }>
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
