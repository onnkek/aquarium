import { PumpCardType } from 'entities/card/model/types';
import cls from './PumpCard.module.sass';
import { classNames, Mods } from "shared/lib/classNames";
import { ReactComponent as PumpIcon } from 'shared/assets/icons/aquarium/pump.svg'
import { ReactComponent as BottleIcon } from 'shared/assets/icons/aquarium/bottle.svg'
import { ReactComponent as DropIcon } from 'shared/assets/icons/aquarium/drop.svg'
import { ReactComponent as ManualIcon } from 'shared/assets/icons/aquarium/hand.svg'
import { ReactComponent as ScheduleIcon } from 'shared/assets/icons/aquarium/arrow-up.svg'
import { Progress } from 'shared/ui/Progress';
import { CardBase } from '../CardBase';

interface PumpCardProps {
  className?: string;
  card: PumpCardType
}

export const PumpCard = ({
  className,
  card
}: PumpCardProps) => {

  const mods: Mods = {
    [cls.on]: card.current.status
  }

  return (
    <CardBase>
      <div className={classNames(cls.pumpCard, mods, [className])}>
        <div className={cls.body}>


          {<PumpIcon className={cls.icon} />}
          <div className={cls.right}>
            <h2 className={cls.name}>{card.config.name}</h2>
            <p className={cls.status}>{card.current.status ? "On" : "Off"}</p>
          </div>
        </div>

        <span className={cls.blur}></span>

        <div className={cls.mode}>
          {card.config.mode !== 2 ? <ManualIcon /> : <ScheduleIcon />}
          <p>{card.config.mode !== 2 ? "Manual" : `${card.config.time}`}</p>
        </div>
        <div className={cls.mode}>
          <DropIcon className={cls.modeIcon} />
          <p>{(card.current.introduced / 100 * card.config.dosage).toFixed(0)}/{card.config.dosage.toFixed(0)} ml</p>
          <Progress className={cls.progress_dose} text="none" value={card.current.introduced} />
        </div>
        <div className={cls.mode}>
          <BottleIcon className={cls.modeIcon} />
          <p>{(card.config.currentVolume / card.config.dosage).toFixed(0)} days</p>
          <Progress className={cls.progress} text="none" value={card.config.currentVolume / card.config.maxVolume * 100} />
        </div>
      </div>
    </CardBase>
  );
}