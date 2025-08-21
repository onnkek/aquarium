import { Mods, classNames } from 'shared/lib/classNames';
import cls from './Progress.module.sass';

type ProgressTextType = 'end' | 'bottom-end' | 'tooltip-top' | 'tooltip-bottom' | 'none';
const textClasses: Record<ProgressTextType, string> = {
  end: cls.end,
  'bottom-end': cls.bottomEnd,
  'tooltip-top': cls.tooltipTop,
  'tooltip-bottom': cls.tooltipBottom,
  'none': cls.none
};
export interface ProgressProps {
  className?: string;
  value?: number;
  text?: ProgressTextType;
}

export const Progress = ({ className, value = 0, text = 'end' }: ProgressProps) => {
  const mods: Mods = {
    [textClasses[text]]: true
  }
  return (
    <div className={classNames(cls.wrapper, mods, [className])}>
      <div className={cls.progressContainer}>
        <div
          className={cls.progress}
          style={{ width: `${(value > 0 && value < 1) ? 1 : value}%` }}
        />
      </div>
      <div
        className={cls.text}
        style={{ left: `${(value > 0 && value < 1) ? 1 : value}%` }}
      >{`${value}%`}</div>
    </div >
  );
};