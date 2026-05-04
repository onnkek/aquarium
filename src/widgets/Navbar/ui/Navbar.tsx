import { CSSProperties, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ReactComponent as DashboardIcon } from 'shared/assets/icons/aquarium/dashboard.svg';
import { ReactComponent as LogsIcon } from 'shared/assets/icons/aquarium/journal.svg';
import { ReactComponent as LogoIcon } from 'shared/assets/icons/aquarium/logo.svg';
import { RoutePath } from "shared/config/routeConfig/routeConfig";
import { classNames } from "shared/lib/classNames";
import cls from './Navbar.module.sass';

interface NavbarProps {
  className?: string;
  style?: CSSProperties
}

export const Navbar = ({ className, style }: NavbarProps) => {
  const location = useLocation();
  const [active, setActive] = useState("/")


  useEffect(() => {
    setActive(location.pathname);
  }, [location.pathname])

  const isActive = (route: string) => {
    return active === route ? cls.active : ""
  }

  return (
    <aside className={cls.sidebar}>
      <div className={cls.brand}>
        <div className={cls.logo}>
          <LogoIcon />
        </div>
        <div>
          <h1>Aquarium</h1>
          <p>Control Center</p>
        </div>
      </div>

      <nav className={cls.nav}>
        <Link
          to={RoutePath.dashboard}
          className={classNames(cls.link, {}, [isActive(RoutePath.dashboard)])}
        >
          <DashboardIcon className={cls.header_icon} />
          <div className={cls.header_button_text}>Dashboard</div>
        </Link>
        <Link
          to={RoutePath.logs}
          className={classNames(cls.link, {}, [isActive(RoutePath.logs)])}
        >
          <LogsIcon className={cls.header_icon} />
          <div className={cls.header_button_text}>Logs</div>
        </Link>
      </nav>

      {/* <div className={cls.sidebox}>
        <span>Controller</span>
        <strong>Online</strong>
      </div>

      <div className={cls.sidebox}>
        <span>Last Update</span>
        <strong id="lastUpdate">2026-04-27 08:31:00</strong>
      </div> */}
    </aside>
  );
};