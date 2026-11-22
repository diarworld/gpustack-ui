import { PageActionType } from '@/config/types';
import { Input as CInput, FormDrawer, useSubmitLock } from '@gpustack/core-ui';
import { useIntl } from '@umijs/max';
import { Form } from 'antd';
import { useEffect } from 'react';
import { FormData, ListItem } from '../config/types';

type AddModalProps = {
  title: string;
  action: PageActionType;
  open: boolean;
  onOk: (values: FormData) => void | Promise<void>;
  data?: ListItem | null;
  onCancel: () => void;
};

const AddModal: React.FC<AddModalProps> = ({
  title,
  open,
  onOk,
  data,
  onCancel
}) => {
  const [form] = Form.useForm();
  const intl = useIntl();
  const { loading, guard, run, release } = useSubmitLock();

  const initFormValue = () => {
    if (open) {
      form.setFieldsValue({
        name: data?.name,
        description: data?.description ?? undefined
      });
    }
  };

  const handleSubmit = () => {
    guard(() => form.submit());
  };

  const onFinish = async (values: FormData) => {
    await run(() => onOk(values));
  };

  useEffect(() => {
    initFormValue();
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
        name="addGroupForm"
        form={form}
        onFinish={onFinish}
        onFinishFailed={release}
        preserve={false}
      >
        <Form.Item<FormData>
          name="name"
          rules={[
            {
              required: true,
              message: intl.formatMessage(
                { id: 'common.form.rule.input' },
                {
                  name: intl.formatMessage({ id: 'common.table.name' })
                }
              )
            }
          ]}
        >
          <CInput.Input
            autoComplete="off"
            label={intl.formatMessage({ id: 'common.table.name' })}
            required
            placeholder={intl.formatMessage({
              id: 'groups.form.name.placeholder'
            })}
          ></CInput.Input>
        </Form.Item>
        <Form.Item<FormData> name="description" rules={[{ required: false }]}>
          <CInput.Input
            trim={false}
            label={intl.formatMessage({ id: 'groups.form.description' })}
          ></CInput.Input>
        </Form.Item>
      </Form>
    </FormDrawer>
  );
};

export default AddModal;
