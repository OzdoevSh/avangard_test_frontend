import LogoutBar from '../components/LogoutBar';
import TaskList from '../components/TaskList';

interface TaskProps {
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

function Tasks({ setIsAuthenticated }: TaskProps) {
  return (
    <>
      <LogoutBar setIsAuthenticated={setIsAuthenticated} />
      <TaskList />
    </>
  );
}

export default Tasks;