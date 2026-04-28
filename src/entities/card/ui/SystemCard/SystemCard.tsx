import { RelayCardType, SystemCardType, TempCardType } from 'entities/card/model/types';
import { CardBase } from '../CardBase';
import cls from './SystemCard.module.sass';
import { classNames, Mods } from "shared/lib/classNames";
import { ReactComponent as ChipIcon } from 'shared/assets/icons/aquarium/chip.svg';
import { ReactComponent as SystemIcon } from 'shared/assets/icons/gear.svg';
import { ReactComponent as SDIcon } from 'shared/assets/icons/aquarium/sd.svg';
import { ReactComponent as RAMIcon } from 'shared/assets/icons/aquarium/ram.svg';
import { Progress } from 'shared/ui/Progress';
import { getDateString, getTimeString } from 'shared/lib/period';
import { ReactComponent as TempIcon } from 'shared/assets/icons/aquarium/temp2.svg';
import { ReactComponent as HumidityIcon } from 'shared/assets/icons/aquarium/humidity.svg';
import { ReactComponent as UpdateIcon } from 'shared/assets/icons/aquarium/arrow-clockwise.svg';

interface SystemCardProps {
  className?: string;
  card: SystemCardType;
  onToggle: () => void;
  indicationState: boolean;
}

export const SystemCard = ({
  className,
  card,
  onToggle,
  indicationState = false
}: SystemCardProps) => {


  const mods: Mods = {
    // [cls.on]: card.current.status !== 0
  }

  return (
    <CardBase
      cardId={card.id}
      className={classNames(cls.systemCard + " " + cls.span6, {}, [className])}
      onToggle={onToggle}
      header={"Environment overview"}
      // subheader={"Date, time, temperature and humidity"}
      badge={"Live"}
      indication
      indicationState={indicationState}
      icon={<SystemIcon className={cls.icon} />}
    >
      <div className={cls.section + " " + cls.device}>
        <div className={cls.pair}>
          <div className={cls.metric}><span>Date</span><strong id="date">{getDateString(card.current.time)}</strong></div>
          <div className={cls.metric}><span>Time</span><strong id="time">{getTimeString(card.current.time)}</strong></div>
        </div>
        <div className={cls.pair}>
          <div className={cls.metric}><span>Temperature</span><strong>{card.current.outside.temp.toFixed(2)} ℃</strong></div>
          <div className={cls.metric}><span>Humidity</span><strong>{card.current.outside.hum.toFixed(2)} %</strong></div>
        </div>
      </div>
    </CardBase>
  );
}