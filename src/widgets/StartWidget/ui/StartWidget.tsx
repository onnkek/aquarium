import cls from './StartWidget.module.sass';
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
import { IConfig, ICurrentInfo, IRelay, IStatusInfo } from 'redux/AquariumSlice';
import { getDateString, getTimeString } from 'shared/lib/period';
import { ReactComponent as TempIcon } from 'shared/assets/icons/aquarium/temp2.svg';
import { ReactComponent as HumidityIcon } from 'shared/assets/icons/aquarium/humidity.svg';


export interface StartWidgetProps {
  className?: string;
  children?: ReactNode;
  onClickEdit?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  config: IConfig;
  currentInfo: ICurrentInfo
}

export const StartWidget = ({
  className,
  config,
  currentInfo
}: StartWidgetProps) => {

  const mods: Mods = {
    // [cls.on]: currentInfo.status,
    // [StartWidgetTypeClasses[type]]: true,
    // [colorClasses[color]]: true,
  }

  return (
    <div className={classNames(cls.startWidget, mods, [className])}>
      <div className={cls.body}>

        <div className={cls.header}>
          <h2 className={cls.date}>{getDateString(currentInfo.system.time)}</h2>
          <p className={cls.time}>{getTimeString(currentInfo.system.time)}</p>
        </div>


        <div className={cls.temp}>
          <div className={cls.tempItem}>
            <TempIcon />
            <p className={cls.text}>{currentInfo.system.outside.temp.toFixed(2)} ℃</p>
          </div>
          <div className={cls.tempItem}>
            <HumidityIcon />
            <p className={cls.text}>{currentInfo.system.outside.hum.toFixed(2)} %</p>
          </div>
        </div>



      </div>

      <span className={cls.blur}></span>

      {/* <div className={cls.mode}>
        {relay.mode !== 2 ? <ManualIcon /> : <ScheduleIcon />}

        <p>{relay.mode !== 2 ? "Manual" : `${relay.on} - ${relay.off}`}</p>
      </div> */}
    </div>
  );
};