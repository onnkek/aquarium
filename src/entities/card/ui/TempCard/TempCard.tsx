import { RelayCardType, TempCardType } from 'entities/card/model/types';
import { CardBase } from '../CardBase';
import cls from './TempCard.module.sass';
import { classNames, Mods } from "shared/lib/classNames";
import { ReactComponent as TempIcon } from 'shared/assets/icons/aquarium/temp.svg';
import { ReactComponent as CoolIcon } from 'shared/assets/icons/fan.svg';
import { ReactComponent as HeatIcon } from 'shared/assets/icons/heat.svg';
import { ReactComponent as ManualIcon } from 'shared/assets/icons/aquarium/hand.svg'
import { ReactComponent as ScheduleIcon } from 'shared/assets/icons/aquarium/lightning.svg'

interface TempCardProps {
  className?: string;
  card: TempCardType;
  onToggle: () => void;
}

export const TempCard = ({
  className,
  card,
  onToggle
}: TempCardProps) => {


  const mods: Mods = {
    [cls.on]: card.current.status !== 0
  }

  return (
    <CardBase cardId={card.id}>
      <div className={classNames(cls.tempCard, mods, [className])} onClick={onToggle}>
        <div className={cls.body}>
          <div className={cls.statusIcons}>
            {(card.current.status === 1 || card.current.status === 3) && <CoolIcon className={classNames(cls.cool, { [cls.cool_animation]: true }, [])} />}
            {(card.current.status === 2 || card.current.status === 3) && <HeatIcon className={classNames(cls.heat, { [cls.heat_animation]: true }, [])} />}
            {card.current.status === 0 && <TempIcon className={cls.icon} />}
          </div>
          <div className={cls.right}>
            <h2 className={cls.name}>{card.config.name}</h2>
            <p className={cls.status}>{card.current.current.toFixed(2)} °C</p>
          </div>
        </div>

        <span className={cls.blur}></span>

        <div className={cls.mode}>
          {card.config.mode !== 4 ? <ManualIcon /> : <ScheduleIcon />}

          <p>{card.config.mode !== 4 ? "Manual" : "PID"}</p>
        </div>
      </div>
    </CardBase>
  );
}