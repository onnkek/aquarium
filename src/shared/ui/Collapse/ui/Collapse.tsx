import { Mods, classNames } from 'shared/lib/classNames';
import cls from './Collapse.module.sass';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { ReactNode, useState } from 'react';
import { ReactComponent as ChipIcon } from 'shared/assets/icons/aquarium/chevron.svg';
import { AnimatePresence, motion } from "motion/react";

export interface CollapseProps {
  className?: string;
  defaultOpen?: boolean;
  buttonText?: string;
  children: ReactNode;
}

export const Collapse = ({
  className,
  children,
  defaultOpen = true,
  buttonText = "",
  ...otherProps
}: CollapseProps) => {
  const [open, setOpen] = useState(defaultOpen);
  const buttonMods: Mods = {
    [cls.open]: open
  }
  return (
    <Disclosure defaultOpen={open} as="div" className={classNames(cls.collapseContainer, {}, [])} {...otherProps}>
      <DisclosureButton className={classNames(cls.collapseButton, buttonMods, [])} onClick={() => setOpen(!open)}>
        <ChipIcon className={cls.icon} />
        {buttonText}
      </DisclosureButton>
      <DisclosurePanel className={cls.collapse}>
        {children}
      </DisclosurePanel>
    </Disclosure>
  );
};