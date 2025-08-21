import { ReactNode } from 'react';
import cls from './ButtonGroup.module.sass';
import { classNames } from 'shared/lib/classNames';

export interface ButtonGroupProps {
  className?: string;
  children: ReactNode;
}

export const ButtonGroup = ({ className, children }: ButtonGroupProps) => {

  return (
    <div className={classNames(cls.buttonGroup, {}, [className])}>
      {children}
    </div>
  );
};