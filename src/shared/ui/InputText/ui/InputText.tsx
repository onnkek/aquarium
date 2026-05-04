import { ReactNode } from 'react';
import { classNames } from 'shared/lib/classNames';
import cls from './InputText.module.sass';

export interface InputTextProps {
  className?: string;
  children?: ReactNode;
}

export const InputText = ({ className, children }: InputTextProps) => {

  return (
    <div className={classNames(cls.inputText, {}, [className])}>
      {children}
    </div>
  );
};