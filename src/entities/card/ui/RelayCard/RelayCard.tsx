import { ICard, RelayCardType, RelaySubtype } from 'entities/card/model/types';
import { CardBase } from '../CardBase';
import cls from './RelayCard.module.sass';
import { classNames, Mods } from "shared/lib/classNames";
import { ReactComponent as LightIcon } from 'shared/assets/icons/aquarium/light.svg'
import { ReactComponent as O2Icon } from 'shared/assets/icons/aquarium/o2.svg'
import { ReactComponent as CO2Icon } from 'shared/assets/icons/aquarium/co2short.svg'
import { ReactComponent as FilterIcon } from 'shared/assets/icons/aquarium/filter.svg'
import { ReactComponent as ManualIcon } from 'shared/assets/icons/aquarium/hand.svg'
import { ReactComponent as ScheduleIcon } from 'shared/assets/icons/aquarium/arrow-up.svg'

interface RelayCardProps {
  className?: string;
  card: RelayCardType;
}
const relaySubtypeClasses: Record<RelaySubtype, string> = {
  light: cls.light,
  co2: cls.co2,
  o2: cls.o2,
  filter: cls.filter
};
export const RelayCard = ({
  className,
  card
}: RelayCardProps) => {

  const getRelayIcon = () => {
    switch (card.subtype) {
      case "co2":
        return <CO2Icon className={cls.icon} />
      case "o2":
        return <O2Icon className={cls.icon} />
      case "light":
        return <LightIcon className={cls.icon} />
      case "filter":
        return <FilterIcon className={cls.icon} />
    }
  }
  const mods: Mods = {
    [cls.on]: card.current.status,
    [relaySubtypeClasses[card.subtype]]: true
  }

  return (
    <CardBase>
      <div className={classNames(cls.relayCard, mods, [className])}>
        <div className={cls.body}>


          {getRelayIcon()}
          <div className={cls.right}>
            <h2 className={cls.name}>{card.config.name}</h2>
            <p className={cls.status}>{card.current.status ? "On" : "Off"}</p>
          </div>
        </div>

        <span className={cls.blur}></span>

        <div className={cls.mode}>
          {card.config.mode !== 2 ? <ManualIcon /> : <ScheduleIcon />}

          <p>{card.config.mode !== 2 ? "Manual" : `${card.config.on} - ${card.config.off}`}</p>
        </div>
      </div>
    </CardBase>
  );
}