import { RelayCardType, TempCardType } from 'entities/card/model/types';
import { CardBase } from '../CardBase';
import cls from './TempCard.module.sass';
import { classNames, Mods } from "shared/lib/classNames";
import { ReactComponent as TempIcon } from 'shared/assets/icons/aquarium/temp.svg';
import { ReactComponent as CoolIcon } from 'shared/assets/icons/fan.svg';
import { ReactComponent as HeatIcon } from 'shared/assets/icons/heat.svg';
import { ReactComponent as ManualIcon } from 'shared/assets/icons/aquarium/hand.svg'
import { ReactComponent as ScheduleIcon } from 'shared/assets/icons/aquarium/lightning.svg'
import { Badge } from 'shared/ui/Badge';

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
    <CardBase
      cardId={card.id}
      className={classNames(cls.tempCard + " " + cls.span6, {}, [className])}
      onToggle={onToggle}
      header={card.config.name}
      badge={"Sensor"}
      icon={<TempIcon className={cls.icon} />}
    >
      <div className={cls.section + " " + cls.device}>
        <div className={cls.pair}>
          <div className={cls.metric}><span>Current Temp</span><strong>{card.current.current.toFixed(2)} °C</strong></div>
          <div className={cls.deviceTop}>
            <div className={cls.chips}>
              {(card.current.status === 1 || card.current.status === 3) && <Badge theme='outline' color='success'>COOLING</Badge>}
              {(card.current.status === 2 || card.current.status === 3) && <Badge theme='outline' color='success'>HEATING</Badge>}
              {card.current.status === 0 && <Badge theme='outline' color='black'>OFF</Badge>}
            </div>
            <div className={cls.chips}>
              {card.config.mode === 4 && <Badge theme='outline' color='success'>AUTO</Badge>}
              {card.config.mode !== 4 && <Badge theme='outline' color='black'>MANUAL</Badge>}
            </div>
          </div>
        </div>

      </div>
    </CardBase>
  );
}