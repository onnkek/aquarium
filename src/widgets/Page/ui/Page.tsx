import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { classNames } from "shared/lib/classNames";
import { Navbar } from "widgets/Navbar";
import cls from './Page.module.sass';

export interface PageProps {
  className?: string;
  children?: ReactNode;
}

export const Page = ({ className, children }: PageProps) => {
  const location = useLocation();
  return (
    <>
      <Navbar />
      <main className={classNames(cls.page, {}, [className])}>
        <header className={cls.topbar}>
          <div className={cls.crumbs}>
            <h2>{location.pathname === '/logs' ? "Logs" : "Dashboard"}</h2>
            <p>Central management for climate, pumps, lighting, and hardware</p>
          </div>
          <div className={cls.topright}>
            <div className={cls.clock} id="clock">Version: {__APP_VERSION__} © onnkek {new Date(Date.now()).getFullYear()}</div>
          </div>
        </header>
        {children}
      </main>
    </>
  );
};