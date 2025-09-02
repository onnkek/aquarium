import { CardBase } from '../CardBase';
import cls from './ServerCard.module.sass';
import { classNames, Mods } from "shared/lib/classNames";
import { ReactComponent as ChipIcon } from 'shared/assets/icons/aquarium/chip.svg';
import { ReactComponent as SDIcon } from 'shared/assets/icons/aquarium/sd.svg';
import { ReactComponent as RAMIcon } from 'shared/assets/icons/aquarium/ram.svg';
import { ReactComponent as UptimeIcon } from 'shared/assets/icons/aquarium/arrow-up.svg';
import { Progress } from 'shared/ui/Progress';
import { SystemCardType } from 'entities/card/model/types';
import { getUptime } from 'shared/lib/period';

interface ServerCardProps {
  className?: string;
  card: SystemCardType;
  onToggle: () => void;
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
    <CardBase cardId={card.id}>
      <div className={classNames(cls.serverCard, mods, [className])} onClick={onToggle}>

        <div className={cls.body}>


          {<ChipIcon className={cls.icon} />}
          <div className={cls.right}>
            <h2 className={cls.name}>{card.config.name}</h2>
            <p className={cls.status}>{card.current.chipTemp} °C</p>
          </div>
        </div>

        <span className={cls.blur}></span>
        <div className={cls.mode}>
          {<UptimeIcon className={cls.modeIcon} />}
          <p>{getUptime(card.current.uptime, false)}</p>
        </div>
        <div className={cls.mode}>
          <SDIcon className={cls.modeIcon} />
          {/* <p>{(card.current.usedSpace / 1024 / 1024).toFixed(0)}/{(card.current.freeSpace / 1024 / 1024 / 1024).toFixed(0)} MB</p> */}
          <Progress className={cls.progress} text="none" value={card.current.usedSpace / card.current.totalSpace * 100} />
        </div>
        <div className={cls.mode}>
          <RAMIcon className={cls.modeIcon} />
          {/* <p>{((card.current.heapSize - card.current.freeHeap) / 1024).toFixed(0)}/{(card.current.heapSize / 1024).toFixed(0)} KB</p> */}
          <Progress className={cls.progress} text="none" value={(card.current.heapSize - card.current.freeHeap) / card.current.heapSize * 100} />
        </div>
      </div>
    </CardBase>
  );
}