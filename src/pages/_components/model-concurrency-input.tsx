import { quotaPlaceholder } from '@/hooks/use-rate-limit-defaults';
import { InputNumber } from '@gpustack/core-ui';
import { useIntl } from '@umijs/max';
import { Table } from 'antd';

export type ModelConcurrencyValue = Record<string, number>;

// One row per deployed model: the in-flight cap for that model. The form
// value is the raw map; an absent key means "follow the deployment
// default" (the placeholder names it), a typed value is a deliberate pin,
// and 0 is the explicit "unlimited" escape hatch. Whatever the operator
// types is stored — stripping values equal to the default would silently
// drop a tighter cap they meant to set. Shared by the user and the group
// limit editors: the same map lands on the Principal row either way.
const ModelConcurrencyInput: React.FC<{
  value?: ModelConcurrencyValue;
  onChange?: (value: ModelConcurrencyValue) => void;
  models: { name: string }[];
  loading?: boolean;
  defaultConcurrency?: number | null;
}> = ({ value, onChange, models, loading, defaultConcurrency }) => {
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
          placeholder={quotaPlaceholder(intl, defaultConcurrency)}
          onChange={(v) => {
            // Clearing the input returns the model to the deployment
            // default — only a real absence is stored.
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
      // antd renders a permanent scrollbar track once scroll.y is set;
      // short lists get the natural height and no scrollbar, long ones
      // keep the fixed-height body with its scroll.
      scroll={models.length > 6 ? { y: 240 } : undefined}
    />
  );
};

export default ModelConcurrencyInput;
