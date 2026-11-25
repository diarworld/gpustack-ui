/**
 * Per-user limits editor, hosted on the Usage page's "Limits" tab.
 *
 * The same five fields the Users page's form carries, mounted next to the
 * card that displays the effective numbers: an admin pins a user in the
 * picker and edits their rate caps, token budgets and per-model
 * concurrency without leaving the usage picture. Nothing is picked from
 * the card's payload — it shows effective limits, while the form seeds
 * from the stored ones, where null means "the deployment default governs
 * this axis".
 */
import {
  quotaPlaceholder,
  useRateLimitDefaults
} from '@/hooks/use-rate-limit-defaults';
import ModelConcurrencyInput from '@/pages/_components/model-concurrency-input';
import { useQueryModelList } from '@/pages/llmodels/services/use-query-model-list';
import { getUser, updateUserLimits } from '@/pages/users/apis';
import { ListItem } from '@/pages/users/config/types';
import { FormDrawer, InputNumber, useSubmitLock } from '@gpustack/core-ui';
import { useIntl } from '@umijs/max';
import { Form, message } from 'antd';
import React, { useEffect, useState } from 'react';

type UserLimitsFormData = {
  rpm_limit?: number | null;
  tpm_limit?: number | null;
  weekly_token_limit?: number | null;
  monthly_token_limit?: number | null;
  model_concurrency_limits?: Record<string, number> | null;
};

type UserLimitsModalProps = {
  title: string;
  open: boolean;
  // The target user: the pinned picker selection, or the admin themself
  // when nothing is pinned.
  userId: number;
  onSaved: () => void;
  onCancel: () => void;
};

const UserLimitsModal: React.FC<UserLimitsModalProps> = ({
  title,
  open,
  userId,
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
  // Admins are exempt from the concurrency cap server-side — the same
  // rule that hides the field on the Users page form.
  const [targetIsAdmin, setTargetIsAdmin] = useState(false);
  // The row the editor read: the submit needs its username (the update
  // schema requires it) and its admin flag.
  const [target, setTarget] = useState<ListItem | null>(null);

  const handleSubmit = () => {
    guard(() => form.submit());
  };

  const onFinish = async (values: UserLimitsFormData) => {
    if (!target) return;
    // The map is stored verbatim: a typed value is a deliberate pin (1
    // tighter than the default included), an absent key follows the
    // deployment default the placeholder names. An empty map collapses to
    // null so the account carries no block at all.
    const map = values.model_concurrency_limits;
    await run(async () => {
      await updateUserLimits(userId, {
        username: target.username,
        rpm_limit: values.rpm_limit ?? null,
        tpm_limit: values.tpm_limit ?? null,
        weekly_token_limit: values.weekly_token_limit ?? null,
        monthly_token_limit: values.monthly_token_limit ?? null,
        model_concurrency_limits: map && Object.keys(map).length ? map : null
      });
      message.success(
        intl.formatMessage({ id: 'usage.rateLimits.editLimitsSuccess' })
      );
      onSaved();
    });
  };

  useEffect(() => {
    if (!open) return;
    getUser(userId)
      .then((user) => {
        setTarget(user);
        setTargetIsAdmin(!!user.is_admin);
        form.setFieldsValue({
          // null (no stored value) and undefined mean the same thing to
          // the form; null would defeat the input's default-parameter.
          rpm_limit: user.rpm_limit ?? undefined,
          tpm_limit: user.tpm_limit ?? undefined,
          weekly_token_limit: user.weekly_token_limit ?? undefined,
          monthly_token_limit: user.monthly_token_limit ?? undefined,
          model_concurrency_limits: user.model_concurrency_limits ?? undefined
        });
      })
      .catch(() => {
        // The global request handler reported the failure; drop the
        // drawer so an empty form is not mistaken for a cleared account.
        onCancel();
      });
    fetchModelList({ page: -1 });
  }, [open, userId]);

  return (
    <FormDrawer
      title={title}
      open={open}
      onCancel={onCancel}
      onSubmit={handleSubmit}
      loading={loading}
    >
      <Form
        name="userLimitsForm"
        form={form}
        onFinish={onFinish}
        onFinishFailed={release}
        preserve={false}
      >
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ flex: 1 }}>
            <Form.Item<UserLimitsFormData>
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
                  id: 'users.form.rateLimits.hint'
                })}
                placeholder={quotaPlaceholder(intl, defaults?.default_rpm)}
              />
            </Form.Item>
          </div>
          <div style={{ flex: 1 }}>
            <Form.Item<UserLimitsFormData>
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
                  id: 'users.form.rateLimits.tpmHint'
                })}
                placeholder={quotaPlaceholder(intl, defaults?.default_tpm)}
              />
            </Form.Item>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ flex: 1 }}>
            <Form.Item<UserLimitsFormData>
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
                  id: 'users.form.tokenBudgets.hint'
                })}
                placeholder={intl.formatMessage({
                  id: 'users.form.tokenBudgets.none'
                })}
              />
            </Form.Item>
          </div>
          <div style={{ flex: 1 }}>
            <Form.Item<UserLimitsFormData>
              name="monthly_token_limit"
              rules={[{ required: false }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={1}
                precision={0}
                alwaysFocus
                label={intl.formatMessage({ id: 'users.form.monthlyTokens' })}
                placeholder={quotaPlaceholder(
                  intl,
                  defaults?.default_monthly_tokens
                )}
              />
            </Form.Item>
          </div>
        </div>

        {!targetIsAdmin && (
          <Form.Item<UserLimitsFormData>
            name="model_concurrency_limits"
            rules={[{ required: false }]}
            extra={intl.formatMessage({
              id: 'users.form.modelConcurrency.hint'
            })}
          >
            <ModelConcurrencyInput
              models={modelList ?? []}
              loading={modelLoading}
              defaultConcurrency={defaults?.default_concurrency}
            />
          </Form.Item>
        )}
      </Form>
    </FormDrawer>
  );
};

export default UserLimitsModal;
