import { Mods, classNames } from 'helpers/classNames';
import cls from './Tag.module.sass';
import { ReactNode } from 'react';
import { ReactComponent as XIcon } from 'assets/icons/x.svg';
import { Checkbox } from 'components/Checkbox';

type TagSize = 'S' | 'M' | 'L';
const sizeClasses: Record<TagSize, string> = {
  S: cls.s,
  M: cls.m,
  L: cls.l
};

export interface TagProps {
  className?: string;
  children?: ReactNode;
  onRemove?: () => void;
  counter?: string;
  checkbox?: boolean;
  Icon?: React.VFC<React.SVGProps<SVGSVGElement>>;
  dot?: boolean;
  size?: TagSize;
  checked?: boolean;
}

export const Tag = ({
  className,
  children,
  size = 'S',
  onRemove,
  counter,
  checkbox,
  Icon,
  dot,
  checked
}: TagProps) => {
  const mods: Mods = {
    [sizeClasses[size]]: size,
    [cls.parentCounter]: counter,
    [cls.parentCross]: !!onRemove,
    [cls.parentCheckbox]: checkbox,
    [cls.parentIcon]: !!Icon,
    [cls.parentDot]: dot
  }
  return (
    <div className={classNames(cls.tag, mods, [className])}>
      {checkbox && <Checkbox checked={checked} className={cls.checkbox} size={size} />}
      {dot && <div className={cls.dot} />}
      {Icon && <Icon className={cls.icon} />}
      {children}
      {onRemove && <XIcon className={cls.cross} />}
      {counter && <div className={cls.counter}>{counter}</div>}
    </div>
  );
};