import { RelayCardType, RelaySubtype } from 'entities/card/model/types';
import { ReactComponent as CO2Icon } from 'shared/assets/icons/aquarium/co2short.svg';
import { ReactComponent as LightIcon } from 'shared/assets/icons/aquarium/fanlight.svg';
import { ReactComponent as FilterIcon } from 'shared/assets/icons/aquarium/filter.svg';
import { ReactComponent as O2Icon } from 'shared/assets/icons/aquarium/o2.svg';
import { classNames, Mods } from "shared/lib/classNames";
import { Badge } from 'shared/ui/Badge';
import { CardBase } from '../CardBase';
import cls from './RelayCard.module.sass';

interface RelayCardProps {
  className?: string;
  card: RelayCardType;
  onToggle: () => void;
}
const relaySubtypeClasses: Record<RelaySubtype, string> = {
  light: cls.light,
  co2: cls.co2,
  o2: cls.o2,
  filter: cls.filter
};
export const RelayCard = ({
  className,
  card,
  onToggle
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
    <CardBase
      cardId={card.id}
      className={classNames(cls.relayCard + " " + cls.span3, {}, [className])}
      onToggle={onToggle}
      header={card.config.name}
      badge={"Relay"}
      icon={getRelayIcon()}
    >
      <div className={cls.section + " " + cls.device}>
        <div className={cls.deviceTop}>
          <div className={classNames(cls.chips, { [cls.manual]: card.config.mode !== 2 }, [])}>
            {card.config.mode === 2 && <Badge theme='outline' color='gray'>{card.config.on}-{card.config.off}</Badge>}
            <div className={cls.state}>
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