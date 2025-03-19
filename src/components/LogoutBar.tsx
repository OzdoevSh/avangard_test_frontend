import { Button, Flex } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

interface LogoutBarProps {
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

const LogoutBar = ({ setIsAuthenticated }: LogoutBarProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/auth');
  };

  return (
    <Flex
      justify="space-between"
      align="center"
      style={{
        padding: '16px',
        backgroundColor: '#f0f2f5',
      }}
    >
      <Button
        type="primary"
        icon={<LogoutOutlined />}
        onClick={handleLogout}
      >
        Выйти
      </Button>
    </Flex>
  );
};

export default LogoutBar;