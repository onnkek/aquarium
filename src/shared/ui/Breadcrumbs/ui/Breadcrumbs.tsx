import { Mods, classNames } from 'shared/lib/classNames';
import cls from './Breadcrumbs.module.sass';
import { ReactComponent as HomeIcon } from 'assets/icons/home-line.svg';
import { ReactComponent as ChevronIcon } from 'assets/icons/chevron-right.svg';
import { ReactComponent as SlashIcon } from 'assets/icons/slash-divider.svg';

interface BreadcrumbsItem {
  content: string;
  link: string;
}
type DividerTheme = 'chevron' | 'slash';
const dividerClasses: Record<DividerTheme, string> = {
  chevron: cls.chevron,
  slash: cls.slash
};
type BreadcrumbsTheme = 'primary' | 'line';
const themeClasses: Record<BreadcrumbsTheme, string> = {
  primary: cls.primary,
  line: cls.line
};
type ActiveTheme = 'none' | 'clear-color' | 'clear';
const activeClasses: Record<ActiveTheme, string> = {
  none: '',
  "clear-color": cls.clearColor,
  clear: cls.clear
};
export interface BreadcrumbsProps {
  className?: string;
  items?: BreadcrumbsItem[];
  dividerTheme?: DividerTheme;
  theme?: BreadcrumbsTheme;
  activeTheme?: ActiveTheme;
}

export const Breadcrumbs = ({
  className,
  items,
  dividerTheme = 'chevron',
  theme = 'primary',
  activeTheme = 'none'
}: BreadcrumbsProps) => {

  const dividerMods: Mods = {
    [dividerClasses[dividerTheme]]: true
  }
  const mods: Mods = {
    [themeClasses[theme]]: true,
    [activeClasses[activeTheme]]: true
  }
  return (
    <div className={classNames(cls.breadcrumbs, mods, [className])}>
      <a href="/" className={cls.homeContainer}>
        <HomeIcon className={cls.home} />
      </a>

      {items?.map(item => (
        <>
          {dividerTheme === 'chevron' && <ChevronIcon className={classNames(cls.divider, dividerMods)} />}
          {dividerTheme === 'slash' && <SlashIcon className={classNames(cls.divider, dividerMods)} />}
          <a href={item.link} className={cls.item}>{item.content}</a>
        </>

      ))}
    </div>
  );
};