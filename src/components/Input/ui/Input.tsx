import { Mods, classNames } from 'helpers/classNames';
import cls from './Input.module.sass';
import { Input as HInput, _internal_ComponentInput } from '@headlessui/react';
import { Textarea as HTextarea } from '@headlessui/react'
import { ReactComponent as QuestionIcon } from 'assets/icons/question.svg';
import { ReactComponent as AlertIcon } from 'assets/icons/alert.svg';
import { ChangeEventHandler, Ref } from 'react';

export interface InputProps {
  onChange?: ChangeEventHandler<HTMLInputElement>;
  className?: string;
  placeholder?: string;
  Icon?: React.VFC<React.SVGProps<SVGSVGElement>>;
  disabled?: boolean;
  descr?: string;
  error?: string;
  area?: boolean;
  areaResize?: boolean;
  areaCols?: number;
  areaRows?: number;
  maxLength?: number;
  inputRef?: Ref<HTMLElement>;
  value?: string | number;
  type?: string;
  step?: number;
}

export const Input = ({ type, step, className, value, placeholder, Icon, disabled, descr, error, area = false, areaResize = false, areaCols = 30, areaRows = 4, maxLength, onChange, inputRef, ...otherProps }: InputProps) => {

  const mods: Mods = {
    [cls.area]: area,
    [cls.disabled]: disabled,
    [cls.haveIcon]: !Icon,
    [cls.parentError]: error,
    [cls.resize]: areaResize
  }
  return (
    <div className={classNames(cls.inputContainer, mods)}>
      {Icon && <Icon className={cls.icon} />}
      {area ?
        <HTextarea cols={areaCols} rows={areaRows} disabled={disabled} className={classNames(cls.input, {}, [className])} placeholder={placeholder} name="description"></HTextarea>
        :
        <HInput step={step} type={type} value={value} ref={inputRef} {...otherProps} onChange={onChange} maxLength={maxLength} disabled={disabled} className={classNames(cls.input, {}, [className])} placeholder={placeholder} name="full_name" />
      }
      {(!area && descr && !error) && <QuestionIcon className={cls.info} />}
      {!area && error && <AlertIcon className={cls.info} />}
    </div>
  );
};