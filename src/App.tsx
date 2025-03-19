import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Tasks from './pages/Tasks';
import Auth from './pages/Auth';
import './index.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  // Эффект для отслеживания изменений в localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
    };

    // Слушаем изменения в localStorage
    window.addEventListener('storage', handleStorageChange);

    // Очистка слушателя при размонтировании компонента
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated
              ? <Tasks setIsAuthenticated={setIsAuthenticated} />
              : <Navigate to="/auth" replace /> // Перенаправляем на /auth, если пользователь не авторизован
          }
        />
        <Route
          path="/auth"
          element={
            !isAuthenticated
              ? <Auth setIsAuthenticated={setIsAuthenticated} />
              : <Navigate to="/" replace />
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;