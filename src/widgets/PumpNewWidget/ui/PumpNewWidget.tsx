import cls from './PumpNewWidget.module.sass';
import { ReactNode } from 'react';
import { ReactComponent as GearIcon } from 'shared/assets/icons/gear.svg';
import { ReactComponent as XIcon } from 'shared/assets/icons/x.svg';
import { classNames, Mods } from 'shared/lib/classNames';
import { Toggle } from 'shared/ui/Toggle';
import { ReactComponent as PumpIcon } from 'shared/assets/icons/aquarium/pump.svg'
import { ReactComponent as BottleIcon } from 'shared/assets/icons/aquarium/bottle.svg'
import { ReactComponent as DropIcon } from 'shared/assets/icons/aquarium/drop.svg'
import { ReactComponent as FilterIcon } from 'shared/assets/icons/aquarium/filter.svg'
import { ReactComponent as ManualIcon } from 'shared/assets/icons/aquarium/hand.svg'
import { ReactComponent as TimeIcon } from 'shared/assets/icons/aquarium/time.svg'
import { ReactComponent as ScheduleIcon } from 'shared/assets/icons/aquarium/arrow-up.svg'
import { IPumpConfig, IPumpStatus, IPunpInfo, IRelay, IStatusInfo } from 'redux/AquariumSlice';
import { Progress } from 'shared/ui/Progress';


export interface PumpNewWidgetProps {
  className?: string;
  children?: ReactNode;
  onClickEdit?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  pump: IPumpConfig;
  currentInfo: IPunpInfo
}

export const PumpNewWidget = ({
  className,
  pump,
  currentInfo
}: PumpNewWidgetProps) => {

  const mods: Mods = {
    [cls.on]: currentInfo.status,
    // [colorClasses[color]]: true,
  }


  return (
    <div className={classNames(cls.pumpNewWidget, mods, [className])}>
      <div className={cls.body}>


        {<PumpIcon className={cls.icon} />}
        <div className={cls.right}>
          <h2 className={cls.name}>{pump.name}</h2>
          <p className={cls.status}>{currentInfo.status ? "On" : "Off"}</p>
        </div>
      </div>

      <span className={cls.blur}></span>

      <div className={cls.mode}>
        {pump.mode !== 2 ? <ManualIcon /> : <ScheduleIcon />}
        <p>{pump.mode !== 2 ? "Manual" : `${pump.time}`}</p>
      </div>
      <div className={cls.mode}>
        <DropIcon className={cls.modeIcon} />
        <p>{(currentInfo.introduced / 100 * pump.dosage).toFixed(0)}/{pump.dosage.toFixed(0)} ml</p>
        <Progress className={cls.progress_dose} text="none" value={currentInfo.introduced} />
      </div>
      <div className={cls.mode}>
        <BottleIcon className={cls.modeIcon} />
        <p>{(pump.currentVolume / pump.dosage).toFixed(0)} days</p>
        <Progress className={cls.progress} text="none" value={pump.currentVolume / pump.maxVolume * 100} />
      </div>
    </div>
  );
};