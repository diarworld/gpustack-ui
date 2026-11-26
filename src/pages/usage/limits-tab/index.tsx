/**
 * "Limits" tab of the Usage page.
 *
 * Forked by admin access, because the two audiences need different
 * things from the same feature:
 *  - Platform admins get the cross-user limits table (one row per
 *    active user, inline limit editing) — the personal cards and the
 *    per-model concurrency block are not duplicated under it. The
 *    deployment-defaults form lives on its own page now
 *    (/access-control/limits), next to the other admin directories.
 *  - Everyone else keeps the personal card as it was — own limits with
 *    the live counters and the reset buttons — plus the org owner's
 *    user picker, which pins the card to any org member.
 */
import { SyncOutlined } from '@ant-design/icons';
import { useAccess, useIntl } from '@umijs/max';
import { Button, Flex, Select } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import RateLimitsCard from '../components/rate-limits-card';
import useQueryUsageMetaData from '../services/use-query-meta-data';
import UsersLimitsTable from './tables/users-limits-table';

const LimitsTab: React.FC = () => {
  const intl = useIntl();
  const access = useAccess();
  const [selectedUserId, setSelectedUserId] = useState<number>();
  const [refreshKey, setRefreshKey] = useState(0);

  return access.canSeeAdmin ? (
    <UsersLimitsTable />
  ) : (
    <PersonalLimits
      selectedUserId={selectedUserId}
      setSelectedUserId={setSelectedUserId}
      refreshKey={refreshKey}
      setRefreshKey={setRefreshKey}
    />
  );
};

// The pre-existing personal view: self-scoped card, org owner's picker.
// Deliberately unchanged while the admin branch moved on.
const PersonalLimits: React.FC<{
  selectedUserId?: number;
  setSelectedUserId: (value?: number) => void;
  refreshKey: number;
  setRefreshKey: React.Dispatch<React.SetStateAction<number>>;
}> = ({ selectedUserId, setSelectedUserId, refreshKey, setRefreshKey }) => {
  const intl = useIntl();
  const access = useAccess();
  const { detailData: metaData, fetchData: fetchMetaData } =
    useQueryUsageMetaData();

  useEffect(() => {
    // include_all_users: the meta options derive from usage rows, so a
    // provisioned account that never called would be unpickable — pinning
    // a user to view their limits is a directory operation.
    fetchMetaData({ include_all_users: true });
  }, []);

  // Org owners only: the endpoint degrades a foreign id to the caller, so
  // regular users never see the picker at all.
  const userOptions = useMemo(() => {
    if (!access.canSeeOrgAdmin) return [];
    return (metaData?.users ?? [])
      .map((item) => {
        // The usage snapshot only knows the login (user_name); the live
        // display name rides along so the picker matches either. Composed
        // into the label the way the Users table formats its options —
        // "Full name [login]" — so a search on either part hits, and a
        // display name that just repeats the login collapses away.
        const displayName = item.display_name?.trim();
        const label =
          displayName && displayName !== item.label
            ? `${displayName} [${item.label}]`
            : item.label;
        return {
          value: item.identity?.current?.user_id ?? null,
          label
        };
      })
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
    </div>
  );
};

export default LimitsTab;
