import { classNames } from 'helpers/classNames';
import cls from './InputText.module.sass';
import { ReactNode } from 'react';

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