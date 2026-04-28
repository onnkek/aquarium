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
}

export const SystemCard = ({
  className,
  card,
  onToggle
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
      icon={<SystemIcon className={cls.icon} />}
    >
      <div className={cls.section + " " + cls.device}>
        <div className={cls.pair}>
          <div className={cls.metric}><span>Date</span><strong id="date">2026-04-27</strong></div>
          <div className={cls.metric}><span>Time</span><strong id="time">08:31:00</strong></div>
        </div>
        <div className={cls.pair}>
          <div className={cls.metric}><span>Temperature</span><strong>24.6 °C</strong></div>
          <div className={cls.metric}><span>Humidity</span><strong>51 %</strong></div>
        </div>
      </div>
      {/* <div className={classNames(cls.systemCard, mods, [className])} onClick={onToggle}>

        <div className={cls.body}>
          <div className={cls.header}>
            <h2 className={cls.date}>{getDateString(card.current.time)}</h2>
            <p className={cls.time}>{getTimeString(card.current.time)}</p>
          </div>
          <div className={cls.temp}>
            <div className={cls.tempItem}>
              <TempIcon />
              <p className={cls.text}>{card.current.outside.temp.toFixed(2)} ℃</p>
            </div>
            <div className={cls.tempItem}>
              <HumidityIcon />
              <p className={cls.text}>{card.current.outside.hum.toFixed(2)} %</p>
            </div>
            <div className={cls.tempItem}>
              <UpdateIcon />
              <p className={cls.text}>{card.config.update} sec</p>
            </div>

          </div>
        </div>
      </div> */}
    </CardBase>
  );
}