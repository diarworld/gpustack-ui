import { PageAction } from '@/config';
import { PaginationKey, TABLE_SORT_DIRECTIONS } from '@/config/settings';
import type { PageActionType } from '@/config/types';
import useTableFetch from '@/hooks/use-table-fetch';
import { SearchOutlined, SyncOutlined } from '@ant-design/icons';
import {
  BaseSelect,
  DeleteModal,
  FilterBar,
  IconFont,
  NoResult
} from '@gpustack/core-ui';
import { useIntl } from '@umijs/max';
import { Button, ConfigProvider, Input, message, Space, Table } from 'antd';
import _ from 'lodash';
import { useMemo, useState } from 'react';
import PageBox from '../_components/page-box';
import { createGroup, deleteGroup, queryGroupsList, updateGroup } from './apis';
import AddModal from './components/add-modal';
import LimitsModal from './components/limits-modal';
import MembersDrawer from './components/members-drawer';
import { FormData, ListItem } from './config/types';
import useGroupsColumns from './hooks/use-groups-columns';

const Groups: React.FC = () => {
  const {
    dataSource,
    sortOrder,
    queryParams,
    modalRef,
    handleDelete,
    fetchData,
    handlePageChange,
    handleTableChange,
    handleSearch,
    handleQueryChange,
    handleNameChange
  } = useTableFetch<ListItem>({
    key: PaginationKey.Groups,
    fetchAPI: queryGroupsList,
    deleteAPI: deleteGroup,
    contentForDelete: 'groups.table.group',
    // Biggest groups first — matches the members column's
    // defaultSortOrder; the backend derives the count, so this is the
    // server-side half of the same default.
    defaultQueryParams: { sort_by: '-member_count' }
  });

  const intl = useIntl();
  const [openAddModalStatus, setOpenAddModalStatus] = useState<{
    action: PageActionType;
    open: boolean;
    title: string;
    currentData?: ListItem | null;
  }>({
    action: PageAction.CREATE,
    title: '',
    open: false,
    currentData: null
  });
  const [membersGroup, setMembersGroup] = useState<ListItem | null>(null);
  const [limitsGroup, setLimitsGroup] = useState<ListItem | null>(null);

  const handleAddGroup = () => {
    setOpenAddModalStatus({
      action: PageAction.CREATE,
      title: intl.formatMessage({ id: 'groups.form.create' }),
      open: true,
      currentData: null
    });
  };

  const handleModalOk = async (data: FormData) => {
    try {
      if (openAddModalStatus.action === PageAction.EDIT) {
        await updateGroup({
          data: { ...data, id: openAddModalStatus.currentData?.id }
        });
      } else {
        await createGroup({ data });
      }
      fetchData();
      setOpenAddModalStatus({
        ...openAddModalStatus,
        open: false
      });
      message.success(intl.formatMessage({ id: 'common.message.success' }));
    } catch (error) {}
  };

  const handleModalCancel = () => {
    setOpenAddModalStatus({
      ...openAddModalStatus,
      open: false,
      currentData: null
    });
  };

  const handleSelect = (val: string, row: ListItem) => {
    if (val === 'edit') {
      setOpenAddModalStatus({
        title: intl.formatMessage({ id: 'groups.form.edit' }),
        action: PageAction.EDIT,
        open: true,
        currentData: row
      });
    } else if (val === 'delete') {
      handleDelete({ ...row, name: row.display_name || row.name });
    } else if (val === 'members') {
      setMembersGroup(row);
    } else if (val === 'limits') {
      setLimitsGroup(row);
    }
  };

  // Server-side filter on the derived type token; clearing the select
  // sends no group_type at all (the empty string is dropped).
  const typeFilterOptions = useMemo(
    () =>
      [
        'profession',
        'department',
        'business-unit',
        'local',
        'unknown',
        'idp'
      ].map((token) => ({
        value: token,
        label: intl.formatMessage({ id: `groups.type.${token}` })
      })),
    [intl]
  );

  const handleTypeChange = (val?: string) => {
    handleQueryChange({ page: 1, group_type: val || '' });
  };

  const renderEmpty = (type?: string) => {
    if (type !== 'Table') return;
    return (
      <NoResult
        minHeight="calc(100vh - 300px)"
        loading={dataSource.loading}
        loadend={dataSource.loadend}
        dataSource={dataSource.dataList}
        image={<IconFont type="icon-org-outlined" />}
        filters={_.omit(queryParams, ['sort_by'])}
        noFoundText={intl.formatMessage({
          id: 'noresult.groups.nofound'
        })}
        title={intl.formatMessage({ id: 'noresult.groups.title' })}
        subTitle={intl.formatMessage({ id: 'noresult.groups.subTitle' })}
        onClick={handleAddGroup}
        buttonText={intl.formatMessage({ id: 'noresult.button.add' })}
      ></NoResult>
    );
  };

  const columns = useGroupsColumns({
    handleSelect,
    sortOrder
  });

  return (
    <>
      <PageBox>
        <FilterBar
          left={
            <Space>
              <Input
                prefix={
                  <SearchOutlined
                    style={{ color: 'var(--ant-color-text-placeholder)' }}
                  />
                }
                placeholder={intl.formatMessage({ id: 'common.filter.name' })}
                style={{ width: 300 }}
                allowClear
                onChange={handleNameChange}
              />
              <BaseSelect
                allowClear
                placeholder={intl.formatMessage({ id: 'groups.filter.type' })}
                style={{ width: 180 }}
                options={typeFilterOptions}
                value={queryParams.group_type || undefined}
                onChange={handleTypeChange}
              />
              <Button
                type="text"
                style={{ color: 'var(--ant-color-text-tertiary)' }}
                onClick={handleSearch}
                aria-label={intl.formatMessage({ id: 'common.button.refresh' })}
                title={intl.formatMessage({ id: 'common.button.refresh' })}
                icon={<SyncOutlined />}
              />
            </Space>
          }
          buttonText={intl.formatMessage({ id: 'groups.button.create' })}
          handleSearch={handleSearch}
          handleClickPrimary={handleAddGroup}
        ></FilterBar>
        <ConfigProvider renderEmpty={renderEmpty}>
          <Table
            className={'scroll-table'}
            columns={columns}
            dataSource={dataSource.dataList}
            loading={{
              spinning: dataSource.loading,
              size: 'middle'
            }}
            sortDirections={TABLE_SORT_DIRECTIONS}
            showSorterTooltip={false}
            rowKey="id"
            onChange={handleTableChange}
            pagination={{
              size: 'middle',
              showSizeChanger: true,
              pageSize: queryParams.perPage,
              current: queryParams.page,
              total: dataSource.total,
              hideOnSinglePage: queryParams.perPage === 10,
              onChange: handlePageChange
            }}
          ></Table>
        </ConfigProvider>
      </PageBox>
      <AddModal
        open={openAddModalStatus.open}
        action={openAddModalStatus.action}
        title={openAddModalStatus.title}
        data={openAddModalStatus.currentData}
        onCancel={handleModalCancel}
        onOk={handleModalOk}
      ></AddModal>
      <MembersDrawer
        open={!!membersGroup}
        group={membersGroup}
        onClose={() => setMembersGroup(null)}
        onChanged={fetchData}
      ></MembersDrawer>
      <LimitsModal
        title={intl.formatMessage({ id: 'groups.action.limits' })}
        open={!!limitsGroup}
        group={limitsGroup}
        onSaved={() => {
          setLimitsGroup(null);
          fetchData();
        }}
        onCancel={() => setLimitsGroup(null)}
      ></LimitsModal>
      <DeleteModal ref={modalRef}></DeleteModal>
    </>
  );
};

export default Groups;
