import { ReactNode } from 'react';
import { classNames } from 'shared/lib/classNames';
import cls from './ButtonGroup.module.sass';

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