import { useLoginMutation, useRegisterMutation } from '../store/authApi';
import { Form, Input, Button, message as antdMessage, Flex, Card, Segmented, Typography } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthProps {
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

interface AuthSegmentedLabelProps {
  text: string;
}

function Auth({ setIsAuthenticated }: AuthProps) {
  const navigate = useNavigate();
  const [message, contextHolder] = antdMessage.useMessage();
  const [form] = Form.useForm();

  const [register] = useRegisterMutation();
  const [login] = useLoginMutation();

  const [activeSegment, setActiveSegment] = useState<'login' | 'register'>('login');

  const handleRegister = async (values: { email: string; password: string }) => {
    try {
      await register(values).unwrap();
      message.success('Регистрация прошла успешно! Залогиньтесь!');
      form.resetFields();
    } catch (error) {
      console.error(error);
      message.error('Ошибка регистрации!');
    }
  };

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      const response = await login(values).unwrap();
      message.success('Login successful!');
      localStorage.setItem('token', response.token);
      setIsAuthenticated(true);
      navigate('/');
    } catch (error) {
      console.error(error);
      message.error('Ошибка при попытке входа!');
    }
  };

  const handleFinish = (values: { email: string; password: string }) => {
    const { email, password } = values;
    const authMethod = {
      register: handleRegister,
      login: handleLogin,
    };

    authMethod[activeSegment]({ email, password });
  };

  return (
    <Flex
      justify='center'
      align='center'
      style={{
        height: '100vh',
        backgroundColor: '#f0f2f5',
      }}
    >
      {contextHolder}
      <Card
        style={{
          width: '400px',
        }}
        title={(
          <Flex align='center' style={{ margin: 20 }} vertical>
            <Typography.Title level={2}>Добро пожаловать!</Typography.Title>
            <Segmented
              options={[
                { label: <AuthSegmentedLabel text="Вход" />, value: 'login' },
                {
                  label: (
                    <AuthSegmentedLabel text="Регистрация" />
                  ),
                  value: 'register'
                },
              ]}
              value={activeSegment}
              onChange={value => setActiveSegment(value as 'login' | 'register')}
            />
          </Flex>
        )}
      >

        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          requiredMark={false}
        >
          <Flex vertical>
            <Form.Item
              name="email"
              label="Электронная почта:"
              rules={[
                { required: true, message: 'Пожалуйста, введите email' },
                { type: 'email', message: 'Формат email неверный' },
              ]}
            >
              <Input
                size='large'
                prefix={<MailOutlined />}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Пароль:"
              rules={[
                { required: true, message: 'Пожалуйста, введите пароль' },
                { min: 6, message: 'Пароль должен быть не менее 6 символов' },
              ]}            >
              <Input.Password
                size='large'
                prefix={<LockOutlined />}
              />
            </Form.Item>
          </Flex>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size='large'
              style={{ width: '100%' }}
            >
              {activeSegment === 'login' ? 'Войти' : 'Зарегистрироваться'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Flex>
  );
}

function AuthSegmentedLabel({text}: AuthSegmentedLabelProps){
  return (
    <Typography.Title level={3} style={{ margin: '4px' }}>
      {text}
    </Typography.Title>
  );
}

export default Auth;