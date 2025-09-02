import cls from './SettingsWrapper.module.sass';
import { classNames, Mods } from "shared/lib/classNames";
import { motion } from "motion/react";
import { Button } from 'shared/ui/Button';
import { CardType, ICard, RelayCardType, RelaySubtype } from 'entities/card/model/types';
import { ReactComponent as BackIcon } from 'shared/assets/icons/aquarium/back.svg'
import { ReactComponent as CheckIcon } from 'shared/assets/icons/aquarium/check.svg'
import { Portal } from 'shared/ui/Portal';
import { useTheme } from 'app/providers/ThemeProvider/lib/useTheme';
import { switchModal } from '../../../redux/AquariumSlice';
import { useAppDispatch } from 'models/Hook';
import React from 'react';

interface SettingsWrapperProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  card: ICard;
  onConfirm?: () => void;
}
const typeClasses: Record<CardType, string> = {
  temp: cls.temp,
  argb: cls.argb,
  pump: cls.pump,
  relay: cls.relay,
  server: cls.server,
  system: cls.system
};
const relaySubtypeClasses: Record<RelaySubtype, string> = {
  light: cls.light,
  co2: cls.co2,
  o2: cls.o2,
  filter: cls.filter
};
export const SettingsWrapper = React.memo(({
  children,
  className,
  open,
  onClose,
  card,
  onConfirm
}: SettingsWrapperProps) => {
  const dispatch = useAppDispatch()
  const { theme } = useTheme();
  const mods: Mods = {
    [typeClasses[card.type]]: true,
    [relaySubtypeClasses[(card as RelayCardType).subtype]]: true
  }

  const onCloseHandler = () => {
    dispatch(switchModal(false));
    onClose();
  }
  const onConfirmHandler = () => {
    if (onConfirm) {
      dispatch(switchModal(false));
      onConfirm();
    }
  }

  return (
    <Portal>
      <motion.div
        className={classNames(cls.settingsWrapper, mods, [theme, className])}
        layoutId={`card-${card.id}`}
        transition={{
          // duration: 0.25 
          type: "spring",
          stiffness: 1000,
          damping: 50
        }}
      >
        <span className={cls.blur}></span>
        <div className={cls.header}>
          <Button theme='clear' className={cls.button} onClick={onCloseHandler}>
            <BackIcon />
          </Button>
          <h2 className={cls.title}>{card.config.name}</h2>
          <div className={cls.other}>
            <Button theme='clear' className={classNames(cls.otherButton, {}, [onConfirm && cls.otherButtonShow])} onClick={onConfirmHandler}>
              <CheckIcon />
            </Button>
          </div>
        </div>
        <div className={cls.content}>
          {children}
        </div>
      </motion.div>
    </Portal>
  );
})