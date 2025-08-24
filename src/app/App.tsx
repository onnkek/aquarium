
import { Navbar } from 'widgets/Navbar';
import { classNames } from 'shared/lib/classNames';
import { Suspense, useEffect, useRef, useState } from 'react';
import { AppRouter } from './providers/router';
import { useTheme } from './providers/ThemeProvider/lib/useTheme';
import { useAppSelector } from 'models/Hook';




function App() {
  const { theme } = useTheme();
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const openModal = useAppSelector(state => state.aquarium.modal)


  return (
    <div className={classNames('app', {}, [theme])}>
      <Suspense fallback="">
        <Navbar />
        <div className='container'>
          <AppRouter />
        </div>
      </Suspense>
    </div>
  )
}

export default App;
