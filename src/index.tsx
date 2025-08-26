import React, { useEffect } from 'react';
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
const RootComponent = () => {
  useEffect(() => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      preloader.style.display = 'none';
    }
  }, []);

  return <App />;
};
root.render(
  <BrowserRouter>
    <Provider store={store}>
      <ThemeProvider>
        <RootComponent />
      </ThemeProvider>
    </Provider>
  </BrowserRouter>
);
