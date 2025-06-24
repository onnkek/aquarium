import cls from './Dropdown.module.sass';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ReactElement, useState } from 'react';
import { classNames } from 'helpers/classNames';
import { useTheme } from 'helpers/ThemeProvider/lib/useTheme';
import { Button } from 'components/Button';
import clsButton from '../../Button/ui/Button.module.sass'

type DropdownItem = {
  content: string;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  Icon?: React.VFC<React.SVGProps<SVGSVGElement>>;
}
type DropdownAnchor =
  'bottom' | 'bottom end' | 'bottom start' |
  'top' | 'top end' | 'top start' |
  'left' | 'left end' | 'left start' |
  'right' | 'right end' | 'right start'
export interface DropdownProps {
  className?: string;
  select: string;
  items?: DropdownItem[][];
  header?: ReactElement;
  anchor?: DropdownAnchor
}

export const Dropdown = ({ className, select, items, header, anchor = 'bottom' }: DropdownProps) => {
  const { theme } = useTheme();
  return (

    <Menu>
      <MenuButton className={classNames(clsButton.button, {}, [clsButton.outlineTransp])}>
        {select}
      </MenuButton>
      <MenuItems anchor={anchor} className={classNames(cls.dropdown, {}, [theme, className])}>
        {header}
        {items && items.map((group: DropdownItem[]) => (
          <div className={cls.group} key={Math.random()}>
            {group && group.map((item: DropdownItem) => (
              <MenuItem disabled={item.disabled} key={Math.random()}>
                <div className={classNames(cls.item, { [cls.disabled]: item.disabled })}>
                  {item.Icon && <item.Icon className={cls.icon} />}
                  <Button
                    theme='clear'
                    onClick={item.onClick}
                    className={cls.button_option}
                  >{item.content}</Button>
                  {/* <a href={item.link} className={cls.content}>
                    {item.content}
                  </a> */}
                </div>
              </MenuItem>
            ))}
          </div>
        ))}
      </MenuItems>
    </Menu>
  );
};