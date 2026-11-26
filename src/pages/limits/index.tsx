/**
 * "Limits" page of the Access Control section.
 *
 * The deployment-wide rate-limit defaults and the free window — the form
 * moved here from the Usage page's Limits tab, whose admin block it used
 * to be. Editing lands on the ``gateway_rate_limit_settings`` row; the
 * reconciler fans the change out to the gateway without a restart, so
 * nothing on this page needs a "where does this apply" note beyond the
 * form's own hints.
 */
import { CardWrapper } from '@gpustack/core-ui';
import { useIntl } from '@umijs/max';
import React from 'react';
import PageBox from '../_components/page-box';
import DeploymentDefaultsForm from './components/deployment-defaults-form';

const Limits: React.FC = () => {
  const intl = useIntl();
  const t = (id: string) => intl.formatMessage({ id });

  return (
    <PageBox>
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
              {t('usage.deploymentDefaults.title')}
            </span>
          </span>
        </div>
        <div
          className="text-secondary"
          style={{ marginBottom: 16, maxWidth: 720 }}
        >
          {t('usage.deploymentDefaults.hint')}
        </div>
        <DeploymentDefaultsForm />
      </CardWrapper>
    </PageBox>
  );
};

export default Limits;
