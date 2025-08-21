import cls from './Modal.module.sass';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { Mods, classNames } from 'shared/lib/classNames';
import { ReactComponent as XIcon } from 'shared/assets/icons/x.svg';
import { ReactComponent as CirclesBG } from 'shared/assets/icons/bg-circles-s.svg';
import { ReactComponent as GridBG } from 'shared/assets/icons/bg-grid-s.svg';
import { ReactComponent as GridDotBG } from 'shared/assets/icons/bg-grid-dot-s.svg';
import { ReactComponent as SquaresBG } from 'shared/assets/icons/bg-squares-s.svg';
import { Button } from 'shared/ui/Button';
import { Portal } from 'shared/ui/Portal';
import { useTheme } from 'app/providers/ThemeProvider/lib/useTheme';

type ModalIconColor = 'green' | 'red' | 'save' | 'purple' | 'default' | 'none';
type ModalBGWrapper = 'circles' | 'grid' | 'grid-dot' | 'squares' | 'none';
type ModalStyle = 'default' | 'none';

interface ModalProps {
  className?: string;
  children?: ReactNode;
  isOpen?: boolean;
  onClose: () => void;
  lazy?: boolean;
  Icon?: React.VFC<React.SVGProps<SVGSVGElement>>;
  iconColor?: ModalIconColor;
  bgWrapper?: ModalBGWrapper;
  modalStyle?: ModalStyle;
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

export const Modal = ({ className, children, isOpen, lazy, onClose, Icon, iconColor = 'none', bgWrapper = 'none', modalStyle = 'default' }: ModalProps) => {

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



  const mods: Mods = {
    [colorClasses[iconColor]]: true,
    [styleClasses[modalStyle]]: true
  };

  return (
    <Portal>
      <div className={classNames(cls.modal, mods, [className, theme])} >

        <div className={cls.overlay} onClick={startClosing}>

          <div className={classNames(cls.content, {}, [isClosing ? cls.close : cls.open])} onClick={onContentClick} onAnimationEnd={handleAnimationEnd}>


            {modalStyle === 'none' || <div className={cls.header}>
              {Icon &&
                <div className={cls.iconWrapper}>
                  <Icon className={cls.icon} />
                </div>
              }
              {bgWrapper === 'circles' && <CirclesBG className={cls.wrapper} />}
              {bgWrapper === 'grid' && <GridBG className={cls.wrapper} />}
              {bgWrapper === 'grid-dot' && <GridDotBG className={cls.wrapper} />}
              {bgWrapper === 'squares' && <SquaresBG className={cls.wrapper} />}
              <Button onClick={startClosing} className={cls.close} theme='clear'>
                <XIcon />
              </Button>
            </div>}
            <div className={cls.body}>
              {children}
            </div>

          </div>
        </div>
      </div>
    </Portal>
  );
};