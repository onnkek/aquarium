import { Mods, classNames } from 'shared/lib/classNames';
import cls from './Pagination.module.sass';
import { Button } from 'shared/ui/Button';
import { useState } from 'react';
import { ReactComponent as ArrowLeftIcon } from 'assets/icons/arrow-left.svg';
import { ReactComponent as ArrowRightIcon } from 'assets/icons/arrow-right.svg';
import { ButtonGroup } from 'shared/ui/ButtonGroup';

type PaginationTheme = 'default' | 'default-circle' | 'minimal' | 'minimal-circle' | 'button-group' | 'text' | 'text-arrow';
const themeClasses: Record<PaginationTheme, string> = {
  default: cls.default,
  "default-circle": cls.defaultCircle,
  minimal: cls.minimal,
  "minimal-circle": cls.minimalCircle,
  "button-group": cls.buttonGroup,
  text: cls.text,
  "text-arrow": cls.textArrow
};

export interface PaginationProps {
  className?: string;
  maxNumber?: number;
  select?: number;
  theme?: PaginationTheme;
}

export const Pagination = ({
  className,
  maxNumber = 10,
  select = 1,
  theme = 'default'
}: PaginationProps) => {
  const [active, setActive] = useState<number>(select);
  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (e.currentTarget.textContent === null) {
      return;
    }
    setActive(Number(e.currentTarget.textContent));
    console.log(active)
  }
  const onPrevious = () => {
    if (active > 1) {
      setActive(active - 1);
    }
  }
  const onNext = () => {
    if (active < maxNumber) {
      setActive(active + 1);
    }

  }
  const numbers = Array(Number(maxNumber)).fill('').map((e, i) => i + 1);
  const mods: Mods = {
    [themeClasses[theme]]: true,
  }
  return (
    <div className={classNames(cls.pagination, mods, [className])}>
      {theme !== 'button-group' && (
        <>
          <Button theme='clear' size='S' className={cls.button} onClick={onPrevious}>
            <ArrowLeftIcon className={cls.arrowLeft} />
            {theme !== 'text-arrow' && "Previous"}
          </Button>
          {(theme !== 'text' && theme !== 'text-arrow') && <div className={cls.pages}>
            {numbers.map(number => {
              const mods: Mods = {
                [cls.active]: number === Number(active)
              }
              return (
                <Button
                  key={number}
                  theme='clear'
                  size='S'
                  onClick={onClick}
                  className={classNames('', mods)}
                >{number}</Button>
              )
            })}
          </div>}
          {(theme === 'text' || theme === 'text-arrow') && <span className={cls.pageText}>{`Page ${active} of ${maxNumber}`}</span>}

          <Button theme='clear' size='S' className={cls.button} onClick={onNext}>
            {theme !== 'text-arrow' && "Next"}
            <ArrowRightIcon className={cls.arrowRight} />
          </Button>
        </>
      )}
      {theme === 'button-group' && (
        <ButtonGroup>
          <Button theme='outline' size='S' className={cls.button} onClick={onPrevious}>
            <ArrowLeftIcon className={cls.arrowLeft} />
            Previous
          </Button>
          <div className={cls.pages}>
            {numbers.map(number => {
              const mods: Mods = {
                [cls.active]: number === Number(active)
              }
              return (
                <Button
                  key={number}
                  theme='outline'
                  size='S'
                  onClick={onClick}
                  className={classNames('', mods)}
                >{number}</Button>
              )
            })}
          </div>

          <Button theme='outline' size='S' className={cls.button} onClick={onNext}>
            Next
            <ArrowRightIcon className={cls.arrowRight} />
          </Button>
        </ButtonGroup>
      )}
    </div >
  );
};