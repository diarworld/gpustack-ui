/**
 * The export dropdown the Usage tabs' filter bars share: a download icon
 * button opening the "Export Chart Data" / "Export Table Data" menu.
 *
 * Each entry is present only when its handler is provided — table-only
 * tabs (Limits, Resets, Events) render a one-entry menu rather than a
 * dead chart item. The button carries the in-flight spinner while a table
 * export runs, because that path is two server round trips (size, then
 * stream) with no dialog in between, so the trigger is the only place
 * feedback can go.
 */
import { DownloadOutlined } from '@ant-design/icons';
import { IconFont } from '@gpustack/core-ui';
import { useIntl } from '@umijs/max';
import { Button, Dropdown, MenuProps } from 'antd';
import React from 'react';

interface ExportDropdownProps {
  onExportChart?: () => void;
  onExportTable?: () => void;
  exporting?: boolean;
}

const ExportDropdown: React.FC<ExportDropdownProps> = ({
  onExportChart,
  onExportTable,
  exporting
}) => {
  const intl = useIntl();

  const menuItems: MenuProps['items'] = [];
  if (onExportChart) {
    menuItems.push({
      key: 'chart',
      label: (
        <span className="flex-center gap-8">
          <IconFont type="icon-chart-01" style={{ fontSize: 14 }} />
          <span>{intl.formatMessage({ id: 'usage.export.chart' })}</span>
        </span>
      ),
      onClick: onExportChart
    });
  }
  if (onExportTable) {
    menuItems.push({
      key: 'table',
      label: (
        <span className="flex-center gap-8">
          <IconFont type="icon-table" style={{ fontSize: 14 }} />
          <span>{intl.formatMessage({ id: 'usage.export.table' })}</span>
        </span>
      ),
      onClick: onExportTable
    });
  }

  if (menuItems.length === 0) {
    return null;
  }

  return (
    <Dropdown menu={{ items: menuItems }}>
      <Button icon={<DownloadOutlined />} loading={exporting} />
    </Dropdown>
  );
};

export default ExportDropdown;
