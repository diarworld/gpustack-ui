import { tableSorter } from '@/config/settings';
import {
  AutoTooltip,
  DropdownButtons,
  IconFont,
  icons
} from '@gpustack/core-ui';
import { useIntl } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { ColumnsType } from 'antd/lib/table';
import dayjs from 'dayjs';
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
              <span className="text-primary">
                {record.source !== 'Local' && (
                  <IconFont
                    type="icon-org-outlined"
                    className="size-16 m-r-5"
                  />
                )}
                {label}
              </span>
            </AutoTooltip>
          );
        }
      },
      {
        title: intl.formatMessage({ id: 'groups.table.members' }),
        dataIndex: 'member_count',
        key: 'member_count',
        width: 110,
        render: (text: number) => text ?? 0
      },
      {
        title: intl.formatMessage({ id: 'users.form.source' }),
        dataIndex: 'source',
        key: 'source',
        sorter: tableSorter(3),
        ellipsis: {
          showTitle: false
        },
        render: (text: string) => (
          <AutoTooltip ghost minWidth={20}>
            {text}
          </AutoTooltip>
        )
      },
      {
        title: intl.formatMessage({ id: 'common.table.createTime' }),
        dataIndex: 'created_at',
        key: 'created_at',
        sorter: tableSorter(5),
        ellipsis: {
          showTitle: false
        },
        render: (text: number) => (
          <AutoTooltip ghost>
            {dayjs(text).format('YYYY-MM-DD HH:mm:ss')}
          </AutoTooltip>
        )
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
