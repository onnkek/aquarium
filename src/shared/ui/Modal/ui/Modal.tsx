import { useTheme } from 'app/providers/ThemeProvider/lib/useTheme';
import { useAppDispatch } from 'models/Hook';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { switchModal } from 'redux/AquariumSlice';
import { ReactComponent as BackIcon } from 'shared/assets/icons/aquarium/back.svg';
import { ReactComponent as CheckIcon } from 'shared/assets/icons/aquarium/check.svg';
import { Mods, classNames } from 'shared/lib/classNames';
import { Button } from 'shared/ui/Button';
import { Portal } from 'shared/ui/Portal';
import cls from './Modal.module.sass';

type ModalIconColor = 'green' | 'red' | 'save' | 'purple' | 'default' | 'none';
type ModalBGWrapper = 'circles' | 'grid' | 'grid-dot' | 'squares' | 'none';
type ModalStyle = 'default' | 'none';

interface ModalProps {
  className?: string;
  children?: ReactNode;
  isOpen?: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  lazy?: boolean;
  Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  iconColor?: ModalIconColor;
  bgWrapper?: ModalBGWrapper;
  modalStyle?: ModalStyle;
  headerText: string;
  isValid?: boolean
}

const colorClasses: Record<ModalIconColor, string> = {
  green: cls.green,
  red: cls.red,
  save: cls.save,
  purple: cls.purple,
  default: cls.default,
  none: cls.none
};
const styleClasses: Record<ModalStyle, string> = {
  default: cls.default,
  none: cls.none
};
// const ANIMATION_DELAY = 300;

export const Modal = ({
  className,
  children,
  isOpen,
  lazy,
  onClose,
  onConfirm,
  Icon,
  iconColor = 'none',
  bgWrapper = 'none',
  modalStyle = 'default',
  headerText,
  isValid = true
}: ModalProps) => {
  const dispatch = useAppDispatch()
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const [overflow, setOverflow] = useState(document.body.style.overflow)

  const { theme } = useTheme();


  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsClosing(false);
    } else if (isVisible && !isClosing) {
      setIsClosing(true);
    }
  }, [isOpen]);

  const startClosing = () => {
    dispatch(switchModal(false));
    if (!isClosing) setIsClosing(true);
  };

  const handleAnimationEnd = () => {
    if (isClosing) {
      setIsVisible(false)
      onClose();
      document.body.style.overflow = overflow
    }
  };
  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      startClosing();
    }
  }, [startClosing]);

  const onContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  useEffect(() => {

    if (isOpen) {
      window.addEventListener('keydown', onKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onKeyDown]);

  useEffect(() => {
    setOverflow(document.body.style.overflow)
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = overflow
    }
    return () => {
      document.body.style.overflow = overflow
    };

  }, [isOpen]);

  if (!isVisible) return null

  const onConfirmHandler = () => {
    if (onConfirm) {
      if (headerText !== "System") {
        dispatch(switchModal(false));
      }
      onConfirm();
    }
  }

  const mods: Mods = {
    [colorClasses[iconColor]]: true,
    [styleClasses[modalStyle]]: true
  };
  return (
    <Portal>
      <div className={classNames(cls.modal, mods, [theme])} >
        <div className={cls.overlay} onClick={startClosing}>
          <div className={classNames(cls.content, {}, [isClosing ? cls.close : cls.open, className])} onClick={onContentClick} onAnimationEnd={handleAnimationEnd}>
            <span className={cls.blur}></span>
            <div className={cls.header}>

              <Button theme='clear' className={cls.button} onClick={startClosing}>
                <BackIcon /><span>x</span>
              </Button>
              <div className={cls.titleWrap}>
                <h2 className={cls.title}>{headerText}</h2>
                <p className={cls.subtitle}>Configure the pump mode, schedule, dosage, and volume values in a desktop-friendly modal window.</p>
              </div>

              <div className={cls.other}>
                <Button theme='clear' className={classNames(cls.otherButton, { }, [])} disabled={!isValid} onClick={onConfirmHandler}>
                  <CheckIcon />
                </Button>
              </div>

            </div>
            <div className={cls.body}>
              {children}
            </div>
            <div className={cls.footer}>
              <button type="button" className="btn btn-secondary" onClick={startClosing}>Close</button>
              <button type="button" className="btn btn-primary" onClick={onConfirmHandler}>Save changes</button>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};