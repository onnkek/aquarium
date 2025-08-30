
import { Navbar } from 'widgets/Navbar';
import { classNames } from 'shared/lib/classNames';
import { Suspense, useEffect, useRef, useState } from 'react';
import { AppRouter } from './providers/router';
import { useTheme } from './providers/ThemeProvider/lib/useTheme';
import { useAppSelector } from 'models/Hook';

function isIOS() {
  return ("ontouchend" in document)
}

export function useScrollableRef<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handler = (e: TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      if (el.contains(target)) {
        // Можно ли скроллить внутри?
        const canScrollDown = el.scrollTop + el.clientHeight < el.scrollHeight;
        const canScrollUp = el.scrollTop > 0;

        if (canScrollDown || canScrollUp) {
          return; // разрешаем
        }
      }

      e.preventDefault(); // иначе запрещаем
    };

    document.body.addEventListener("touchmove", handler, { passive: false });
    return () => {
      document.body.removeEventListener("touchmove", handler);
    };
  }, []);

  return ref;
}

export function useAbsoluteFooter(footerHeight: number) {
  const [top, setTop] = useState(0)
  console.log(navigator.userAgent)
  useEffect(() => {
    function update() {
      setTop(window.innerHeight - footerHeight);
    }
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", update);
      window.visualViewport.addEventListener("orientationchange", update);
    }

    update();

    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", update);
        window.visualViewport.removeEventListener("orientationchange", update);
      }
    }
  }, [footerHeight]);

  return top
}


function App() {
  const { theme } = useTheme();
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const openModal = useAppSelector(state => state.aquarium.modal)
  // const top = useAbsoluteFooter(80);
  // const scrollRef = useScrollableRef<HTMLDivElement>();
  return (
    <div className={classNames('app', {}, [theme])}>
      <Suspense fallback="">
        <div className='navbar'>
          {/* {!openModal &&  */}
          <Navbar
            // style={{ top: isIOS() ? top : 0 }}
            className='test-footer'
          />
           {/* } */}
        </div>
        <div className='container'>
          <AppRouter />
        </div>
      </Suspense>
    </div>
  )
}

export default App;
