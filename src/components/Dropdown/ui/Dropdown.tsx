import cls from './Dropdown.module.sass';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ReactElement } from 'react';
import { classNames } from 'helpers/classNames';

type DropdownItem = {
  content: string;
  link: string;
  disabled?: boolean;
  Icon?: React.VFC<React.SVGProps<SVGSVGElement>>;
}
type DropdownAnchor =
  'bottom' | 'bottom end' | 'bottom start' |
  'top' | 'top end' | 'top start' |
  'left' | 'left end' | 'left start' |
  'right' | 'right end' | 'right start'
export interface DropdownProps {
  className?: string;
  button?: ReactElement;
  items?: DropdownItem[][];
  header?: ReactElement;
  anchor?: DropdownAnchor
}

export const Dropdown = ({ className, button, items, header, anchor = 'bottom' }: DropdownProps) => {

  return (
    <Menu>
      <MenuButton className={cls.btn}>
        {button}
      </MenuButton>
      <MenuItems anchor={anchor} className={classNames(cls.dropdown, {}, [className])}>
        {header}
        {items && items.map((group: DropdownItem[]) => (
          <div className={cls.group}>
            {group && group.map((item: DropdownItem) => (
              <MenuItem disabled={item.disabled}>
                <div className={classNames(cls.item, { [cls.disabled]: item.disabled })}>
                  {item.Icon && <item.Icon className={cls.icon} />}
                  <a href={item.link} className={cls.content}>
                    {item.content}
                  </a>
                </div>
              </MenuItem>
            ))}
          </div>
        ))}
      </MenuItems>
    </Menu>
  );
};