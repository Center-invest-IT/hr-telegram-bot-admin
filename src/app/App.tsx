import type { JSX } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AddBot from '../pages/AddBotPage/index.tsx';
import BotPage from '../pages/BotPage/index.tsx';
import HomePage from '../pages/HomePage/index.tsx';
import LoginPage from '../pages/LoginPage/index.tsx';
import { useIsAuth } from '../shared/store/use-auth-store.ts';
import { Layout } from './Layout.tsx';
import AddUser from '../pages/AddUser/index.tsx';

// Компонент для защищённых маршрутов
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = useIsAuth(); // Здесь ваша логика проверки авторизации

  // Если пользователь НЕ вошёл в систему
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const GuestRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = useIsAuth();

  // Если пользователь УЖЕ вошёл в систему
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          path="/"
          element={(
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          )}
        />
        <Route
          path="/add-bot"
          element={(
            <PrivateRoute>
              <AddBot />
            </PrivateRoute>
          )}
        />
        <Route
          path="/add-user"
          element={(
            <PrivateRoute>
              <AddUser/>
            </PrivateRoute>
          )}
        />
        <Route
          path="/bots/:id"
          element={(
            <PrivateRoute>
              <BotPage />
            </PrivateRoute>
          )}
        />
      </Route>

      <Route
        path="/login"
        element={(
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        )}
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
