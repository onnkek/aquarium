import { ArgbCardType } from 'entities/card/model/types';
import { SettingsWrapper } from '../SettingsWrapper';
import cls from './ArgbSettings.module.sass';
import { classNames } from "shared/lib/classNames";

interface ArgbSettingsProps {
  className?: string;
  open: boolean;
  onClose: () => void;
  card: ArgbCardType;
}

export const ArgbSettings = ({
  className,
  open,
  onClose,
  card
}: ArgbSettingsProps) => {
  return (
    <SettingsWrapper open={open} onClose={onClose} card={card}>
      <div className={classNames(cls.argbSettings, {}, [className])}>
        ARGB Settings
      </div>
    </SettingsWrapper>
  );
}