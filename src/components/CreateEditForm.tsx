import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, Button, message as antdMessage } from 'antd';
import { Task } from '../types';
import moment from 'moment';

const { Option } = Select;
const { TextArea } = Input;

interface CreateEditFormProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: Task) => void;
  initialValues?: Task | null;
}

const CreateEditForm: React.FC<CreateEditFormProps> = ({
  open,
  onCancel,
  onSubmit,
  initialValues,
}) => {
  const [message, contextHolder] = antdMessage.useMessage();
  const [form] = Form.useForm();

  useEffect(() => {
    if (open){
      if (initialValues) {
        form.setFieldsValue({
          ...initialValues,
          deadline: initialValues.deadline ? moment(initialValues.deadline) : null,
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, initialValues, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit({
        ...values,
        deadline: values.deadline ? values.deadline.toISOString() : null,
      });
    } catch (error) {
      console.error('Validation failed:', error);
      message.error('Пожалуйста, заполните все обязательные поля');
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        title={initialValues ? 'Редактировать задачу' : 'Создать задачу'}
        open={open}
        onCancel={() => {
          onCancel();
          form.resetFields();
        }}
        destroyOnClose
        footer={[
          <Button key="cancel" onClick={onCancel}>
            Отмена
          </Button>,
          <Button key="submit" type="primary" onClick={handleSubmit}>
            {initialValues ? 'Сохранить' : 'Создать'}
          </Button>,
        ]}
        modalRender={dom => (
          <Form form={form} layout="vertical">
            {dom}
          </Form>
        )}
      >
        <Form.Item
          name="title"
          label="Название"
          rules={[{ required: true, message: 'Пожалуйста, введите название задачи' }]}
        >
          <Input placeholder="Введите название задачи" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Описание"
          rules={[{ required: true, message: 'Пожалуйста, введите описание задачи' }]}
        >
          <TextArea rows={4} placeholder="Введите описание задачи" />
        </Form.Item>

        <Form.Item
          name="status"
          label="Статус"
          rules={[{ required: true, message: 'Пожалуйста, выберите статус задачи' }]}
        >
          <Select placeholder="Выберите статус">
            <Option value="new">Новая</Option>
            <Option value="in_progress">В процессе</Option>
            <Option value="completed">Завершена</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="deadline"
          label="Дедлайн"
          rules={[{ required: true, message: 'Пожалуйста, выберите дедлайн' }]}
        >
          <DatePicker
            style={{ width: '100%' }}
            placeholder="Выберите дату окончания"
          />
        </Form.Item>
      </Modal>
    </>
  );
};

export default CreateEditForm;