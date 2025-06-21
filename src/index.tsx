import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.sass';
import App from './App';
import ThemeProvider from 'helpers/ThemeProvider/ui/ThemeProvider';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
