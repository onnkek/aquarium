import { ArgbCardType } from 'entities/card/model/types';
import { CardBase } from '../CardBase';
import cls from './ArgbCard.module.sass';
import { classNames, Mods } from "shared/lib/classNames";
import { ReactComponent as ARGBIcon } from 'shared/assets/icons/aquarium/argb.svg';
import { ReactComponent as ManualIcon } from 'shared/assets/icons/aquarium/hand.svg'
import { ReactComponent as ScheduleIcon } from 'shared/assets/icons/aquarium/arrow-up.svg'
import { getStringARGBMode } from 'shared/lib/period';

interface ArgbCardProps {
  className?: string;
  card: ArgbCardType;
  onToggle: () => void;
}

export const ArgbCard = ({
  className,
  card,
  onToggle
}: ArgbCardProps) => {


  const mods: Mods = {
    [cls.on]: card.current.status !== 0
  }


  return (
    <CardBase cardId={card.id}>
      <div className={classNames(cls.argbCard, mods, [className])} onClick={onToggle}>
        <div className={cls.body}>
          <ARGBIcon className={cls.icon} />

          <div className={cls.right}>
            <h2 className={cls.name}>{card.config.name}</h2>
            <p className={cls.status}>{getStringARGBMode(card.config.mode)}</p>
          </div>
        </div>

        <span className={cls.blur}></span>

        <div className={cls.mode}>
          {card.config.mode === 0 ? <ManualIcon /> : <ScheduleIcon />}

          <p>{card.config.mode === 0 ? "Manual" : `${card.config.on} - ${card.config.off}`}</p>
        </div>
      </div>
    </CardBase>
  );
}