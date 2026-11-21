/**
 * "Limits" tab of the Usage page.
 *
 * The deployment's rate-limit picture in one place: the per-user limits
 * card (moved here from the Tokens tab, self-scoped unless an admin pins a
 * user) and, for platform admins, the form that edits the deployment-wide
 * defaults and the free-window schedule. The filter set is deliberately
 * minimal — a user picker and refresh — because unlike the Tokens tab
 * nothing here is time-ranged: limits and counters are "now" views.
 */
import { SyncOutlined } from '@ant-design/icons';
import { CardWrapper } from '@gpustack/core-ui';
import { useAccess, useIntl } from '@umijs/max';
import { Button, Flex, Select } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import RateLimitsCard from '../components/rate-limits-card';
import useQueryUsageMetaData from '../services/use-query-meta-data';
import DeploymentDefaultsForm from './components/deployment-defaults-form';

const LimitsTab: React.FC = () => {
  const intl = useIntl();
  const access = useAccess();
  const { detailData: metaData, fetchData: fetchMetaData } =
    useQueryUsageMetaData();
  const [selectedUserId, setSelectedUserId] = useState<number>();
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetchMetaData();
  }, []);

  // Admins only: the endpoint degrades a foreign id to the caller, so
  // regular users never see the picker at all.
  const userOptions = useMemo(() => {
    if (!access.canSeeOrgAdmin) return [];
    return (metaData?.users ?? [])
      .map((item) => ({
        value: item.identity?.current?.user_id ?? null,
        label: item.label
      }))
      .filter(
        (opt): opt is { value: number; label: string } => opt.value != null
      );
  }, [access.canSeeOrgAdmin, metaData?.users]);

  return (
    <div>
      <Flex gap={8} align="center" wrap="wrap">
        {access.canSeeOrgAdmin && (
          <Select
            allowClear
            showSearch
            optionFilterProp="label"
            style={{ minWidth: 220 }}
            value={selectedUserId}
            onChange={(value) => setSelectedUserId(value ?? undefined)}
            options={userOptions}
            placeholder={intl.formatMessage({ id: 'usage.filter.user' })}
          />
        )}
        <Button
          icon={<SyncOutlined />}
          onClick={() => setRefreshKey((prev) => prev + 1)}
        >
          {intl.formatMessage({ id: 'common.button.refresh' })}
        </Button>
      </Flex>
      {/* Same treatment the card had on the Tokens tab, plus the top margin
          it always lacked — the filter row above used to sit flush against
          the card. */}
      <div style={{ marginBlock: 24 }}>
        <RateLimitsCard userId={selectedUserId} refreshKey={refreshKey} />
      </div>
      {access.canSeeAdmin && (
        <CardWrapper style={{ paddingBlock: 16 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              rowGap: 4,
              flexWrap: 'wrap',
              marginBottom: 16
            }}
          >
            <span
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              <span
                className="text-secondary"
                style={{
                  width: 4,
                  height: 14,
                  borderRadius: 2,
                  background: 'currentColor'
                }}
              />
              <span className="font-600" style={{ fontSize: 15 }}>
                {intl.formatMessage({
                  id: 'usage.deploymentDefaults.title'
                })}
              </span>
            </span>
          </div>
          <div
            className="text-secondary"
            style={{ marginBottom: 16, maxWidth: 720 }}
          >
            {intl.formatMessage({ id: 'usage.deploymentDefaults.hint' })}
          </div>
          <DeploymentDefaultsForm
            onSaved={() => setRefreshKey((prev) => prev + 1)}
          />
        </CardWrapper>
      )}
    </div>
  );
};

export default LimitsTab;
