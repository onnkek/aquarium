import { SystemCardType } from 'entities/card/model/types';
import { ReactComponent as ChipIcon } from 'shared/assets/icons/aquarium/chip.svg';
import { classNames, Mods } from "shared/lib/classNames";
import { CardBase } from '../CardBase';
import cls from './ServerCard.module.sass';
import { MouseEvent } from 'react';

interface ServerCardProps {
  className?: string;
  card: SystemCardType;
  onToggle: (e: MouseEvent<HTMLDivElement>) => void;
}

export const ServerCard = ({
  className,
  card,
  onToggle
}: ServerCardProps) => {


  const mods: Mods = {
    // [cls.on]: card.current.status !== 0
  }
 
  return (
    <CardBase 
    cardId={card.id} 
    className={classNames(cls.serverCard + " " + cls.span6, {}, [className])} 
    onToggle={onToggle} 
    header={"Server"} 
    badge={"Hardware"}
    icon={<ChipIcon className={cls.icon} />}
    >
      <div className={cls.section + " " + cls.device}>
        <div className={cls.pair}>
          <div className={cls.metric}><span>Chip Temp</span><strong>{card.current.chipTemp} °C</strong></div>
          <div className={cls.metric}><span>Fan Speed</span><strong>{card.current.fan} RPM</strong></div>
        </div>
        <div className={cls.pair}>
          <div className={cls.metric}><span>SD Usage</span><strong>{(card.current.usedSpace / 1024 / 1024).toFixed(2)} MB / {(card.current.totalSpace / 1024 / 1024 / 1024).toFixed(2)} GB</strong></div>
          <div className={cls.metric}><span>RAM</span><strong>{((card.current.heapSize - card.current.freeHeap) / 1024).toFixed(2)} / {(card.current.heapSize / 1024).toFixed(2)} KB</strong></div>
        </div>
      </div>

    </CardBase>
  );
}