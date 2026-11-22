import PluginExtraFields from '@/components/plugin-extra-fields';
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
import { useIntl, useModel } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { Button, ConfigProvider, Input, message, Space, Table } from 'antd';
import _ from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import PageBox from '../_components/page-box';
import {
  createUser,
  deleteUser,
  queryUserAttributeValues,
  queryUsersList,
  updateUser,
  updateUserStatus
} from './apis';
import AddModal from './components/add-modal';
import { FormData, ListItem, UserAttributeValues } from './config/types';
import useUsersColumns from './hooks/use-users-columns';

const Users: React.FC = () => {
  const {
    dataSource,
    rowSelection,
    queryParams,
    sortOrder,
    modalRef,
    handleDelete,
    handleDeleteBatch,
    fetchData,
    handlePageChange,
    handleTableChange,
    handleSearch,
    handleQueryChange,
    handleNameChange
  } = useTableFetch<ListItem>({
    key: PaginationKey.Users,
    fetchAPI: queryUsersList,
    deleteAPI: deleteUser,
    contentForDelete: 'users.table.user'
  });

  const { initialState } = useModel('@@initialState') || {};
  const intl = useIntl();

  // Distinct attribute-derived labels per kind, served by
  // /users/attribute-values; loaded once per mount — the IdP-driven
  // set changes on login/backfill timescales, not per keystroke.
  const [attrValues, setAttrValues] = useState<UserAttributeValues>({
    business_unit: [],
    department: [],
    profession: []
  });
  useEffect(() => {
    queryUserAttributeValues()
      .then(setAttrValues)
      .catch(() => {});
  }, []);

  const toLabelOptions = (values: string[]) =>
    values.map((v) => ({ value: v, label: v }));

  const handleLabelFilter = useMemoizedFn(
    (param: 'business_unit' | 'department' | 'profession', val?: string) => {
      // Empty string drops the param entirely (hasQueryValue), so
      // clearing a select returns to the unfiltered list.
      handleQueryChange({ page: 1, [param]: val || '' });
    }
  );

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

  const handleAddUser = () => {
    setOpenAddModalStatus({
      action: PageAction.CREATE,
      title: intl.formatMessage({ id: 'users.form.create' }),
      open: true,
      currentData: null
    });
  };

  const handleModalOk = async (data: FormData) => {
    const params = {
      ...openAddModalStatus.currentData,
      ...data,
      is_admin: data.is_admin === 'admin'
    };
    try {
      if (openAddModalStatus.action === PageAction.EDIT) {
        await updateUser({
          data: {
            ...params,
            id: openAddModalStatus.currentData?.id
          }
        });
      } else {
        await createUser({ data: params });
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
    console.log('handleModalCancel');
    setOpenAddModalStatus({
      ...openAddModalStatus,
      open: false,
      currentData: null
    });
  };

  const handleEditUser = (row: ListItem) => {
    setOpenAddModalStatus({
      title: intl.formatMessage({ id: 'users.form.edit' }),
      action: PageAction.EDIT,
      open: true,
      currentData: row
    });
  };

  const handleActiveChange = async (checked: boolean, row: ListItem) => {
    try {
      await updateUserStatus({
        id: row.id,
        data: {
          is_active: checked
        }
      });
      handleSearch();
      message.success(intl.formatMessage({ id: 'common.message.success' }));
    } catch (error) {}
  };

  const handleSelect = useMemoizedFn((val: any, row: ListItem) => {
    if (val === 'edit') {
      handleEditUser(row);
    } else if (val === 'delete') {
      handleDelete({ ...row, name: row.username });
    } else if (val === 'active' || val === 'inactive') {
      handleActiveChange(val === 'active', row);
    }
  });

  const renderEmpty = (type?: string) => {
    if (type !== 'Table') return;
    return (
      <NoResult
        minHeight="calc(100vh - 300px)"
        loading={dataSource.loading}
        loadend={dataSource.loadend}
        dataSource={dataSource.dataList}
        image={<IconFont type="icon-users" />}
        filters={_.omit(queryParams, ['sort_by'])}
        noFoundText={intl.formatMessage({
          id: 'noresult.users.nofound'
        })}
        title={intl.formatMessage({ id: 'noresult.users.title' })}
        subTitle={intl.formatMessage({ id: 'noresult.users.subTitle' })}
        onClick={handleAddUser}
        buttonText={intl.formatMessage({ id: 'noresult.button.add' })}
      ></NoResult>
    );
  };

  const columns = useUsersColumns({
    handleSelect,
    sortOrder
  });

  const dataList = useMemo(() => {
    return dataSource.dataList.map((item) => ({
      ...item,
      disabled: initialState?.currentUser?.id === item.id
    }));
  }, [dataSource.dataList, initialState?.currentUser?.id]);

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
                style={{ width: 240 }}
                allowClear
                onChange={handleNameChange}
              />
              <BaseSelect
                allowClear
                placeholder={intl.formatMessage({
                  id: 'groups.type.business-unit'
                })}
                style={{ width: 170 }}
                options={toLabelOptions(attrValues.business_unit)}
                value={queryParams.business_unit || undefined}
                onChange={(val) => handleLabelFilter('business_unit', val)}
              />
              <BaseSelect
                allowClear
                placeholder={intl.formatMessage({
                  id: 'groups.type.department'
                })}
                style={{ width: 150 }}
                options={toLabelOptions(attrValues.department)}
                value={queryParams.department || undefined}
                onChange={(val) => handleLabelFilter('department', val)}
              />
              <BaseSelect
                allowClear
                placeholder={intl.formatMessage({
                  id: 'groups.type.profession'
                })}
                style={{ width: 150 }}
                options={toLabelOptions(attrValues.profession)}
                value={queryParams.profession || undefined}
                onChange={(val) => handleLabelFilter('profession', val)}
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
          buttonText={intl.formatMessage({ id: 'users.button.create' })}
          handleSearch={handleSearch}
          handleDeleteByBatch={handleDeleteBatch}
          handleClickPrimary={handleAddUser}
          rowSelection={rowSelection}
        ></FilterBar>
        <ConfigProvider renderEmpty={renderEmpty}>
          <Table
            className={'scroll-table'}
            columns={columns}
            dataSource={dataList}
            rowSelection={rowSelection}
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
      <DeleteModal ref={modalRef}></DeleteModal>
      {/* Plugin mount point for global Users-page UI (e.g. a
          memberships drawer driven from a `users.rowActions`
          entry's onClick). Renders nothing when no plugin is
          registered. */}
      <PluginExtraFields name="UsersPageGlobal" />
    </>
  );
};

export default Users;
