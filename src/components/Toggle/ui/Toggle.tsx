import { Mods, classNames } from 'helpers/classNames';
import cls from './Toggle.module.sass';
import { Switch } from '@headlessui/react';
import { useState } from 'react';

type ToggleSize = 'M' | 'L' | 'XL';
const sizeClasses: Record<ToggleSize, string> = {
  M: cls.m,
  L: cls.l,
  XL: cls.xl
};
type ToggleType = 'default' | 'switch';
const typeClasses: Record<ToggleType, string> = {
  default: cls.default,
  switch: cls.switch
};
export interface ToggleProps {
  className?: string;
  disabled?: boolean;
  checked?: boolean;
  type?: ToggleType;
  size?: ToggleSize;
  onClick?: () => void;
  onChange?: () => void;
}

export const Toggle = ({
  className,
  disabled,
  checked,
  size = 'M',
  type = 'default',
  onClick,
  onChange
}: ToggleProps) => {
  const [enabled, setEnabled] = useState(checked);
  const mods: Mods = {
    [cls.disabled]: disabled,
    [sizeClasses[size]]: true,
    [typeClasses[type]]: true
  }
  return (
    <Switch
      onClick={onClick}
      disabled={disabled}
      className={classNames(cls.toggleContainer, mods, [className])}
      checked={checked}
      onChange={onChange}
    >
      <span className={cls.toggle} />
    </Switch>
  );
};