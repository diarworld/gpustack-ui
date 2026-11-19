/**
 * Confirmation dialog for one rate-limit reset press.
 *
 * The reset forgives the user's weekly or monthly token budget mid-window,
 * so it asks twice: a required reason note (what the budget was spent on)
 * is what the server records in the audit row, and the quota text tells
 * the user how many presses they have left in the floating window.
 */
import { useIntl } from '@umijs/max';
import { Input, Modal } from 'antd';
import React, { useState } from 'react';
import { RateLimitResetStatus } from '../config/types';

const ResetLimitModal: React.FC<{
  open: boolean;
  status?: RateLimitResetStatus;
  confirmLoading: boolean;
  onOk: (description: string) => void;
  onCancel: () => void;
}> = ({ open, status, confirmLoading, onOk, onCancel }) => {
  const intl = useIntl();
  const [reason, setReason] = useState('');
  // The note is the audit trail's substance: whitespace only is no note.
  const okEnabled = reason.trim().length > 0 && !confirmLoading;

  const handleOk = () => {
    if (!okEnabled) return;
    onOk(reason.trim());
  };

  return (
    <Modal
      open={open}
      title={intl.formatMessage({ id: 'usage.rateLimits.resetConfirmTitle' })}
      okText={intl.formatMessage({ id: 'usage.rateLimits.resetButton' })}
      onOk={handleOk}
      onCancel={onCancel}
      okButtonProps={{ disabled: !okEnabled, loading: confirmLoading }}
      destroyOnHidden
      width={440}
    >
      <div style={{ marginBottom: 12 }}>
        {intl.formatMessage(
          { id: 'usage.rateLimits.resetQuotaLeft' },
          { count: status?.available ?? 0 }
        )}
      </div>
      <Input.TextArea
        autoFocus
        rows={3}
        maxLength={500}
        value={reason}
        placeholder={intl.formatMessage({
          id: 'usage.rateLimits.resetReasonPlaceholder'
        })}
        onChange={(e) => setReason(e.target.value)}
      />
    </Modal>
  );
};

export default ResetLimitModal;
