import { Mods, classNames } from 'shared/lib/classNames';
import cls from './InputGroup.module.sass';
import { ReactNode } from 'react';

export interface InputGroupProps {
  className?: string;
  children?: ReactNode;
  label?: string;
  descr?: string;
  error?: string;
  group?: boolean;
}

export const InputGroup = ({ className, children, group = true, label, descr, error }: InputGroupProps) => {
  const mods: Mods = {
    [cls.parentError]: error,
    [cls.group]: group
  }
  return (
    <form className={classNames(cls.inputGroup, mods, [className])}>
      {label && <label className={cls.label}>{label}</label>}
      <div className={cls.input}>
        {children}
      </div>
      {!error && descr && <div className={cls.descr}>{descr}</div>}
      {error && <div className={cls.error}>{error}</div>}
    </form>
  );
};