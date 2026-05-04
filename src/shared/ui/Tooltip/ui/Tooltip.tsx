import { classNames } from 'shared/lib/classNames';
import cls from './Tooltip.module.sass';

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