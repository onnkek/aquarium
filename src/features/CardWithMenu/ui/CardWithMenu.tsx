import { useLongPress } from "@react-aria/interactions";
import { useAppDispatch } from "models/Hook";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ReactComponent as ArchiveIcon } from "shared/assets/icons/aquarium/archive.svg";
import { ReactComponent as ResetIcon } from "shared/assets/icons/aquarium/arrow-clockwise.svg";
import { ReactComponent as EditIcon } from "shared/assets/icons/aquarium/edit.svg";
import { ReactComponent as RemoveIcon } from "shared/assets/icons/aquarium/trash.svg";
import { useBodyScrollLock } from "shared/lib/useBodyScrollLock";
import cls from "./CardWithMenu.module.sass";

interface CardWithMenuProps {
  children: React.ReactNode;
  onEdit?: () => void;
  onArchive?: () => void;
  onRemove?: () => void;
  isArchived?: boolean;
}

export const CardWithMenu = ({
  children,
  onEdit,
  onArchive,
  onRemove,
  isArchived = false,
}: CardWithMenuProps) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isMenuClosing, setIsMenuClosing] = useState(false);
  const [cardOffset, setCardOffset] = useState<number>(0);
  const [menuPosition, setMenuPosition] = useState<React.CSSProperties>({});
  const cardRef = useRef<HTMLDivElement>(null);
  const isInteractingRef = useRef(false);
  console.log("RENDER")
  // const isMenuVisible = useAppSelector(state => state.products.isModal)
  const dispatch = useAppDispatch();

  // const setIsMenuVisible = (visible: boolean) => {

  //   dispatch(setModal(visible));
  // }

  // Включаем блокировку, если меню видно
  useBodyScrollLock(isMenuVisible);
  const { longPressProps } = useLongPress({
    onLongPress: () => {
      if (!isMenuVisible && !isInteractingRef.current) {
        openMenu();
      }
    },
    threshold: 300,
  });

  const openMenu = useCallback(() => {
    if (isMenuVisible || isInteractingRef.current) return;
    isInteractingRef.current = true;

    
    // dispatch(setModal(true));
    setIsMenuVisible(true);
    setIsMenuClosing(false);
  }, [isMenuVisible]);

  const closeMenu = useCallback(() => {
    if (isMenuClosing || !isMenuVisible) return;

    setIsMenuClosing(true);

    setTimeout(() => {
      // dispatch(setModal(false));
      setIsMenuVisible(false);
      setIsMenuClosing(false);
      setCardOffset(0);
      setMenuPosition({});
      isInteractingRef.current = false;
      
    }, 100);
  }, [isMenuVisible, isMenuClosing]);

  const preventContextMenu = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
  };

  // Блокируем long press когда меню открыто
  const longPressPropsSafe = isMenuVisible ? {} : longPressProps;



  useEffect(() => {
    if (!isMenuVisible || isMenuClosing || !cardRef.current) return;

    const cardRect = cardRef.current.getBoundingClientRect();
    const menuHeight = 240;
    const navbarHeight = 80;
    const availableBelow = window.innerHeight - cardRect.bottom - navbarHeight;
    const offsetTop = availableBelow < menuHeight ? -(menuHeight - availableBelow) : 0;

    setCardOffset(offsetTop);
    setMenuPosition({
      top: `${cardRect.bottom + offsetTop}px`,
      right: `${window.innerWidth - cardRect.right}px`,
    });
  }, [isMenuVisible, isMenuClosing]);

  const cardStyle: React.CSSProperties = {
    "--card-offset": `${cardOffset}px`,
  } as React.CSSProperties;

  const Menu = () => {
    const menuClass = [
      cls.menu,
      cls.alignCenter,
      cls.below,
      cls.ready,
      isMenuClosing ? cls.closing : "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        className={`${cls.backdrop} ${isMenuClosing ? cls.closing : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          closeMenu();
        }}
        onContextMenu={preventContextMenu}
        onMouseDown={preventContextMenu}
      >
        <div
          className={menuClass}
          style={menuPosition}
          onClick={(e) => e.stopPropagation()}
          onContextMenu={preventContextMenu}
        >
          {onEdit && (
            <button
              className={`${cls.menuItem} ${cls.edit}`}
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.();
                closeMenu();
              }}
              onContextMenu={preventContextMenu}
            >
              <EditIcon />
              Изменить
            </button>
          )}

          {onArchive && (
            <button
              className={`${cls.menuItem} ${cls.edit}`}
              onClick={(e) => {
                e.stopPropagation();
                onArchive?.();
                closeMenu();
              }}
              onContextMenu={preventContextMenu}
            >
              {isArchived ? <ResetIcon /> : <ArchiveIcon />}
              {isArchived ? "Восстановить" : "В архив"}
            </button>
          )}

          <div className={cls.divider} />

          {onRemove && (
            <button
              className={`${cls.menuItem} ${cls.delete}`}
              onClick={(e) => {
                e.stopPropagation();
                onRemove?.();
                closeMenu();
              }}
              onContextMenu={preventContextMenu}
            >
              <RemoveIcon />
              Удалить
            </button>
          )}
        </div>
      </div>
    );
  };

  const isCardActive = isMenuVisible && !isMenuClosing;
  const isCardClosing = isMenuClosing;

  return (
    <>
      <div
        {...longPressPropsSafe}
        className={`${cls.card} ${isCardActive ? cls.menuOpen : ""} ${isCardClosing ? cls.cardClosing : ""}`}
        ref={cardRef}
        style={cardStyle}
        onContextMenu={preventContextMenu}
      >
        {children}
      </div>
      {isMenuVisible && <Menu />}
    </>
  );
};