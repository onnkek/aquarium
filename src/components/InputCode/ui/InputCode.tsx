import { Mods, classNames } from 'helpers/classNames';
import cls from './InputCode.module.sass';
import { Input } from 'components/Input/ui/Input';
import { useRef, useState } from 'react';

type CodeType = '4' | '3+3';
type CodeSize = 'S' | 'M' | 'L';
const sizeClasses: Record<CodeSize, string> = {
  S: cls.s,
  M: cls.m,
  L: cls.l
};
export interface InputCodeProps {
  className?: string;
  type?: CodeType;
  size?: CodeSize;
}

export const InputCode = ({ className, type = '4', size = 'S' }: InputCodeProps) => {
  const [values, setValues] = useState(type === '4' ? Array(4).fill('') : Array(6).fill(''));

  const onChange = (e: any) => {
    const index = +e.target.dataset.index;
    const value = e.target.value;

    setValues(values.map((n, i) => i === index ? value : n));

    if (index < values.length - 1 && value) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const inputRefs = useRef<(HTMLElement | null)[]>([]);
  const mods: Mods = {
    [sizeClasses[size]]: true
  }
  return (
    <div className={classNames(cls.inputCode, mods, [className])}>
      {type === '4' && values.map((n, i) => (
        <Input
          key={i}
          value={n}
          data-index={i}
          onChange={onChange}
          inputRef={input => inputRefs.current[i] = input}
          maxLength={1}
          placeholder='0'
        />
      ))}
      {type === '3+3' &&
        values.map((n, i) => {
          if (i === 3) {
            return (
              <>
                <div className={cls.divide}>-</div>
                <Input
                  key={i}
                  value={n}
                  data-index={i}
                  onChange={onChange}
                  inputRef={input => inputRefs.current[i] = input}
                  maxLength={1}
                  placeholder='0'
                />
              </>
            );
          }
          return (
            <Input
              key={i}
              value={n}
              data-index={i}
              onChange={onChange}
              inputRef={input => inputRefs.current[i] = input}
              maxLength={1}
              placeholder='0'
            />
          );


        })}

    </div>
  );
};