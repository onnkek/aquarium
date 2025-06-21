import { Mods, classNames } from 'helpers/classNames';
import cls from './Progress.module.sass';
import { useState } from 'react';

type ProgressTextType = 'end' | 'bottom-end' | 'tooltip-top' | 'tooltip-bottom';
const textClasses: Record<ProgressTextType, string> = {
  end: cls.end,
  'bottom-end': cls.bottomEnd,
  'tooltip-top': cls.tooltipTop,
  'tooltip-bottom': cls.tooltipBottom
};
export interface ProgressProps {
  className?: string;
  value?: string;
  text?: ProgressTextType;
}

export const Progress = ({ className, value = '0', text = 'end' }: ProgressProps) => {
  const [progress, setProgress] = useState(value);
  const mods: Mods = {
    [textClasses[text]]: true
  }
  return (
    <div className={classNames(cls.wrapper, mods, [className])}>
      <div className={cls.progressContainer}>
        <div
          className={cls.progress}
          style={{ width: `${progress}%` }}
        />
      </div>
      <div
        className={cls.text}
        style={{ left: `${value}%` }}
      >{`${progress}%`}</div>
    </div >
  );
};