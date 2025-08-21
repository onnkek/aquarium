import cls from './WidgetWrapper.module.sass';
import { ReactNode } from 'react';
import { ReactComponent as GearIcon } from 'shared/assets/icons/gear.svg';
import { ReactComponent as XIcon } from 'shared/assets/icons/x.svg';
import { classNames, Mods } from 'shared/lib/classNames';

type WidgetWrapperType = 'read' | 'write';
const typeClasses: Record<WidgetWrapperType, string> = {
  read: cls.read,
  write: cls.write
};
type WidgetWrapperColor = 'none' | 'violet' | 'red' | 'yellow' | 'blue' | 'tiffany' | 'rgb' | 'green' | 'white';
const colorClasses: Record<WidgetWrapperColor, string> = {
  none: cls.none,
  violet: cls.violet,
  red: cls.red,
  yellow: cls.yellow,
  blue: cls.blue,
  tiffany: cls.tiffany,
  rgb: cls.rgb,
  green: cls.green,
  white: cls.white
};

export interface WidgetWrapperProps {
  className?: string;
  children?: ReactNode;
  type?: WidgetWrapperType;
  color?: WidgetWrapperColor;
  state?: boolean;
  onClickEdit?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const WidgetWrapper = ({
  className,
  children,
  type = 'read',
  color = 'none',
  state = false,
  onClickEdit
}: WidgetWrapperProps) => {

  const mods: Mods = {
    [cls.on]: state,
    [typeClasses[type]]: true,
    [colorClasses[color]]: true
  }

  return (
    <div className={classNames(cls.widget, mods, [className])}>
      <div className={cls.blur} />
      <div className={cls.rect} />
      {onClickEdit && <button
        type="button"
        className={cls.btn}
        onClick={onClickEdit}
      >
        {type === 'read' && <GearIcon />}
        {type === 'write' && <XIcon />}
      </button>}
      {children}
    </div>
  );
};