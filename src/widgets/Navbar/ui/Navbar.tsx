import { classNames, Mods } from "shared/lib/classNames";
import cls from './Navbar.module.sass';
import { ReactComponent as Logo } from 'shared/assets/logo.svg';
import { ReactComponent as LogsIcon } from 'shared/assets/icons/aquarium/journal.svg';
import { ReactComponent as ArchiveIcon } from 'shared/assets/icons/aquarium/archive.svg';
import { ReactComponent as DashboardIcon } from 'shared/assets/icons/aquarium/dashboard.svg';
import { Link } from "react-router-dom";
import { AppRoutes, RoutePath } from "shared/config/routeConfig/routeConfig";
import { useState } from "react";

interface NavbarProps {
  className?: string;
}

export const Navbar = ({ className }: NavbarProps) => {

  const [active, setActive] = useState(RoutePath.dashboard)
  const isActive = (route: string) => {
    return active === route ? cls.active : ""
  }
  return (
    <header className={classNames(cls.navbar, {}, [className])}>
      <div className={cls.header}>
        <Logo className={cls.logo} />
        <h1 className={cls.title}>Aquarium</h1>
        <Link
          to={RoutePath.dashboard}
          className={classNames(cls.link, {}, [isActive(RoutePath.dashboard)])}
          onClick={() => setActive(RoutePath.dashboard)}
        >
          <DashboardIcon className={cls.header_icon} />
          <div className={cls.header_button_text}>Dashboard</div>
        </Link>
        <Link
          to={RoutePath.logs}
          className={classNames(cls.link, {}, [isActive(RoutePath.logs)])}
          onClick={() => setActive(RoutePath.logs)}
        >
          <LogsIcon className={cls.header_icon} />
          <div className={cls.header_button_text}>Logs</div>
        </Link>
        <Link
          to={RoutePath.archive}
          className={classNames(cls.link, {}, [isActive(RoutePath.archive)])}
          onClick={() => setActive(RoutePath.archive)}
        >
          <ArchiveIcon className='header_icon' />
          <div className={cls.header_button_text}>Archive</div>
        </Link>
      </div>
    </header>
  );
};