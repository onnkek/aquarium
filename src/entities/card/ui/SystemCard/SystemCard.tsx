import { SystemCardType } from 'entities/card/model/types';
import { ReactComponent as SystemIcon } from 'shared/assets/icons/gear.svg';
import { classNames, Mods } from "shared/lib/classNames";
import { getDateString, getTimeString } from 'shared/lib/period';
import { CardBase } from '../CardBase';
import cls from './SystemCard.module.sass';

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