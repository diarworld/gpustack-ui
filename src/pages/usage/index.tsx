/**
 * Usage page — top-level tab shell.
 *
 * - Summary: cross-resource overview (KPIs + trend + by-type breakdown + donut)
 * - Tokens: per-request token usage over a time range
 * - Limits: per-user rate limits card + the admin's deployment defaults form
 * - GPU Instances: per-instance compute usage
 * - Storage: PV capacity usage
 * - Resource Events: lifecycle event list (created / metered / deleted / ...)
 *
 * Resource Events is kept as a tab (not a separate route) so the page filter
 * set stays consistent across all views.
 */
import { useAccess, useIntl } from '@umijs/max';
import { Tabs, TabsProps } from 'antd';
import React, { useMemo } from 'react';
import ResourceEvents from './events-tab';
import GpuInstancesTab from './instances-tab';
import LimitsTab from './limits-tab';
import StorageTab from './storage-tab';
import SummaryTab from './summary-tab';
import TokenTab from './token-tab';

const Usage: React.FC = () => {
  const access = useAccess();
  const intl = useIntl();

  const items: TabsProps['items'] = useMemo(() => {
    type AccessTab = NonNullable<TabsProps['items']>[number] & {
      access?: string;
    };
    const tabs: AccessTab[] = [
      {
        key: 'summary',
        label: intl.formatMessage({ id: 'usage.tabs.summary' }),
        access: 'canSeeGpuService',
        children: <SummaryTab />
      },
      {
        key: 'tokens',
        label: intl.formatMessage({ id: 'usage.tabs.tokens' }),
        children: <TokenTab />
      },
      {
        key: 'limits',
        label: intl.formatMessage({ id: 'usage.tabs.limits' }),
        children: <LimitsTab />
      },
      {
        key: 'gpu-instances',
        label: intl.formatMessage({ id: 'usage.tabs.gpuInstances' }),
        access: 'canSeeGpuService',
        children: <GpuInstancesTab />
      },
      {
        key: 'storage',
        label: intl.formatMessage({ id: 'usage.tabs.storage' }),
        access: 'canSeeGpuService',
        children: <StorageTab />
      },
      {
        key: 'resource-events',
        label: intl.formatMessage({ id: 'usage.tabs.resourceEvents' }),
        access: 'canSeeGpuService',
        children: <ResourceEvents />
      }
    ];
    return tabs.filter((item) => {
      if (!item.access) return true;
      return (access as Record<string, boolean>)[item.access];
    });
  }, [intl, access.canSeeGpuService]);

  return (
    <Tabs
      items={items}
      // The content area adds 24px top padding; on table pages that space is
      // filled immediately, but here it sits empty above the tab bar and reads
      // as too tall. Pull the tab bar up to ~flush with the header divider.
      tabBarStyle={{ marginTop: -20 }}
    />
  );
};

export default Usage;
