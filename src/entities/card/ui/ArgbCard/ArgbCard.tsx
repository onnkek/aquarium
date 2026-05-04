import { ArgbCardType } from 'entities/card/model/types';
import { ReactComponent as ARGBIcon } from 'shared/assets/icons/aquarium/argb.svg';
import { classNames, Mods } from "shared/lib/classNames";
import { Badge } from 'shared/ui/Badge';
import { CardBase } from '../CardBase';
import cls from './ArgbCard.module.sass';

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
    [cls.on]: card.current.status
  }


  return (
    <CardBase
      cardId={card.id}
      className={classNames(cls.argbCard + " " + cls.span6, {}, [className])}
      onToggle={onToggle}
      header={"Backlight"}
      badge={"ARGB"}
      icon={<ARGBIcon className={cls.icon} />}
    >
      <div className={cls.section + " " + cls.device}>
        <div className={cls.deviceTop}>
          <div className={cls.chips}>
            <div className={cls.state}>

              {card.config.style === 1 && <Badge theme='outline' color='black'>STATIC</Badge>}
              {card.config.style === 3 && <Badge theme='outline' color='blue-light'>GRADIENT</Badge>}
              {card.config.style === 2 && <Badge theme='outline' color='warning'>CYCLE</Badge>}
              {card.config.style === 4 && <Badge theme='outline' color='gray'>CUSTOM</Badge>}
            </div>

            <div className={cls.state}>
              {card.config.mode === 2 && <Badge theme='outline' color='gray'>{card.config.on}-{card.config.off}</Badge>}
              {card.current.status && <Badge theme='outline' color='success'>ON</Badge>}
              {!card.current.status && <Badge theme='outline' color='black'>OFF</Badge>}
              {card.config.mode === 2 && <Badge theme='outline' color='success'>AUTO</Badge>}
              {card.config.mode !== 2 && <Badge theme='outline' color='black'>MANUAL</Badge>}
            </div>
          </div>
        </div>
      </div>
    </CardBase>
  );
}