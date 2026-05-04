import { ReactNode } from 'react';
import { Mods, classNames } from 'shared/lib/classNames';
import cls from './Badge.module.sass';

type BadgeSize = 'S' | 'M' | 'L';
type BadgeTheme = 'primary' | 'outline' | 'rect' | 'modern';
type BadgeColor =
  'gray' | 'brand' | 'error' |
  'warning' | 'success' | 'gray-blue' |
  'blue-light' | 'blue' | 'indigo' |
  'purple' | 'pink' | 'orange' | 'black' | 'light-gray';
const sizeClasses: Record<BadgeSize, string> = {
  S: cls.s,
  M: cls.m,
  L: cls.l
};
const themeClasses: Record<BadgeTheme, string> = {
  primary: cls.primary,
  outline: cls.outline,
  rect: cls.rect,
  modern: cls.modern
};
const colorClasses: Record<BadgeColor, string> = {
  gray: cls.gray,
  brand: cls.brand,
  error: cls.error,
  warning: cls.warning,
  success: cls.success,
  "gray-blue": cls.grayBlue,
  "light-gray": cls.lightGray,
  "blue-light": cls.blueLight,
  blue: cls.blue,
  indigo: cls.indigo,
  purple: cls.purple,
  pink: cls.pink,
  orange: cls.orange,
  black: cls.black
};
export interface BadgeProps {
  className?: string;
  dot?: boolean;
  children?: ReactNode;
  size?: BadgeSize;
  theme?: BadgeTheme;
  color?: BadgeColor;
}

export const Badge = ({
  className,
  children,
  dot,
  size = 'S',
  theme = 'primary',
  color = 'gray'
}: BadgeProps) => {
  const mods: Mods = {
    [colorClasses[color]]: true,
    [sizeClasses[size]]: true,
    [themeClasses[theme]]: true
  }
  return (
    <span className={classNames(cls.badge, mods, [className])}>
      {dot && <div className={cls.dot} />}
      {children}
    </span>
  );
};