import {
  quotaPlaceholder,
  useRateLimitDefaults
} from '@/hooks/use-rate-limit-defaults';
import ModelConcurrencyInput from '@/pages/_components/model-concurrency-input';
import { useQueryModelList } from '@/pages/llmodels/services/use-query-model-list';
import { FormDrawer, InputNumber, useSubmitLock } from '@gpustack/core-ui';
import { useIntl } from '@umijs/max';
import { Form, message } from 'antd';
import { useEffect } from 'react';
import { updateGroupLimits } from '../apis';
import { LimitsFormData, ListItem } from '../config/types';

type LimitsModalProps = {
  title: string;
  open: boolean;
  group: ListItem | null;
  onSaved: () => void;
  onCancel: () => void;
};

// The group's quota editor, mirroring the user form's limits block. The
// submit is full-replace: every field lands on the row, so a cleared input
// sends null and the dash comes back to the table.
const LimitsModal: React.FC<LimitsModalProps> = ({
  title,
  open,
  group,
  onSaved,
  onCancel
}) => {
  const [form] = Form.useForm();
  const intl = useIntl();
  const { loading, guard, run, release } = useSubmitLock();
  const defaults = useRateLimitDefaults();
  const {
    dataList: modelList,
    loading: modelLoading,
    fetchData: fetchModelList
  } = useQueryModelList();

  const initFormValue = () => {
    if (open && group) {
      form.setFieldsValue({
        // null (no stored value) and undefined mean the same thing to the
        // form; null would defeat the input's default-parameter.
        rpm_limit: group.rpm_limit ?? undefined,
        tpm_limit: group.tpm_limit ?? undefined,
        weekly_token_limit: group.weekly_token_limit ?? undefined,
        monthly_token_limit: group.monthly_token_limit ?? undefined,
        model_concurrency_limits: group.model_concurrency_limits ?? undefined
      });
    }
  };

  const handleSubmit = () => {
    guard(() => form.submit());
  };

  const onFinish = async (values: LimitsFormData) => {
    if (!group) return;
    // The map is stored verbatim: a typed value is a deliberate pin (1
    // tighter than the default included), an absent key follows the
    // deployment default the placeholder names. An empty map collapses to
    // null so the group carries no block at all.
    const map = values.model_concurrency_limits;
    await run(async () => {
      await updateGroupLimits(group.id, {
        rpm_limit: values.rpm_limit ?? null,
        tpm_limit: values.tpm_limit ?? null,
        weekly_token_limit: values.weekly_token_limit ?? null,
        monthly_token_limit: values.monthly_token_limit ?? null,
        model_concurrency_limits: map && Object.keys(map).length ? map : null
      });
      message.success(intl.formatMessage({ id: 'groups.limits.success' }));
      onSaved();
    });
  };

  useEffect(() => {
    initFormValue();
    if (open) {
      fetchModelList({ page: -1 });
    }
  }, [open]);

  return (
    <FormDrawer
      title={title}
      open={open}
      onCancel={onCancel}
      onSubmit={handleSubmit}
      loading={loading}
    >
      <Form
        name="groupLimitsForm"
        form={form}
        onFinish={onFinish}
        onFinishFailed={release}
        preserve={false}
      >
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ flex: 1 }}>
            <Form.Item<LimitsFormData>
              name="rpm_limit"
              rules={[{ required: false }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={1}
                precision={0}
                // The in-field label only floats up on focus or value;
                // a blurred empty field would drop it onto the
                // placeholder. Float it always so the placeholder —
                // which quotes the deployment default — stays readable.
                alwaysFocus
                label={intl.formatMessage({ id: 'users.form.rpm' })}
                description={intl.formatMessage({
                  id: 'groups.limits.rpmHint'
                })}
                placeholder={quotaPlaceholder(intl, defaults?.default_rpm)}
              />
            </Form.Item>
          </div>
          <div style={{ flex: 1 }}>
            <Form.Item<LimitsFormData>
              name="tpm_limit"
              rules={[{ required: false }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={1}
                precision={0}
                alwaysFocus
                label={intl.formatMessage({ id: 'users.form.tpm' })}
                description={intl.formatMessage({
                  id: 'groups.limits.tpmHint'
                })}
                placeholder={quotaPlaceholder(intl, defaults?.default_tpm)}
              />
            </Form.Item>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ flex: 1 }}>
            <Form.Item<LimitsFormData>
              name="weekly_token_limit"
              rules={[{ required: false }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={1}
                precision={0}
                alwaysFocus
                label={intl.formatMessage({ id: 'users.form.weeklyTokens' })}
                description={intl.formatMessage({
                  id: 'groups.limits.weeklyHint'
                })}
                placeholder={intl.formatMessage({
                  id: 'users.form.tokenBudgets.none'
                })}
              />
            </Form.Item>
          </div>
          <div style={{ flex: 1 }}>
            <Form.Item<LimitsFormData>
              name="monthly_token_limit"
              rules={[{ required: false }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={1}
                precision={0}
                alwaysFocus
                label={intl.formatMessage({ id: 'users.form.monthlyTokens' })}
                description={intl.formatMessage({
                  id: 'groups.limits.monthlyHint'
                })}
                placeholder={quotaPlaceholder(
                  intl,
                  defaults?.default_monthly_tokens
                )}
              />
            </Form.Item>
          </div>
        </div>

        <Form.Item<LimitsFormData>
          name="model_concurrency_limits"
          rules={[{ required: false }]}
          extra={intl.formatMessage({ id: 'groups.limits.concurrencyHint' })}
        >
          <ModelConcurrencyInput
            models={modelList ?? []}
            loading={modelLoading}
            defaultConcurrency={defaults?.default_concurrency}
          />
        </Form.Item>
      </Form>
    </FormDrawer>
  );
};

export default LimitsModal;
