import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import { store } from './store';

import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ConfigProvider locale={ruRU}>
        <App />
      </ConfigProvider>
    </Provider>
  </StrictMode>,
);
