import App from 'app/App';
import ThemeProvider from 'app/providers/ThemeProvider/ui/ThemeProvider';
import { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import './app/styles/index.sass';
import store from './redux/store';


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
