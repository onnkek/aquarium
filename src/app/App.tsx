
import { Navbar } from 'widgets/Navbar';
import { classNames } from 'shared/lib/classNames';
import { Suspense, useEffect, useRef, useState } from 'react';
import { AppRouter } from './providers/router';
import { useTheme } from './providers/ThemeProvider/lib/useTheme';
import { useAppSelector } from 'models/Hook';
import { Input } from 'shared/ui/Input';

export function useAbsoluteFooter(footerHeight: number) {
  const [top, setTop] = useState(() => window.innerHeight - footerHeight)

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
  }, [footerHeight])
  return { top }
}


export function useAutoHideFooter() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY + 1) {
        setVisible(false);
      } else if (currentScrollY < lastScrollY - 1) {
        setVisible(true);
      }
      lastScrollY = currentScrollY;
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    }
  }, [])
  return visible;
}


function App() {
  const { theme } = useTheme();
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const openModal = useAppSelector(state => state.aquarium.modal)

  const { top } = useAbsoluteFooter(80);
  const footerVisible = useAutoHideFooter();


  return (
    <div className='test-app-auto'>
      <div className='test-content-auto'>
        {/* <AppRouter />
         <Navbar /> */}
        <Input type=''></Input>
        <div className='test-inner'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque quam totam tempore odit nemo numquam quas impedit eius dolorem libero hic enim dolore ea saepe, laborum optio id minus soluta!<br /><br /></div>
        <div className='test-inner'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque quam totam tempore odit nemo numquam quas impedit eius dolorem libero hic enim dolore ea saepe, laborum optio id minus soluta!<br /><br /></div>
        <div className='test-inner'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque quam totam tempore odit nemo numquam quas impedit eius dolorem libero hic enim dolore ea saepe, laborum optio id minus soluta!<br /><br /></div>
        <div className='test-inner'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque quam totam tempore odit nemo numquam quas impedit eius dolorem libero hic enim dolore ea saepe, laborum optio id minus soluta!<br /><br /></div>
        <div className='test-inner'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque quam totam tempore odit nemo numquam quas impedit eius dolorem libero hic enim dolore ea saepe, laborum optio id minus soluta!<br /><br /></div>
        <div className='test-inner'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque quam totam tempore odit nemo numquam quas impedit eius dolorem libero hic enim dolore ea saepe, laborum optio id minus soluta!<br /><br /></div>
        <div className='test-inner'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque quam totam tempore odit nemo numquam quas impedit eius dolorem libero hic enim dolore ea saepe, laborum optio id minus soluta!<br /><br /></div>
        <div className='test-inner'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque quam totam tempore odit nemo numquam quas impedit eius dolorem libero hic enim dolore ea saepe, laborum optio id minus soluta!<br /><br /></div>
        <div className='test-inner'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque quam totam tempore odit nemo numquam quas impedit eius dolorem libero hic enim dolore ea saepe, laborum optio id minus soluta!<br /><br /></div>
        <div className='test-inner'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque quam totam tempore odit nemo numquam quas impedit eius dolorem libero hic enim dolore ea saepe, laborum optio id minus soluta!<br /><br /></div>
        <div className='test-inner'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque quam totam tempore odit nemo numquam quas impedit eius dolorem libero hic enim dolore ea saepe, laborum optio id minus soluta!<br /><br /></div>
        <div className='test-inner'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque quam totam tempore odit nemo numquam quas impedit eius dolorem libero hic enim dolore ea saepe, laborum optio id minus soluta!<br /><br /></div>
      </div>
      <div className='test-footer-auto' style={{ transform: footerVisible ? "translateY(0)" : "translateY(100%)" }}></div>
    </div>
    // <div className='test-app'>
    //   <div className='test-content'>
    //     {/* <AppRouter />
    //     <Navbar /> */}
    //     <Input type=''></Input>
    //     <div className='test-inner'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque quam totam tempore odit nemo numquam quas impedit eius dolorem libero hic enim dolore ea saepe, laborum optio id minus soluta!<br /><br /></div>
    //     <div className='test-inner'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque quam totam tempore odit nemo numquam quas impedit eius dolorem libero hic enim dolore ea saepe, laborum optio id minus soluta!<br /><br /></div>
    //     <div className='test-inner'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque quam totam tempore odit nemo numquam quas impedit eius dolorem libero hic enim dolore ea saepe, laborum optio id minus soluta!<br /><br /></div>
    //     <div className='test-inner'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque quam totam tempore odit nemo numquam quas impedit eius dolorem libero hic enim dolore ea saepe, laborum optio id minus soluta!<br /><br /></div>
    //     <div className='test-inner'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque quam totam tempore odit nemo numquam quas impedit eius dolorem libero hic enim dolore ea saepe, laborum optio id minus soluta!<br /><br /></div>
    //     <div className='test-inner'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque quam totam tempore odit nemo numquam quas impedit eius dolorem libero hic enim dolore ea saepe, laborum optio id minus soluta!<br /><br /></div>
    //     <div className='test-inner'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque quam totam tempore odit nemo numquam quas impedit eius dolorem libero hic enim dolore ea saepe, laborum optio id minus soluta!<br /><br /></div>
    //     <div className='test-inner'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque quam totam tempore odit nemo numquam quas impedit eius dolorem libero hic enim dolore ea saepe, laborum optio id minus soluta!<br /><br /></div>
    //     <div className='test-inner'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque quam totam tempore odit nemo numquam quas impedit eius dolorem libero hic enim dolore ea saepe, laborum optio id minus soluta!<br /><br /></div>
    //     <div className='test-inner'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque quam totam tempore odit nemo numquam quas impedit eius dolorem libero hic enim dolore ea saepe, laborum optio id minus soluta!<br /><br /></div>
    //     <div className='test-inner'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque quam totam tempore odit nemo numquam quas impedit eius dolorem libero hic enim dolore ea saepe, laborum optio id minus soluta!<br /><br /></div>
    //     <div className='test-inner'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque quam totam tempore odit nemo numquam quas impedit eius dolorem libero hic enim dolore ea saepe, laborum optio id minus soluta!<br /><br /></div>
    //   </div>
    //   {/* <div className='footer-wrapper'> */}
    //   <div className='test-footer' style={{ top: top }}></div>
    //   {/* </div> */}
    //   {/* <div className='test-footer'></div> */}
    // </div>

    // <div className={classNames('app', {}, [theme])}>
    //   <Suspense fallback="">
    //     <Navbar />
    //     <div className='container'>
    //       <AppRouter />
    //     </div>
    //   </Suspense>
    // </div>
  )
}

export default App;
