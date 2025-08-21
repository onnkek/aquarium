import React from 'react';
import ReactDOM from 'react-dom/client';
import 'app/styles/index.sass';
import App from 'app/App';
import { Provider } from 'react-redux';
import store from './redux/store';
import { BrowserRouter } from 'react-router-dom';
import ThemeProvider from 'app/providers/ThemeProvider/ui/ThemeProvider';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <BrowserRouter>
    <Provider store={store}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Provider>
  </BrowserRouter>
);
