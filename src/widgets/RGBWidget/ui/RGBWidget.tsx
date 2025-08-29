import cls from './RGBWidget.module.sass';
import { ReactNode } from 'react';
import { ReactComponent as GearIcon } from 'shared/assets/icons/gear.svg';
import { ReactComponent as XIcon } from 'shared/assets/icons/x.svg';
import { classNames, Mods } from 'shared/lib/classNames';
import { Toggle } from 'shared/ui/Toggle';
import { ReactComponent as ARGBIcon } from 'shared/assets/icons/aquarium/argb.svg';
import { ReactComponent as ManualIcon } from 'shared/assets/icons/aquarium/hand.svg'
import { ReactComponent as ScheduleIcon } from 'shared/assets/icons/aquarium/arrow-up.svg'
import { IARGB, IARGBStatusInfo, ITemp, ITempStatusInfo } from 'redux/AquariumSlice';
import { getStringARGBMode } from "shared/lib/period"


export interface RGBWidgetProps {
  className?: string;
  children?: ReactNode;
  onClickEdit?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  argb: IARGB;
  currentInfo: IARGBStatusInfo;
}

export const RGBWidget = ({
  className,
  argb,
  currentInfo
}: RGBWidgetProps) => {

  const mods: Mods = {
    [cls.on]: currentInfo.status !== 0,
    // [cls.on]: currentInfo.status,
    // [RGBWidgetTypeClasses[type]]: true
  } 

  return (
    <div className={classNames(cls.rgbWidget, mods, [className])}>
      <div className={cls.body}>
        <ARGBIcon className={cls.icon} />

        <div className={cls.right}>
          <h2 className={cls.name}>{argb.name}</h2>
          <p className={cls.status}>{getStringARGBMode(argb.mode)}</p>
        </div>
      </div>

      <span className={cls.blur}></span>

      <div className={cls.mode}>
        {argb.mode === 0 ? <ManualIcon /> : <ScheduleIcon />}

        <p>{argb.mode === 0 ? "Manual" : `${argb.on} - ${argb.off}`}</p>
      </div>
    </div>
  );
};