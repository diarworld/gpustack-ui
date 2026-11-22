import { tableSorter } from '@/config/settings';
import { AutoTooltip, DropdownButtons, icons } from '@gpustack/core-ui';
import { useIntl } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { ColumnsType } from 'antd/lib/table';
import { useMemo } from 'react';
import { ListItem } from '../config/types';

interface ColumnsHookProps {
  handleSelect: (val: string, record: ListItem) => void;
  sortOrder: string[];
}

const actionList: Global.ActionItem[] = [
  {
    label: 'groups.action.members',
    key: 'members',
    icon: icons.ProfileOutlined
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
        width: 110,
        sorter: tableSorter(3),
        // The list loads pre-sorted by the server (biggest groups
        // first); this only puts the arrow in the matching state.
        defaultSortOrder: 'descend',
        render: (text: number) => text ?? 0
      },
      {
        title: intl.formatMessage({ id: 'common.table.operation' }),
        key: 'operation',
        dataIndex: 'operation',
        span: 2,
        render: (text, record) => (
          <DropdownButtons
            items={actionList}
            onSelect={(val) => onSelectAction(val, record)}
          />
        )
      }
    ];
  }, [sortOrder, intl, onSelectAction]);
};

export default useGroupsColumns;
