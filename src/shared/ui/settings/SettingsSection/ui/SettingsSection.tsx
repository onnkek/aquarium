import { ReactNode } from 'react';
import cls from './SettingsSection.module.sass';
import { classNames } from "shared/lib/classNames";

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