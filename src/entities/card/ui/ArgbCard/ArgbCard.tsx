import { ArgbCardType } from 'entities/card/model/types';
import { CardBase } from '../CardBase';
import cls from './ArgbCard.module.sass';
import { classNames, Mods } from "shared/lib/classNames";
import { ReactComponent as ARGBIcon } from 'shared/assets/icons/aquarium/argb.svg';
import { ReactComponent as ManualIcon } from 'shared/assets/icons/aquarium/hand.svg'
import { ReactComponent as ScheduleIcon } from 'shared/assets/icons/aquarium/arrow-up.svg'
import { getStringARGBMode } from 'shared/lib/period';
import { Badge } from 'shared/ui/Badge';

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
          {/* <div className={cls.deviceName}><h4>Backlight</h4><p>Visual effect system</p></div> */}
          <div className={cls.chips}>
            <Badge theme='outline' color='black'>STATIC</Badge>
            {/* <Badge theme='outline' color='blue-light'>GRADIENT</Badge>
            <Badge theme='outline' color='warning'>CYCLE</Badge>
            <Badge theme='outline' color='gray'>CUSTOM</Badge> */}
            <div className={cls.state}>
              <Badge theme='outline' color='success'>ON</Badge>
              <Badge theme='outline' color='success'>AUTO</Badge>
            </div>
          </div>
        </div>
        {/* <div className={cls.deviceTop}>
          <div className={cls.deviceName}><h4>Style</h4><p>Current profile</p></div>
          <div className={cls.chips}>
            <Badge theme='outline' color='black'>STATIC</Badge>
            <Badge theme='outline' color='blue-light'>GRADIENT</Badge>
            <Badge theme='outline' color='warning'>CYCLE</Badge>
            <Badge theme='outline' color='gray'>CUSTOM</Badge>
          </div>
        </div> */}
      </div>
      {/* <div className={classNames(cls.argbCard, mods, [className])} onClick={onToggle}>
        <div className={cls.body}>
          <ARGBIcon className={cls.icon} />

          <div className={cls.right}>
            <h2 className={cls.name}>{card.config.name}</h2>
            <p className={cls.status}>{card.current.status ? getStringARGBMode(card.config.mode) : "Off"}</p>
          </div>
        </div>

        <span className={cls.blur}></span>

        <div className={cls.mode}>
          {card.config.mode === 0 ? <ManualIcon /> : <ScheduleIcon />}

          <p>{card.config.mode === 0 ? "Manual" : `${card.config.on} - ${card.config.off}`}</p>
        </div>
      </div> */}
    </CardBase>
  );
}