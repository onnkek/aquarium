import { PumpCardType } from 'entities/card/model/types';
import { SettingsWrapper } from '../SettingsWrapper';
import cls from './PumpSettings.module.sass';
import { classNames } from "shared/lib/classNames";

interface PumpSettingsProps {
  className?: string;
  open: boolean;
  onClose: () => void;
  card: PumpCardType;
}

export const PumpSettings = ({
  className,
  open,
  onClose,
  card
}: PumpSettingsProps) => {
  return (
    <SettingsWrapper open={open} onClose={onClose} card={card}>
      <div className={classNames(cls.pumpSettings, {}, [className])}>
        Pump Settings
      </div>
    </SettingsWrapper>
  );
}