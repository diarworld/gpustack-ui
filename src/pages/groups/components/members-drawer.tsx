import { useQueryDataList } from '@/hooks/use-query-data-list';
import useQueryUserList from '@/pages/users/services/use-query-user-list';
import { formatUserOption } from '@/pages/users/utils/format-user-option';
import { AutoTooltip, GSDrawer, IconFont } from '@gpustack/core-ui';
import { useIntl } from '@umijs/max';
import { useRequest } from 'ahooks';
import { Button, Popconfirm, Select, Table, Tabs } from 'antd';
import _ from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import {
  addGroupMembers,
  queryGroupMembers,
  queryGroupsList,
  removeGroupMember
} from '../apis';
import { ListItem, MembershipItem } from '../config/types';

type MembersDrawerProps = {
  open: boolean;
  group?: ListItem | null;
  onClose: () => void;
  // Fired after membership changes so the list page can refresh its
  // denormalized member_count column.
  onChanged?: () => void;
};

const MembersDrawer: React.FC<MembersDrawerProps> = ({
  open,
  group,
  onClose,
  onChanged
}) => {
  const intl = useIntl();

  const [members, setMembers] = useState<MembershipItem[]>([]);
  const [userIds, setUserIds] = useState<number[]>([]);
  const [groupIds, setGroupIds] = useState<number[]>([]);

  const {
    dataList: userList,
    fetchData: fetchUserData,
    cancelRequest: cancelUserRequest
  } = useQueryUserList({
    getLabel: (item) => formatUserOption(item).label,
    getValue: (item) => item.id
  });

  const {
    dataList: groupList,
    fetchData: fetchGroupData,
    cancelRequest: cancelGroupRequest
  } = useQueryDataList<ListItem>({
    key: 'groupList',
    fetchList: queryGroupsList,
    getLabel: (item) => item.display_name || item.name,
    getValue: (item) => item.id
  });

  const {
    runAsync: fetchMembers,
    loading: membersLoading,
    cancel: cancelMembersRequest
  } = useRequest(
    async (groupId: number) => {
      const rows = await queryGroupMembers(groupId);
      setMembers(rows || []);
      return rows;
    },
    { manual: true }
  );

  const refresh = async () => {
    if (!group) return;
    await fetchMembers(group.id);
    onChanged?.();
  };

  useEffect(() => {
    if (open && group) {
      fetchMembers(group.id);
      fetchUserData({ page: -1 });
      fetchGroupData({ page: -1 });
    }
    if (!open) {
      setUserIds([]);
      setGroupIds([]);
      setMembers([]);
      cancelMembersRequest();
    }
  }, [open, group?.id]);

  useEffect(() => {
    return () => {
      cancelUserRequest();
      cancelGroupRequest();
      cancelMembersRequest();
    };
  }, []);

  const memberUserIds = useMemo(
    () =>
      new Set(
        members
          .filter((m) => m.member_kind === 'user')
          .map((m) => m.member_principal_id)
      ),
    [members]
  );
  const memberGroupIds = useMemo(
    () =>
      new Set(
        members
          .filter((m) => m.member_kind === 'group')
          .map((m) => m.member_principal_id)
      ),
    [members]
  );

  const userOptions = useMemo(
    () =>
      userList
        .filter((user) => !memberUserIds.has(user.id))
        .map((user) => ({ ...user, ...formatUserOption(user) })),
    [userList, memberUserIds]
  );

  const groupOptions = useMemo(
    () =>
      groupList
        .filter(
          (item) =>
            item.id !== group?.id &&
            !memberGroupIds.has(item.id) &&
            // Reserved system groups are membership-implicit — the
            // server refuses to nest them, so they never appear.
            !item.name?.startsWith('system/')
        )
        .map((item) => ({
          ...item,
          label: item.display_name || item.name,
          value: item.id
        })),
    [groupList, group?.id, memberGroupIds]
  );

  const { runAsync: addMembers, loading: adding } = useRequest(
    async (kind: 'user' | 'group') => {
      if (!group) return;
      const data =
        kind === 'user' ? { user_ids: userIds } : { group_ids: groupIds };
      await addGroupMembers(group.id, data);
      setUserIds([]);
      setGroupIds([]);
      await refresh();
    },
    { manual: true }
  );

  const { runAsync: removeMember, loading: removing } = useRequest(
    async (memberPrincipalId: number) => {
      if (!group) return;
      await removeGroupMember(group.id, memberPrincipalId);
      await refresh();
    },
    { manual: true }
  );

  const renderMemberTable = (kind: 'user' | 'group') => {
    const rows = members.filter((m) => m.member_kind === kind);
    const columns = [
      {
        title: intl.formatMessage({ id: 'common.table.name' }),
        dataIndex: 'username',
        key: 'username',
        ellipsis: true,
        render: (text: string, record: MembershipItem) => {
          const label = record.full_name || record.username;
          return (
            <AutoTooltip ghost style={{ maxWidth: 360 }} title={text}>
              <span className="text-primary">{label}</span>
            </AutoTooltip>
          );
        }
      },
      ...(kind === 'group'
        ? [
            {
              title: intl.formatMessage({ id: 'groups.table.type' }),
              dataIndex: 'group_type',
              key: 'group_type',
              width: 150,
              ellipsis: true,
              render: (text: string) => (
                <AutoTooltip ghost>
                  {intl.formatMessage({ id: `groups.type.${text || 'idp'}` })}
                </AutoTooltip>
              )
            },
            {
              title: intl.formatMessage({ id: 'groups.table.members' }),
              dataIndex: 'group_member_count',
              key: 'group_member_count',
              width: 110,
              render: (text: number) => text ?? 0
            }
          ]
        : [
            // User rows: what the IdP says about the person, from
            // their attribute-derived groups (server-resolved).
            {
              title: intl.formatMessage({ id: 'groups.type.business-unit' }),
              dataIndex: 'business_unit',
              key: 'business_unit',
              ellipsis: true,
              render: (text?: string | null) => (
                <AutoTooltip ghost>{text || '-'}</AutoTooltip>
              )
            },
            {
              title: intl.formatMessage({ id: 'groups.type.department' }),
              dataIndex: 'department',
              key: 'department',
              ellipsis: true,
              render: (text?: string | null) => (
                <AutoTooltip ghost>{text || '-'}</AutoTooltip>
              )
            },
            {
              title: intl.formatMessage({ id: 'groups.type.profession' }),
              dataIndex: 'profession',
              key: 'profession',
              ellipsis: true,
              render: (text?: string | null) => (
                <AutoTooltip ghost>{text || '-'}</AutoTooltip>
              )
            }
          ]),
      {
        title: intl.formatMessage({ id: 'common.table.operation' }),
        key: 'operation',
        dataIndex: 'operation',
        width: 90,
        render: (_: unknown, record: MembershipItem) => (
          <Popconfirm
            title={intl.formatMessage({ id: 'groups.members.removeConfirm' })}
            onConfirm={() => removeMember(record.member_principal_id)}
          >
            <Button type="link" size="small" danger loading={removing}>
              {intl.formatMessage({ id: 'common.button.delete' })}
            </Button>
          </Popconfirm>
        )
      }
    ];
    return (
      <>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <Select
            style={{ flex: 1 }}
            mode="multiple"
            allowClear
            showSearch
            optionFilterProp="label"
            maxTagCount="responsive"
            placeholder={intl.formatMessage({
              id:
                kind === 'user'
                  ? 'groups.members.addUsersPlaceholder'
                  : 'groups.members.addSubgroupsPlaceholder'
            })}
            value={kind === 'user' ? userIds : groupIds}
            onChange={(val) =>
              kind === 'user' ? setUserIds(val || []) : setGroupIds(val || [])
            }
            options={_.orderBy(
              kind === 'user' ? userOptions : groupOptions,
              [(o: { label?: string }) => String(o.label ?? '').toLowerCase()],
              ['asc']
            )}
            notFoundContent={intl.formatMessage({
              id: 'common.search.nodata'
            })}
          ></Select>
          <Button
            type="primary"
            loading={adding}
            disabled={
              kind === 'user' ? userIds.length === 0 : groupIds.length === 0
            }
            onClick={() => addMembers(kind)}
          >
            {intl.formatMessage({ id: 'groups.members.add' })}
          </Button>
        </div>
        <Table
          size="small"
          columns={columns}
          dataSource={rows}
          rowKey="member_principal_id"
          loading={membersLoading}
          pagination={false}
          scroll={{ y: 360 }}
        />
      </>
    );
  };

  const userCount = members.filter((m) => m.member_kind === 'user').length;
  const groupCount = members.filter((m) => m.member_kind === 'group').length;

  const items = [
    {
      key: 'users',
      label: `${intl.formatMessage({ id: 'groups.members.usersTab' })} (${userCount})`,
      children: renderMemberTable('user')
    },
    {
      key: 'subgroups',
      label: `${intl.formatMessage({ id: 'groups.members.subgroupsTab' })} (${groupCount})`,
      children: renderMemberTable('group')
    }
  ];

  const groupLabel = group ? group.display_name || group.name : '';

  return (
    <GSDrawer
      title={
        <span>
          <IconFont
            type="icon-org-outlined"
            className="size-16"
            style={{ marginInlineEnd: 6 }}
          />
          {groupLabel}
        </span>
      }
      open={open}
      onClose={onClose}
      destroyOnHidden={true}
      closeIcon={true}
      keyboard={false}
      styles={{
        wrapper: { width: 720 }
      }}
      footer={false}
    >
      <Tabs defaultActiveKey="users" items={items}></Tabs>
    </GSDrawer>
  );
};

export default MembersDrawer;
