import { tableSorter } from '@/config/settings';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { AutoTooltip, DropdownButtons, icons } from '@gpustack/core-ui';
import { useIntl } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { Tooltip } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useMemo } from 'react';
import { ListItem } from '../config/types';

interface ColumnsHookProps {
  handleSelect: (val: string, record: ListItem) => void;
  sortOrder: string[];
}

const actionList: Global.ActionItem<ListItem>[] = [
  {
    label: 'groups.action.members',
    key: 'members',
    icon: icons.ProfileOutlined
  },
  {
    label: 'groups.action.limits',
    key: 'limits',
    icon: icons.ThunderboltOutlined
  },
  {
    label: 'common.button.edit',
    key: 'edit',
    icon: icons.EditOutlined
  },
  {
    label: 'common.button.delete',
    key: 'delete',
    icon: icons.DeleteOutlined,
    props: { danger: true }
  }
];

const useGroupsColumns = ({
  handleSelect,
  sortOrder
}: ColumnsHookProps): ColumnsType<ListItem> => {
  const intl = useIntl();

  const onSelectAction = useMemoizedFn((val: string, record: ListItem) => {
    handleSelect(val, record);
  });

  const setActions = useMemoizedFn((record: ListItem) => {
    // Attribute/claim-synced groups are the IdP's authority: the row
    // (name, type, members) changes only in KeyCloak, so edit/delete
    // are disabled with a hint instead of inviting edits the sync
    // would revert. Viewing members stays open for every group.
    if (record.source === 'Local') {
      return actionList;
    }
    const hint = intl.formatMessage({ id: 'groups.syncedFromIdpHint' });
    return actionList.map((action) =>
      action.key === 'edit' || action.key === 'delete'
        ? { ...action, disabled: true, title: hint }
        : action
    );
  });

  return useMemo(() => {
    return [
      {
        title: intl.formatMessage({ id: 'common.table.name' }),
        dataIndex: 'name',
        key: 'name',
        sorter: tableSorter(1),
        render: (text: string, record: ListItem) => {
          // Attribute-derived groups carry a readable label (the raw
          // title / department name); the prefixed name stays the
          // stable identifier and surfaces in the tooltip.
          const label = record.display_name || record.name;
          return (
            <AutoTooltip ghost style={{ maxWidth: 400 }} title={record.name}>
              <span className="text-primary">{label}</span>
            </AutoTooltip>
          );
        }
      },
      {
        title: intl.formatMessage({ id: 'groups.table.type' }),
        dataIndex: 'group_type',
        key: 'group_type',
        width: 150,
        ellipsis: {
          showTitle: false
        },
        render: (text: string) => (
          <AutoTooltip ghost minWidth={20}>
            {intl.formatMessage({
              id: `groups.type.${text || 'idp'}`
            })}
          </AutoTooltip>
        )
      },
      {
        title: intl.formatMessage({ id: 'groups.table.members' }),
        dataIndex: 'member_count',
        key: 'member_count',
        // Wide enough for the header plus its sort arrows — below
        // ~130px antd truncates the title to "Участни…".
        width: 130,
        sorter: tableSorter(3),
        // The list loads pre-sorted by the server (biggest groups
        // first); this only puts the arrow in the matching state.
        defaultSortOrder: 'descend',
        render: (text: number) => text ?? 0
      },
      ...(
        [
          ['rpm_limit', 'groups.table.rpm', 'groups.table.rpmHint', 100],
          ['tpm_limit', 'groups.table.tpm', 'groups.table.tpmHint', 110],
          [
            'weekly_token_limit',
            'groups.table.week',
            'groups.table.weekHint',
            110
          ],
          [
            'monthly_token_limit',
            'groups.table.month',
            'groups.table.monthHint',
            110
          ]
        ] as const
      ).map(([dataIndex, titleId, hintId, width]) => ({
        title: (
          <span>
            {intl.formatMessage({ id: titleId })}
            <Tooltip title={intl.formatMessage({ id: hintId })}>
              <QuestionCircleOutlined style={{ opacity: 0.6 }} />
            </Tooltip>
          </span>
        ),
        dataIndex,
        key: dataIndex,
        width,
        sorter: tableSorter(1),
        // Server-sorted (the sort_by param rides the query); unset
        // quotas render the dash, matching the form's empty input.
        render: (text: number | null) => text ?? '—'
      })),
      {
        title: intl.formatMessage({ id: 'common.table.operation' }),
        key: 'operation',
        dataIndex: 'operation',
        span: 2,
        render: (text, record) => (
          <DropdownButtons
            items={setActions(record)}
            onSelect={(val) => onSelectAction(val, record)}
          />
        )
      }
    ];
  }, [sortOrder, intl, onSelectAction, setActions]);
};

export default useGroupsColumns;
