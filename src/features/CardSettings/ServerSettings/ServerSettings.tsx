import { RelayCardType, SystemCardType, TempCardType } from 'entities/card/model/types';
import cls from './ServerSettings.module.sass';
import { classNames, Mods } from "shared/lib/classNames";
import { ReactComponent as TempIcon } from 'shared/assets/icons/aquarium/temp.svg';
import { ReactComponent as CoolIcon } from 'shared/assets/icons/fan.svg';
import { ReactComponent as HeatIcon } from 'shared/assets/icons/heat.svg';
import { ReactComponent as ManualIcon } from 'shared/assets/icons/aquarium/hand.svg'
import { ReactComponent as ScheduleIcon } from 'shared/assets/icons/aquarium/lightning.svg'
import { SettingsWrapper } from '../SettingsWrapper';

interface ServerSettingsProps {
  className?: string;
  open: boolean;
  onClose: () => void; 
  card: SystemCardType;
}

export const ServerSettings = ({
  className,
  open,
  onClose,
  card
}: ServerSettingsProps) => {

  const onSendConfig = async () => {

    onClose();
  }

  const mods: Mods = {
    // [cls.on]: card.current.status !== 0
  }

  return (
    <SettingsWrapper open={open} onClose={onClose} card={card} onCofirm={onSendConfig}>
      <div className={classNames(cls.serverSettings, mods, [className])}>

      </div>
    </SettingsWrapper>
  );
}