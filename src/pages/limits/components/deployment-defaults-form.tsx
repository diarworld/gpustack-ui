/**
 * Admin form for the editable deployment-wide rate-limit defaults.
 *
 * Fed by GET /rate-limit-settings and saved with PUT. The limit fields are
 * full-replace: a number overrides, an empty field sends null ("inherit
 * the server's config-file value"), and concurrency accepts 0 as an
 * explicit off.
 *
 * The free-window times are stored in UTC (the timezone the gateway plugin
 * enforces) but shown and picked in the browser's local zone — the value
 * converts on the way in and on the way out, and a hint says so. Days are
 * the UTC weekday tokens the plugin accepts (mon..sun).
 */
import { updateRateLimitSettings } from '@/pages/usage/apis';
import { FreeWindowUsage, RateLimitSettings } from '@/pages/usage/config/types';
import useQueryRateLimitSettings from '@/pages/usage/services/use-query-rate-limit-settings';
import { useIntl } from '@umijs/max';
import {
  Button,
  Col,
  Flex,
  Form,
  InputNumber,
  Row,
  Select,
  Switch,
  TimePicker,
  Tooltip,
  message
} from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import React, { useEffect, useMemo, useState } from 'react';

// '15:00' (UTC wall-clock) -> the same instant's HH:mm in the browser's
// zone. "Today" anchors the date part; Moscow-style fixed offsets make the
// choice irrelevant, and a DST-observant zone shifts the pair at most an
// hour — the hint tells the user which zone they are looking at.
const utcToBrowser = (hhmm: string): string => {
  const [h, m] = hhmm.split(':').map(Number);
  const d = new Date();
  d.setUTCHours(h || 0, m || 0, 0, 0);
  return `${String(d.getHours()).padStart(2, '0')}:${String(
    d.getMinutes()
  ).padStart(2, '0')}`;
};

// The inverse: what the picker shows (browser zone) -> UTC wall-clock.
const browserToUtc = (hhmm: string): string => {
  const [h, m] = hhmm.split(':').map(Number);
  const d = new Date();
  d.setHours(h || 0, m || 0, 0, 0);
  return `${String(d.getUTCHours()).padStart(2, '0')}:${String(
    d.getUTCMinutes()
  ).padStart(2, '0')}`;
};

const hhmmToDayjs = (hhmm: string): Dayjs => {
  const [h, m] = hhmm.split(':').map(Number);
  // No customParseFormat: build the wall-clock from parts, today's date —
  // the date part is irrelevant, only HH:mm is read back.
  return dayjs()
    .hour(h || 0)
    .minute(m || 0)
    .second(0)
    .millisecond(0);
};

const hhmmOf = (value: Dayjs | null): string =>
  value ? value.format('HH:mm') : '';

