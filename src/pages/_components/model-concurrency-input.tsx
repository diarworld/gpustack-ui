import { InputNumber } from '@gpustack/core-ui';
import { useIntl } from '@umijs/max';
import { Table } from 'antd';

export type ModelConcurrencyValue = Record<string, number>;

// One row per deployed model: the in-flight cap for that model. The form
// value is the raw map; entries equal to the deployment default (1) are
// stripped at submit — 1 is what the deployment enforces anyway, so storing
// it would freeze an override the operator never meant to set. 0 is stored:
// it is the explicit "unlimited" escape hatch, distinct from "follow the
// default". Shared by the user and the group limit editors: the same map
// lands on the Principal row either way.
const ModelConcurrencyInput: React.FC<{
  value?: ModelConcurrencyValue;
  onChange?: (value: ModelConcurrencyValue) => void;
  models: { name: string }[];
  loading?: boolean;
}> = ({ value, onChange, models, loading }) => {
  const intl = useIntl();
  // The form field is null when the account has no overrides stored (the
  // submit collapses an empty map to null); default-parameter syntax
  // only fills in for undefined, so normalize here.
  const limits = value ?? {};
  const columns = [
    {
      title: intl.formatMessage({ id: 'common.table.name' }),
      dataIndex: 'name',
      ellipsis: true
    },
    {
      title: intl.formatMessage({ id: 'users.form.modelConcurrency' }),
      width: 170,
      render: (_: unknown, record: { name: string }) => (
        <InputNumber
          style={{ width: '100%' }}
          min={0}
          precision={0}
          value={limits[record.name]}
          placeholder={intl.formatMessage({
            id: 'users.form.modelConcurrency.default'
          })}
          onChange={(v) => {
            // Clearing the input returns the model to the deployment
            // default — an absent key and an explicit 1 mean the same
            // thing to the gateway, so only real overrides are kept.
            const next = { ...limits };
            if (v === null || v === undefined) {
              delete next[record.name];
            } else {
              next[record.name] = Number(v);
            }
            onChange?.(next);
          }}
        />
      )
    }
  ];
  return (
    <Table
      size="small"
      rowKey="name"
      columns={columns}
      dataSource={models}
      loading={loading}
      pagination={false}
      scroll={{ y: 240 }}
    />
  );
};

export default ModelConcurrencyInput;
