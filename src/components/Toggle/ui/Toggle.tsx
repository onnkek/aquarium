import React from "react"
import { Mods, classNames } from '../../../helpers/classNames';
import cls from './Toggle.module.sass';
import { Switch } from '@headlessui/react';
import { useState } from 'react';

type ToggleSize = 'M' | 'L' | 'XL';
const sizeClasses: Record<ToggleSize, string> = {
  M: cls.m,
  L: cls.l,
  XL: cls.xl
};
export interface ToggleProps {
  className?: string;
  disabled?: boolean;
  checked?: boolean;
  size?: ToggleSize;
  onClick?: () => void;
}

export const Toggle = ({
  className,
  disabled,
  checked,
  size = 'M',
  onClick
}: ToggleProps) => {
  const [enabled, setEnabled] = useState(checked);
  const mods: Mods = {
    [cls.disabled]: disabled,
    [sizeClasses[size]]: true
  }
  return (
    <Switch
      onClick={onClick}
      disabled={disabled}
      className={classNames(cls.toggleContainer, mods, [className])}
      checked={enabled}
      onChange={setEnabled}
    >
      <span className={cls.toggle} />
    </Switch>
  );
};