const DeploymentDefaultsForm: React.FC<{
  onSaved?: () => void;
}> = ({ onSaved }) => {
  const intl = useIntl();
  const t = (id: string) => intl.formatMessage({ id });
  const {
    detailData: settings,
    loading,
    fetchData
  } = useQueryRateLimitSettings();
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const [freeEnabled, setFreeEnabled] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  // Load the row into the form whenever it arrives: limits as-is (empty =
  // null = inherit), the free times converted UTC -> browser zone.
  useEffect(() => {
    if (!settings) return;
    setFreeEnabled(settings.free?.enabled ?? false);
    form.setFieldsValue({
      default_rpm: settings.default_rpm ?? undefined,
      default_tpm: settings.default_tpm ?? undefined,
      default_monthly_tokens: settings.default_monthly_tokens ?? undefined,
      default_concurrency: settings.default_concurrency ?? undefined,
      free_start: settings.free
        ? hhmmToDayjs(utcToBrowser(settings.free.start))
        : undefined,
      free_end: settings.free
        ? hhmmToDayjs(utcToBrowser(settings.free.end))
        : undefined,
      free_days: settings.free?.days ?? []
    });
  }, [settings, form]);

  // Localized weekday labels over a fixed Monday-anchored week, in the
  // plugin's canonical mon..sun order.
  const dayOptions = useMemo(() => {
    const fmt = new Intl.DateTimeFormat(intl.locale, { weekday: 'short' });
    // 2026-11-16 is a Monday.
    const monday = new Date(Date.UTC(2026, 10, 16));
    const tokens = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    return tokens.map((token, i) => ({
      value: token,
      label: fmt.format(new Date(monday.getTime() + i * 86_400_000))
    }));
  }, [intl.locale]);

  const save = async (values: any) => {
    setSaving(true);
    try {
      const free: FreeWindowUsage = {
        enabled: freeEnabled,
        start: browserToUtc(hhmmOf(values.free_start)),
        end: browserToUtc(hhmmOf(values.free_end)),
        days: values.free_days ?? []
      };
      const payload: RateLimitSettings = {
        default_rpm: values.default_rpm ?? null,
        default_tpm: values.default_tpm ?? null,
        default_monthly_tokens: values.default_monthly_tokens ?? null,
        default_concurrency: values.default_concurrency ?? null,
        free
      };
      await updateRateLimitSettings(payload);
      message.success(t('usage.deploymentDefaults.saved'));
      await fetchData();
      onSaved?.();
    } catch {
      // The global request handler reported the failure; stay on the form.
    } finally {
      setSaving(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={save}
      disabled={loading}
      requiredMark={false}
      style={{ maxWidth: 720 }}
    >
      <Row gutter={16}>
        <Col span={6}>
          <Form.Item
            name="default_rpm"
            label={
              <Tooltip title={t('usage.deploymentDefaults.rpmHint')}>
                {t('usage.deploymentDefaults.rpm')}
              </Tooltip>
            }
          >
            <InputNumber
              min={1}
              precision={0}
              style={{ width: '100%' }}
              placeholder={t('usage.deploymentDefaults.inheritPlaceholder')}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            name="default_tpm"
            label={
              <Tooltip title={t('usage.deploymentDefaults.tpmHint')}>
                {t('usage.deploymentDefaults.tpm')}
              </Tooltip>
            }
          >
            <InputNumber
              min={1}
              precision={0}
              style={{ width: '100%' }}
              placeholder={t('usage.deploymentDefaults.inheritPlaceholder')}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            name="default_monthly_tokens"
            label={
              <Tooltip title={t('usage.deploymentDefaults.monthlyHint')}>
                {t('usage.deploymentDefaults.monthly')}
              </Tooltip>
            }
          >
            <InputNumber
              min={1}
              precision={0}
              style={{ width: '100%' }}
              placeholder={t('usage.deploymentDefaults.inheritPlaceholder')}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            name="default_concurrency"
            label={
              <Tooltip title={t('usage.deploymentDefaults.concurrencyHint')}>
                {t('usage.deploymentDefaults.concurrency')}
              </Tooltip>
            }
          >
            <InputNumber
              min={0}
              precision={0}
              style={{ width: '100%' }}
              placeholder={t('usage.deploymentDefaults.inheritPlaceholder')}
            />
          </Form.Item>
        </Col>
      </Row>
      <div className="text-secondary" style={{ marginBottom: 16 }}>
        {t('usage.deploymentDefaults.inheritHint')}
      </div>

      <Flex align="center" gap={8} style={{ marginBottom: 12 }}>
        <span className="font-600">{t('usage.deploymentDefaults.free')}</span>
        <Switch
          checked={freeEnabled}
          onChange={(checked) => setFreeEnabled(checked)}
        />
      </Flex>
      <Row gutter={16} align="middle">
        <Col span={8}>
          <Form.Item
            name="free_start"
            label={t('usage.deploymentDefaults.freeStart')}
          >
            <TimePicker format="HH:mm" style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="free_end"
            label={t('usage.deploymentDefaults.freeEnd')}
          >
            <TimePicker format="HH:mm" style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="free_days"
            label={t('usage.deploymentDefaults.freeDays')}
          >
            <Select
              mode="multiple"
              options={dayOptions}
              allowClear
              placeholder={t('usage.deploymentDefaults.freeDaysPlaceholder')}
            />
          </Form.Item>
        </Col>
      </Row>
      <div className="text-secondary" style={{ marginBottom: 16 }}>
        {t('usage.deploymentDefaults.browserZoneHint')}
      </div>

      <Button type="primary" htmlType="submit" loading={saving}>
        {t('usage.deploymentDefaults.save')}
      </Button>
    </Form>
  );
};

export default DeploymentDefaultsForm;
