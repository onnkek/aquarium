import { classNames } from 'helpers/classNames';
import cls from './Tooltip.module.sass';
import {Tooltip as RTooltip} from 'react-tooltip';

export interface TooltipProps {
  className?: string;
}

export const Tooltip = ({ className }: TooltipProps) => {

  return (
    <div className={classNames(cls.tooltip, {}, [className])}>
      <div className={cls.tooltipArrow}></div>
      This is a tooltip
    </div>
  );
};