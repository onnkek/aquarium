import { Mods, classNames } from 'helpers/classNames';
import cls from './Avatar.module.sass';
import { ReactComponent as PersonIcon } from 'assets/icons/person.svg';

type AvatarSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | '2XL';
type AvatarStatus = 'online' | 'offline' | 'brb' | 'dnd';
const sizeClasses: Record<AvatarSize, string> = {
  XS: cls.xs,
  S: cls.s,
  M: cls.m,
  L: cls.l,
  XL: cls.xl,
  '2XL': cls.xxl
};
const statusClasses: Record<AvatarStatus, string> = {
  online: cls.online,
  offline: cls.offline,
  brb: cls.brb,
  dnd: cls.dnd
};
export interface AvatarProps {
  className?: string;
  src?: string;
  size?: AvatarSize;
  status?: AvatarStatus;
}

export const Avatar = ({
  className,
  src,
  size = 'L',
  status = 'online'
}: AvatarProps) => {

  const mods: Mods = {
    [sizeClasses[size]]: true
  }
  const indicatorMods: Mods = {
    [statusClasses[status]]: true
  }
  return (
    <div className={classNames(cls.avatar, mods, [className])}>
      {src ? <img src={src} /> : <PersonIcon />}
      <span className={classNames(cls.indicator, indicatorMods)} />
    </div>
  );
};