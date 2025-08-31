import cls from './SettingsWrapper.module.sass';
import { classNames, Mods } from "shared/lib/classNames";
import { AnimatePresence, motion } from "framer-motion"
import { Button } from 'shared/ui/Button';
import { CardType, ICard, RelayCardType, RelaySubtype } from 'entities/card/model/types';
import { ReactComponent as BackIcon } from 'shared/assets/icons/aquarium/back.svg'
import { ReactComponent as CheckIcon } from 'shared/assets/icons/aquarium/check.svg'
import { Portal } from 'shared/ui/Portal';
import { useTheme } from 'app/providers/ThemeProvider/lib/useTheme';
import { switchModal } from '../../../redux/AquariumSlice';
import { useAppDispatch } from 'models/Hook';

interface SettingsWrapperProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  card: ICard;
  onCofirm: () => void;
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
export const SettingsWrapper = ({
  children,
  className,
  open,
  onClose,
  card,
  onCofirm
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
    dispatch(switchModal(false));
    onCofirm();
  }

  return (
    <Portal>
      <AnimatePresence>
        <motion.div
          className={classNames(cls.settingsWrapper, mods, [theme, className])}
          layoutId={`card-${card.id}`}
          transition={{
            // duration: 0.25 
            type: "spring",
            stiffness: 400,
            damping: 30
          }}
        >
          <span className={cls.blur}></span>
          <div className={cls.header}>
            <Button theme='clear' className={cls.button} onClick={onCloseHandler}>
              <BackIcon />
            </Button>
            <h2 className={cls.title}>{card.config.name}</h2>
            <Button theme='clear' className={cls.otherButton} onClick={onConfirmHandler}>
              <CheckIcon />
            </Button>
          </div>
          <div className={cls.content}>
            {children}
          </div>

        </motion.div>
      </AnimatePresence>
    </Portal>
  );
}