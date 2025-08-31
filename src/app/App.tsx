import { classNames } from 'shared/lib/classNames';
import { Suspense } from 'react';
import { AppRouter } from './providers/router';
import { useTheme } from './providers/ThemeProvider/lib/useTheme';

function App() {
  const { theme } = useTheme();
  return (
    <div className={classNames('app', {}, [theme])}>
      <Suspense fallback="">
        <AppRouter />
      </Suspense>
    </div>
  )
}

export default App;
