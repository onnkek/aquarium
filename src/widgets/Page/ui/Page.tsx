import { classNames } from "shared/lib/classNames";
import cls from './Page.module.sass';
import { ReactNode } from "react";
import { Navbar } from "widgets/Navbar";
import { useLocation } from "react-router-dom";

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
            <div className={cls.search}>Search devices...</div>
            <div className={cls.clock} id="clock">2026-04-27 08:31:00</div>
          </div>
        </header>
        {children}
      </main>
    </>
  );
};