import React, { useState } from 'react';
import { Select, DatePicker, Button, Flex, Grid, Typography, Divider } from 'antd';
import { CloseCircleOutlined, FilterOutlined } from '@ant-design/icons';

const { Option } = Select;
const { useBreakpoint } = Grid;

interface FilterProps {
  onFilterChange: (filters: { status: string; deadline: string }) => void;
}

const Filter: React.FC<FilterProps> = ({ onFilterChange }) => {
  const [status, setStatus] = useState<string>('');
  const [deadline, setDeadline] = useState<string>('');
  const screens = useBreakpoint();

  const handleApplyFilters = () => {
    onFilterChange({ status, deadline });
  };

  const handleResetFilters = () => {
    setStatus('');
    setDeadline('');
    onFilterChange({ status: '', deadline: '' });
  };

  const isMobile = !screens.md;

  return (
    <Flex
      gap="middle"
      vertical={isMobile}
      align={isMobile ? 'stretch' : 'center'}
    >
      <Flex gap="middle" wrap="wrap" align='center'>
        {!isMobile && (
          <>
            <Divider type='vertical'/>
            <Typography.Text strong>Фильтры:</Typography.Text>
          </>
        )}
        <Select
          placeholder="Статус"
          value={status || null}
          onChange={value => setStatus(value)}
          style={{ width: 160 }}
          allowClear
          size="large"
        >
          <Option value="new">Новая</Option>
          <Option value="in_progress">В процессе</Option>
          <Option value="completed">Завершена</Option>
        </Select>

        <DatePicker
          placeholder="Дедлайн"
          onChange={date => setDeadline(date?.toISOString() || '')}
          style={{ width: 160 }}
          size="large"
        />
      </Flex>

      <Flex gap="middle">
        <Button
          type="primary"
          icon={<FilterOutlined />}
          onClick={handleApplyFilters}
          size="large"
          style={{ width: 160 }}
        >
          Применить
        </Button>

        <Button
          icon={<CloseCircleOutlined />}
          size="large"
          onClick={handleResetFilters}
          style={{ width: 160 }}
        >
          Сбросить
        </Button>
      </Flex>
    </Flex>
  );
};

export default Filter;