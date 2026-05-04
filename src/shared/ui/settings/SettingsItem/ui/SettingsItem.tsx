import { ReactNode } from 'react';
import { classNames } from "shared/lib/classNames";
import cls from './SettingsItem.module.sass';

interface SettingsItemProps {
  className?: string;
  label?: string;
  icon?: ReactNode;
  control: ReactNode;
}

export const SettingsItem = ({
  className,
  label,
  icon,
  control
}: SettingsItemProps) => {
  return (
    <div className={classNames(cls.settingsItem, {}, [className])}>
      <div className={cls.left}>
        {icon}
        <div className={cls.label}>{label}</div>
      </div>
      <div className={cls.right}>{control}</div>
    </div>
  );
}