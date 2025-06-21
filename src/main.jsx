import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { ContextProvider } from './contextProvider/ContextProvider';
import App from './App';
import './styles/globalStyles.css';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ContextProvider>
        <App />
      </ContextProvider>
    </Provider>
  </React.StrictMode>
);