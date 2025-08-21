import { Mods, classNames } from 'shared/lib/classNames';
import cls from './Checkbox.module.sass';
import { Checkbox as HCheckbox } from '@headlessui/react'
import { useState } from 'react';

type CheckboxSize = 'S' | 'M' | 'L' | 'XL';
const sizeClasses: Record<CheckboxSize, string> = {
  S: cls.s,
  M: cls.m,
  L: cls.l,
  XL: cls.xl
};
export interface CheckboxProps {
  className?: string;
  disabled?: boolean;
  checked?: boolean;
  size?: CheckboxSize;
}

export const Checkbox = ({
  className,
  disabled = false,
  checked = false,
  size = 'M'
}: CheckboxProps) => {
  const [enabled, setEnabled] = useState(checked);
  const mods: Mods = {
    [sizeClasses[size]]: true,
    [cls.disabled]: disabled
  }
  return (
    <HCheckbox
      disabled={disabled}
      checked={enabled}
      onChange={setEnabled}
      className={classNames(cls.checkbox, mods, [className])}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="1 1 14 14">
        <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z" />
      </svg>
    </HCheckbox>
  );
};