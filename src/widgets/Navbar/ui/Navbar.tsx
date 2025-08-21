import { classNames } from "shared/lib/classNames";
import cls from './Navbar.module.sass';
import { ReactComponent as Logo } from 'shared/assets/logo.svg';
import { ReactComponent as LogsIcon } from 'shared/assets/icons/aquarium/journal.svg';
import { ReactComponent as ArchiveIcon } from 'shared/assets/icons/aquarium/archive.svg';
import { ReactComponent as DashboardIcon } from 'shared/assets/icons/aquarium/dashboard.svg';
import { Link } from "react-router-dom";
import { RoutePath } from "shared/config/routeConfig/routeConfig";

interface NavbarProps {
  className?: string;
}

export const Navbar = ({ className }: NavbarProps) => {

  return (
    <header className={classNames(cls.navbar, {}, [className])}>
      <div className={cls.header}>
        <Logo className={cls.logo} />
        <h1 className={cls.title}>Aquarium</h1>
        <Link to={RoutePath.dashboard} className={cls.link}>
          <DashboardIcon className={cls.header_icon} />
          <div className={cls.header_button_text}>Dashboard</div>
        </Link>
        <Link to={RoutePath.logs} className={cls.link}>
          <LogsIcon className={cls.header_icon} />
          <div className={cls.header_button_text}>Logs</div>
        </Link>
        <Link to={RoutePath.archive} className={cls.link}>
          <ArchiveIcon className='header_icon' />
          <div className={cls.header_button_text}>Archive</div>
        </Link>
      </div>
    </header>
  );
};