import cls from './SettingsWrapper.module.sass';
import { classNames } from "shared/lib/classNames";
import { AnimatePresence, motion } from "framer-motion"
import { Button } from 'shared/ui/Button';
import { ICard } from 'entities/card/model/types';
import { ReactComponent as BackIcon } from 'shared/assets/icons/aquarium/back.svg'
import { ReactComponent as CheckIcon } from 'shared/assets/icons/aquarium/check.svg'

interface SettingsWrapperProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  card: ICard;
  onCofirm?: () => void;
}

export const SettingsWrapper = ({
  children,
  className,
  open,
  onClose,
  card,
  onCofirm
}: SettingsWrapperProps) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={classNames(cls.settingsWrapper, {}, [className])}
          layoutId={`card-${card.id}`}
          transition={{
            // duration: 0.25 
            type: "spring",
            stiffness: 400,
            damping: 30
          }}
        >
          <div className={cls.header}>
            <Button theme='clear' className={cls.button} onClick={onClose}>
              <BackIcon />
            </Button>
            <h2 className={cls.title}>{card.config.name}</h2>
            <Button theme='clear' className={cls.otherButton} onClick={onCofirm}>
              <CheckIcon />
            </Button>
          </div>

          {children}
        </motion.div>
      )}
    </AnimatePresence>

  );
}