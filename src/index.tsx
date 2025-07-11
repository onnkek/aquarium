import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.sass';
import App from './App';
import ThemeProvider from 'helpers/ThemeProvider/ui/ThemeProvider';
import { Provider } from 'react-redux';
import store from './redux/store';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Provider store={store}>
    <React.StrictMode>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </React.StrictMode>
  </Provider>
);
