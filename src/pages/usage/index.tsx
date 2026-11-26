/**
 * Usage page — top-level tab shell.
 *
 * - Summary: cross-resource overview (KPIs + trend + by-type breakdown + donut)
 * - Tokens: per-request token usage over a time range
 * - Limits: per-user rate limits card + the admin's deployment defaults form
 * - Resets: the platform admin's audit list of rate-limit reset presses
 * - Events: lifecycle event list (created / metered / deleted / ...) plus the
 *   rate-limit rejections
 *
 * Events is kept as a tab (not a separate route) so the page filter set stays
 * consistent across all views. The GPU Instances / Storage tabs are not
 * mounted in this build — the whole-machine SKU model meters runtime and PV
 * capacity, which the Summary view already covers.
 */
import { useAccess, useIntl } from '@umijs/max';
import { Tabs, TabsProps } from 'antd';
import React, { useMemo } from 'react';
import ResourceEvents from './events-tab';
import LimitsTab from './limits-tab';
import ResetsTab from './resets-tab';
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
        key: 'resets',
        label: intl.formatMessage({ id: 'usage.tabs.resets' }),
        // Cross-user audit data: the backend 403s non-platform-admins,
        // so the tab only mounts for them instead of erroring on click.
        access: 'canSeeAdmin',
        children: <ResetsTab />
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
  }, [intl, access.canSeeGpuService, access.canSeeAdmin]);

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
