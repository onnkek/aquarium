import cls from './RelayWidget.module.sass';
import { ReactNode } from 'react';
import { ReactComponent as GearIcon } from 'shared/assets/icons/gear.svg';
import { ReactComponent as XIcon } from 'shared/assets/icons/x.svg';
import { classNames, Mods } from 'shared/lib/classNames';
import { Toggle } from 'shared/ui/Toggle';
import { ReactComponent as LightIcon } from 'shared/assets/icons/aquarium/light.svg'
import { ReactComponent as O2Icon } from 'shared/assets/icons/aquarium/o2.svg'
import { ReactComponent as CO2Icon } from 'shared/assets/icons/aquarium/co2short.svg'
import { ReactComponent as FilterIcon } from 'shared/assets/icons/aquarium/filter.svg'
import { ReactComponent as ManualIcon } from 'shared/assets/icons/aquarium/hand.svg'
import { ReactComponent as ScheduleIcon } from 'shared/assets/icons/aquarium/arrow-up.svg'
import { IRelay, IStatusInfo } from 'redux/AquariumSlice';


type RelayWidgetType = 'light' | 'co2' | 'o2' | 'filter';
const relayWidgetTypeClasses: Record<RelayWidgetType, string> = {
  light: cls.light,
  co2: cls.co2,
  o2: cls.o2,
  filter: cls.filter
};

type RelayWidgetColor = 'none' | 'violet' | 'red' | 'yellow' | 'blue' | 'tiffany' | 'rgb' | 'green' | 'white';
const colorClasses: Record<RelayWidgetColor, string> = {
  none: cls.none,
  violet: cls.violet,
  red: cls.red,
  yellow: cls.yellow,
  blue: cls.blue,
  tiffany: cls.tiffany,
  rgb: cls.rgb,
  green: cls.green,
  white: cls.white
};

export interface RelayWidgetProps {
  className?: string;
  children?: ReactNode;
  color?: RelayWidgetColor;
  onClickEdit?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  relay: IRelay;
  currentInfo: IStatusInfo
  type: RelayWidgetType;
}

export const RelayWidget = ({
  className,
  children,
  color = 'none',
  relay,
  onClickEdit,
  type,
  currentInfo
}: RelayWidgetProps) => {

  const mods: Mods = {
    [cls.on]: currentInfo.status,
    [relayWidgetTypeClasses[type]]: true,
    [colorClasses[color]]: true,
  }

  const getIcon = () => {
    switch (type) {
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

  return (
    <div className={classNames(cls.relayWidget, mods, [className])}>
      <div className={cls.body}>


        {getIcon()}
        <div className={cls.right}>
          <h2 className={cls.name}>{relay.name}</h2>
          <p className={cls.status}>{currentInfo.status ? "On" : "Off"}</p>
        </div>
      </div>

      <span className={cls.blur}></span>

      <div className={cls.mode}>
        {relay.mode !== 2 ? <ManualIcon /> : <ScheduleIcon />}

        <p>{relay.mode !== 2 ? "Manual" : `${relay.on} - ${relay.off}`}</p>
      </div>
    </div>
  );
};