import { useState } from 'react';
import cls from './ProgressCircle.module.sass';
import { Mods, classNames } from 'helpers/classNames';

type ProgressCircleSize = 'XXS' | 'M' | 'L' | 'XL' | '2XL';
const sizeClasses: Record<ProgressCircleSize, string> = {
  XXS: cls.xxs,
  M: cls.m,
  L: cls.l,
  XL: cls.xl,
  '2XL': cls.xxl
};
export interface ProgressCircleProps {
  className?: string;
  value?: string;
  size?: ProgressCircleSize;
  title?: string;
  half?: boolean;
}

export const ProgressCircle = ({
  className,
  value = '0',
  size = 'M',
  title,
  half = false
}: ProgressCircleProps) => {
  const [progress, setProgress] = useState(value);
  const mods: Mods = {
    [sizeClasses[size]]: true,
    [cls.half]: half
  }
  return (
    <div className={classNames(cls.wrapper, mods, [className])}>
      <svg className={cls.svg}>
        <circle className={cls.progressContainer} />
        {half ?
          <circle className={cls.progress} strokeDashoffset={`calc(var(--progress-length) - ${progress} * var(--progress-length) / 100 / 2)`} />
          :
          <circle className={cls.progress} strokeDashoffset={`calc(var(--progress-length) - ${progress} * var(--progress-length) / 100)`} />
        }
      </svg>
      {title && <div className={cls.title}>{title}</div>}
      <div className={cls.text}>{`${progress}%`}</div>

    </div >
  );
};