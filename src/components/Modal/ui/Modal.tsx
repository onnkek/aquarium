import cls from './Modal.module.sass';
import { MutableRefObject, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { Portal } from '../../Portal';
import { Mods, classNames } from 'helpers/classNames';
import { ReactComponent as XIcon } from 'assets/icons/x.svg';
import { ReactComponent as CirclesBG } from 'assets/icons/bg-circles-s.svg';
import { ReactComponent as GridBG } from 'assets/icons/bg-grid-s.svg';
import { ReactComponent as GridDotBG } from 'assets/icons/bg-grid-dot-s.svg';
import { ReactComponent as SquaresBG } from 'assets/icons/bg-squares-s.svg';
import { Button } from 'components/Button';
import { useTheme } from 'helpers/ThemeProvider/lib/useTheme';

type ModalIconColor = 'green' | 'red' | 'save' | 'purple' | 'default' | 'none';
type ModalBGWrapper = 'circles' | 'grid' | 'grid-dot' | 'squares' | 'none';

interface ModalProps {
  className?: string;
  children?: ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
  lazy?: boolean;
  Icon?: React.VFC<React.SVGProps<SVGSVGElement>>;
  iconColor?: ModalIconColor;
  bgWrapper?: ModalBGWrapper;
}

const colorClasses: Record<ModalIconColor, string> = {
  green: cls.green,
  red: cls.red,
  save: cls.save,
  purple: cls.purple,
  default: cls.default,
  none: cls.none
};
// const ANIMATION_DELAY = 300;

export const Modal = ({ className, children, isOpen, lazy, onClose, Icon, iconColor = 'none', bgWrapper = 'none' }: ModalProps) => {

  const [isClosing, setIsClosing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const timerRef = useRef() as MutableRefObject<ReturnType<typeof setTimeout>>;
  const { theme } = useTheme();
  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
    }
  }, [isOpen]);

  const closeHandler = useCallback(() => {
    if (onClose) {
      setIsClosing(true);
      // timerRef.current = setTimeout(() => {
      onClose();
      setIsClosing(false);
      // }, ANIMATION_DELAY);
    }
  }, [onClose]);

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeHandler();
    }
  }, [closeHandler]);

  const onContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  useEffect(() => {

    if (isOpen) {
      window.addEventListener('keydown', onKeyDown);
    }

    return () => {
      clearTimeout(timerRef.current);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onKeyDown]);

  const mods: Mods = {
    [colorClasses[iconColor]]: true,
    [cls.opened]: isOpen,
    [cls.isClosing]: isClosing
  };

  if (lazy && !isMounted) {
    return null;
  }

  return (
    <Portal>
      <div className={classNames(cls.modal, mods, [className, theme])}>
        <div className={cls.overlay} onClick={closeHandler}>
          <div className={cls.content} onClick={onContentClick}>
            <div className={cls.header}>
              {Icon &&
                <div className={cls.iconWrapper}>
                  <Icon className={cls.icon} />
                </div>
              }
              {bgWrapper === 'circles' && <CirclesBG className={cls.wrapper} />}
              {bgWrapper === 'grid' && <GridBG className={cls.wrapper} />}
              {bgWrapper === 'grid-dot' && <GridDotBG className={cls.wrapper} />}
              {bgWrapper === 'squares' && <SquaresBG className={cls.wrapper} />}
              {<Button onClick={closeHandler} className={cls.close} theme='clear'>
                <XIcon />
              </Button>}
            </div>
            <div className={cls.body}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};