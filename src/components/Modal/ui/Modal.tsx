import cls from './Modal.module.sass';
import { MutableRefObject, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { Mods, classNames } from 'helpers/classNames';
import { ReactComponent as XIcon } from 'assets/icons/x.svg';
import { ReactComponent as CirclesBG } from 'assets/icons/bg-circles-s.svg';
import { ReactComponent as GridBG } from 'assets/icons/bg-grid-s.svg';
import { ReactComponent as GridDotBG } from 'assets/icons/bg-grid-dot-s.svg';
import { ReactComponent as SquaresBG } from 'assets/icons/bg-squares-s.svg';
import { Button } from 'components/Button';
import { useTheme } from 'helpers/ThemeProvider/lib/useTheme';
import { Portal } from 'components/Portal';

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
  style?: ModalStyle;
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

export const Modal = ({ className, children, isOpen, lazy, onClose, Icon, iconColor = 'none', bgWrapper = 'none', style = 'default' }: ModalProps) => {

  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const [overflow, setOverflow] = useState(document.body.style.overflow)

  const timerRef = useRef() as MutableRefObject<ReturnType<typeof setTimeout>>
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
      clearTimeout(timerRef.current);
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
    [styleClasses[style]]: true
  };

  return (
    <Portal>
      <div className={classNames(cls.modal, mods, [className, theme])} >

        <div className={cls.overlay} onClick={startClosing}>

          <div className={classNames(cls.content, {}, [isClosing ? cls.close : cls.open])} onClick={onContentClick} onAnimationEnd={handleAnimationEnd}>


            {style === 'none' || <div className={cls.header}>
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