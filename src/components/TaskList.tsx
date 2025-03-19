import { useState } from 'react';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import { Typography, Input, Button, Flex, message as antdMessage, Select } from 'antd';
import { DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import {
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useGetTasksQuery,
  useUpdateTaskMutation,
  useUpdateTaskStatusMutation
} from '../store/tasksApi';
import Filter from '../components/Filter';
import CreateEditForm from './CreateEditForm';
import { Task } from '../types';

const TaskList = () => {
  const [message, contextHolder] = antdMessage.useMessage();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [searchText, setSearchText] = useState<string>('');
  const [filters, setFilters] = useState<{ status: string; deadline: string}>({
    status: '',
    deadline: '',
  });
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const { data, isLoading, isFetching, refetch } = useGetTasksQuery({
    page: currentPage,
    limit: pageSize,
    search: searchText,
    status: filters.status,
    deadline: filters.deadline,
  });

  const handleSearch = (value: string) => {
    setSearchText(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters: { status: string; deadline: string}) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const [deleteTask] = useDeleteTaskMutation();
  const [createTask] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();

  const handleDelete = async (id: number) => {
    try {
      await deleteTask(id).unwrap();
      message.success('Задача успешно удалена');
      refetch();
    } catch (error) {
      console.log(error);
      message.error('Ошибка при удалении задачи');
    }
  };

  const handleCreateTask = () => {
    setSelectedTask(null);
    setIsFormModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsFormModalOpen(true);
  };

  const [updateTaskStatus] = useUpdateTaskStatusMutation();

  const handleSubmitTask = async (values: Task) => {
    try {
      if (selectedTask) {
        await updateTask({ id: selectedTask.id, values}).unwrap();
        message.success('Задача успешно обновлена');
      } else {
        await createTask(values).unwrap();
        message.success('Задача успешно создана');
      }
      setIsFormModalOpen(false);
      refetch();
    } catch (error) {
      console.error('Error submitting task:', error);
      message.error('Ошибка при сохранении задачи');
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await updateTaskStatus({ id, status }).unwrap();
      message.success('Статус задачи успешно обновлен');
      refetch();
    } catch (error) {
      console.error('Error updating task status:', error);
      message.error('Ошибка при обновлении статуса задачи');
    }
  };

  const columns: ProColumns<Task>[] = [
    {
      title: 'Название',
      dataIndex: 'title',
      key: 'title',
      width: 200,
      sorter: false,
    },
    {
      title: 'Описание',
      dataIndex: 'description',
      key: 'description',
      width: 300,
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (_, task) => (
        <Select
          value={task.status}
          style={{ width: 120 }}
          onChange={value => handleStatusChange(task.id, value)}
        >
          <Select.Option value="new">Новая</Select.Option>
          <Select.Option value="in_progress">В процессее</Select.Option>
          <Select.Option value="completed">Завершена</Select.Option>
        </Select>
      ),
    },
    {
      title: 'Дедлайн',
      dataIndex: 'deadline',
      key: 'deadline',
      width: 150,
      render: (_, { deadline }) => new Date(deadline).toLocaleDateString(),
    },
    {
      title: '',
      dataIndex: 'actions',
      key: 'actions',
      width: 140,
      render: (_, task) => (
        <Flex gap={10}>
        <Button
          icon={<DeleteOutlined />}
          type="primary"
          danger
          onClick={(() => handleDelete(task.id))}
        />
        <Button
          icon={<EditOutlined/>}
          type="primary"
          ghost
          onClick={() => handleEditTask(task)}
        />
        </Flex>
      ),
    },
  ];

  const toolbar = {
    style: {
      padding: '0 12px',
    },
    title: (
      <Flex gap="middle" align='center' wrap>
        <Flex gap="middle">
          <Typography.Title level={3} style={{ margin: 0 }}>
            Список задач
          </Typography.Title>
          <Button type="primary" size="large" onClick={handleCreateTask} style={{ width: 160 }}>
            Создать задачу
          </Button>
        </Flex>

        <Filter onFilterChange={handleFilterChange} />
      </Flex>
    ),
    search: (
      <Flex align="center" gap="middle">
        <Typography.Text strong>Поиск:</Typography.Text>
        <Input.Search
          placeholder="Найти задачу"
          allowClear
          size="large"
          style={{ width: 300 }}
          onSearch={handleSearch}
          enterButton={<SearchOutlined />}
        />
      </Flex>
    )
  };

  return (
    <>
      {contextHolder}
      <CreateEditForm
        open={isFormModalOpen}
        onCancel={() => setIsFormModalOpen(false)}
        onSubmit={handleSubmitTask}
        initialValues={selectedTask}
      />
      <ProTable
        columns={columns}
        dataSource={data?.tasks}
        rowKey="id"
        size="large"
        search={false}
        options={false}
        cardProps={{
          bodyStyle: {
            padding: 0,
          }
        }}
        scroll={{
          y: 'calc(100vh - 310px)',
        }}
        sticky={{
          offsetHeader: 0,
          offsetScroll: 0,
        }}
        toolbar={toolbar}
        pagination={{
          total: data?.total,
          pageSize,
          current: currentPage,
          onChange: page => setCurrentPage(page),
          onShowSizeChange: (_, size) => {
            setPageSize(size);
            setCurrentPage(1);
          },
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '30'],
          position: ['bottomCenter'],
        }}
        loading={isLoading || isFetching}
      />
    </>
  );
};

export default TaskList;