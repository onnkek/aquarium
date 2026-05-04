import { useTheme } from 'app/providers/ThemeProvider/lib/useTheme';
import { CardType, ICard, RelayCardType, RelaySubtype } from 'entities/card/model/types';
import { useAppDispatch } from 'models/Hook';
import React from 'react';
import { Mods } from "shared/lib/classNames";
import { Modal } from 'shared/ui/Modal';
import { switchModal } from '../../../redux/AquariumSlice';
import cls from './SettingsWrapper.module.sass';


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
    if (card.config.name !== "System") {
      dispatch(switchModal(false));
    }

    onClose();
  }
  const onConfirmHandler = () => {
    if (onConfirm) {
      if (card.config.name !== "System") {
        dispatch(switchModal(false));
      }
      onConfirm();
    }
  }

  return (
    <Modal onClose={onCloseHandler} isOpen={open} className={cls.settingsWrapper} headerText={card.config.name} onConfirm={onConfirmHandler}>
      {children}
    </Modal>
  );
})