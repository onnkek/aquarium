import { classNames, Mods } from "shared/lib/classNames";
import cls from './Navbar.module.sass';
import { ReactComponent as Logo } from 'shared/assets/logo.svg';
import { ReactComponent as LogsIcon } from 'shared/assets/icons/aquarium/journal.svg';
import { ReactComponent as ArchiveIcon } from 'shared/assets/icons/aquarium/archive.svg';
import { ReactComponent as DashboardIcon } from 'shared/assets/icons/aquarium/dashboard.svg';
import { Link, useLocation } from "react-router-dom";
import { AppRoutes, RoutePath } from "shared/config/routeConfig/routeConfig";
import { CSSProperties, LegacyRef, useEffect, useState } from "react";
import { ButtonGroup } from "shared/ui/ButtonGroup";
import { Button } from "@headlessui/react";

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
    <nav className={classNames(cls.header, {}, [className])} style={style}>
      {/* <Logo className={cls.logo} /> */}
      {/* <h1 className={cls.title}>Aquarium</h1> */}
      <ButtonGroup className={cls.group}>
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
      </ButtonGroup>
    </nav>
  );
};