import { PageAction } from '@/config';
import { PaginationKey, TABLE_SORT_DIRECTIONS } from '@/config/settings';
import type { PageActionType } from '@/config/types';
import useTableFetch from '@/hooks/use-table-fetch';
import { DeleteModal, FilterBar, IconFont, NoResult } from '@gpustack/core-ui';
import { useIntl } from '@umijs/max';
import { ConfigProvider, message, Table } from 'antd';
import _ from 'lodash';
import { useState } from 'react';
import PageBox from '../_components/page-box';
import { createGroup, deleteGroup, queryGroupsList, updateGroup } from './apis';
import AddModal from './components/add-modal';
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
    handleNameChange
  } = useTableFetch<ListItem>({
    key: PaginationKey.Groups,
    fetchAPI: queryGroupsList,
    deleteAPI: deleteGroup,
    contentForDelete: 'groups.table.group'
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
    }
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
          buttonText={intl.formatMessage({ id: 'groups.button.create' })}
          handleSearch={handleSearch}
          handleClickPrimary={handleAddGroup}
          handleInputChange={handleNameChange}
          widths={{ input: 300 }}
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
      <DeleteModal ref={modalRef}></DeleteModal>
    </>
  );
};

export default Groups;
