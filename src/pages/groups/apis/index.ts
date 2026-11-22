import { request } from '@umijs/max';
import { FormData, ListItem, MembershipItem } from '../config/types';

export const GROUPS_API = '/groups';

export async function queryGroupsList(params: Global.SearchParams) {
  return request<Global.PageResponse<ListItem>>(`${GROUPS_API}`, {
    method: 'GET',
    params
  });
}

export async function createGroup(params: { data: FormData }) {
  return request(`${GROUPS_API}`, {
    method: 'POST',
    data: params.data
  });
}

export async function updateGroup(params: { data: FormData }) {
  return request(`${GROUPS_API}/${params.data.id}`, {
    method: 'PUT',
    data: params.data
  });
}

export async function deleteGroup(id: number) {
  return request(`${GROUPS_API}/${id}`, {
    method: 'DELETE'
  });
}

export async function queryGroupMembers(groupId: number) {
  return request<MembershipItem[]>(`${GROUPS_API}/${groupId}/members`, {
    method: 'GET'
  });
}

export async function addGroupMembers(
  groupId: number,
  data: { user_ids?: number[]; group_ids?: number[] }
) {
  return request<MembershipItem[]>(`${GROUPS_API}/${groupId}/members`, {
    method: 'POST',
    data
  });
}

export async function removeGroupMember(
  groupId: number,
  memberPrincipalId: number
) {
  return request(`${GROUPS_API}/${groupId}/members/${memberPrincipalId}`, {
    method: 'DELETE'
  });
}
