import { TempCardType } from 'entities/card/model/types';
import { SettingsWrapper } from '../SettingsWrapper';
import cls from './TempSettings.module.sass';
import { classNames } from "shared/lib/classNames";

interface TempSettingsProps {
  className?: string;
  open: boolean;
  onClose: () => void;
  card: TempCardType;
}

export const TempSettings = ({
  className,
  open,
  onClose,
  card
}: TempSettingsProps) => {
  return (
    <SettingsWrapper open={open} onClose={onClose} card={card}>
      <div className={classNames(cls.tempSettings, {}, [className])}>
        Temp Settings
      </div>
    </SettingsWrapper>
  );
}