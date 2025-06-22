import { Mods, classNames } from 'helpers/classNames';
import cls from './Button.module.sass';
import { Button as HButton } from '@headlessui/react'
import { ReactNode } from 'react';

type ButtonSize = 'XS' | 'S' | 'M' | 'L' | 'XL';
type ButtonTheme = 'primary' | 'outline' | 'color-outline' | 'clear' | 'color-clear' | 'loading';
const sizeClasses: Record<ButtonSize, string> = {
  XS: cls.xs,
  S: cls.s,
  M: cls.m,
  L: cls.l,
  XL: cls.xl
};
const themeClasses: Record<ButtonTheme, string> = {
  primary: cls.primary,
  outline: cls.outline,
  'color-outline': cls.colorOutline,
  clear: cls.clear,
  'color-clear': cls.colorClear,
  'loading': cls.loading
};
export interface ButtonProps {
  className?: string;
  children?: ReactNode;
  disabled?: boolean;
  size?: ButtonSize;
  theme?: ButtonTheme;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void; 
  width?: string;
}

export const Button = ({
  className,
  children,
  disabled = false,
  size = 'M',
  theme = 'primary',
  width,
  ...otherProps
}: ButtonProps) => {

  const mods: Mods = {
    [cls.disabled]: disabled,
    [sizeClasses[size]]: true,
    [themeClasses[theme]]: true
  }
  return (
    <HButton style={{ width: width }} {...otherProps} disabled={disabled} className={classNames(cls.button, mods, [className])}>
      {children}
    </HButton>
  );
};