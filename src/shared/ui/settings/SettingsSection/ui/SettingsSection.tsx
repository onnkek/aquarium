import { ReactNode } from 'react';
import { classNames } from "shared/lib/classNames";
import cls from './SettingsSection.module.sass';

interface SettingsSectionProps {
  className?: string;
  children: ReactNode;
}

export const SettingsSection = ({
  className,
  children
}: SettingsSectionProps) => {
  return (
    <div className={classNames(cls.settingsSection, {}, [className])}>
      {children}
    </div>
  );
}