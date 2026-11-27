/**
 * The three attribute pickers the overview tables (limits, resets,
 * resource events) filter by — Business Unit, Department, Profession.
 *
 * One server-resolved option list each (the OIDC attribute sync's
 * display labels); a change always reports the full snapshot, so a
 * tab's query handler can spread it straight into its params. The
 * placeholders reuse the tables' tooltip labels — the picker narrows
 * exactly the column those tooltips spell out.
 */
import { useIntl } from '@umijs/max';
import { Select } from 'antd';
import React from 'react';
import { UserAttributeOptions } from '../config/types';

export type UserAttributeValues = {
  business_unit?: string;
  department?: string;
  profession?: string;
};

type Props = {
  value: UserAttributeValues;
  onChange: (values: UserAttributeValues) => void;
  options?: UserAttributeOptions;
};

const FIELDS = [
  {
    key: 'business_unit' as const,
    labelId: 'usage.events.tooltip.businessUnit',
    labelsOf: (options?: UserAttributeOptions) => options?.business_units
  },
  {
    key: 'department' as const,
    labelId: 'usage.events.tooltip.department',
    labelsOf: (options?: UserAttributeOptions) => options?.departments
  },
  {
    key: 'profession' as const,
    labelId: 'usage.events.tooltip.profession',
    labelsOf: (options?: UserAttributeOptions) => options?.professions
  }
];

const UserAttributeFilters: React.FC<Props> = ({
  value,
  onChange,
  options
}) => {
  const intl = useIntl();

  return (
    <>
      {FIELDS.map((field) => (
        <Select
          key={field.key}
          allowClear
          showSearch
          optionFilterProp="label"
          style={{ minWidth: 170 }}
          value={value[field.key] || undefined}
          onChange={(next) => onChange({ ...value, [field.key]: next ?? '' })}
          options={(field.labelsOf(options) ?? []).map((label) => ({
            value: label,
            label
          }))}
          placeholder={intl.formatMessage({ id: field.labelId })}
        />
      ))}
    </>
  );
};

export default UserAttributeFilters;
