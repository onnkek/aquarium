import cls from './PIDWidget.module.sass';
import { ReactNode } from 'react';
import { ReactComponent as GearIcon } from 'shared/assets/icons/gear.svg';
import { ReactComponent as XIcon } from 'shared/assets/icons/x.svg';
import { classNames, Mods } from 'shared/lib/classNames';
import { Toggle } from 'shared/ui/Toggle';
import { ReactComponent as TempIcon } from 'shared/assets/icons/aquarium/temp.svg';
import { ReactComponent as CoolIcon } from 'shared/assets/icons/fan.svg';
import { ReactComponent as HeatIcon } from 'shared/assets/icons/heat.svg';
import { ReactComponent as ManualIcon } from 'shared/assets/icons/aquarium/hand.svg'
import { ReactComponent as ScheduleIcon } from 'shared/assets/icons/aquarium/lightning.svg'
import { ITemp, ITempStatusInfo } from 'redux/AquariumSlice';



export interface PIDWidgetProps {
  className?: string;
  children?: ReactNode;
  onClickEdit?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  temp: ITemp;
  currentInfo: ITempStatusInfo;
}

export const PIDWidget = ({
  className,
  temp,
  currentInfo
}: PIDWidgetProps) => {

  const mods: Mods = {
    [cls.on]: currentInfo.status !== 0,
    // [cls.on]: currentInfo.status,
    // [PIDWidgetTypeClasses[type]]: true
  }

  return (
    <div className={classNames(cls.pidWidget, mods, [className])}>
      <div className={cls.body}>

        {(currentInfo.status === 1 || currentInfo.status === 3) && <CoolIcon className={classNames(cls.cool, { [cls.cool_animation]: true }, [])} />}
        {(currentInfo.status === 2 || currentInfo.status === 3) && <HeatIcon className={classNames(cls.heat, { [cls.heat_animation]: true }, [])} />}
        {currentInfo.status === 0 && <TempIcon className={cls.icon} />}

        <div className={cls.right}>
          <h2 className={cls.name}>{temp.name}</h2>
          <p className={cls.status}>{currentInfo.current.toFixed(2)} ℃</p>
        </div>
      </div>

      <span className={cls.blur}></span>

      <div className={cls.mode}>
        {temp.mode !== 4 ? <ManualIcon /> : <ScheduleIcon />}

        <p>{temp.mode !== 4 ? "Manual" : "PID"}</p>
      </div>
    </div>
  );
};