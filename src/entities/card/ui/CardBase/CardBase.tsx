import { motion } from "motion/react";
import React from 'react';
import { classNames } from "shared/lib/classNames";
import { Badge } from 'shared/ui/Badge';
import cls from './CardBase.module.sass';

interface CardBaseProps {
  children: React.ReactNode;
  className?: string;
  cardId: string;
  flexBasis?: string;
  header?: string;
  badge?: string;
  indication?: boolean;
  onToggle?: () => void;
  icon?: React.ReactNode;
  subheader?: string;
  indicationState?: boolean;
}
export const CardBase = React.memo(({
  children,
  className,
  cardId,
  flexBasis,
  header,
  badge,
  indication,
  onToggle,
  icon,
  subheader,
  indicationState
}: CardBaseProps) => {
  return (
    <motion.div
      // layoutId={`card-${cardId}`}
      className={classNames(cls.cardBase, {}, [className])}
      onClick={onToggle}
    // style={{ flexBasis: flexBasis }}
    // transition={{
    //   // duration: 0.15
    //   type: "spring",
    //   stiffness: 600,
    //   damping: 40
    // }}
    >
      <div className={cls.header}>
        <div className={cls.headerLeft}>
          <div className={cls.icon}>{icon}</div>
          <div className={cls.title}>
            <h3>{header}</h3>
            <p>{subheader}</p>
          </div>
        </div>
        <Badge theme='outline' color='light-gray'><div className={cls.indicator}>{indication && (indicationState ? <span className={cls.dot} /> : <span className={cls.off} />)} {badge}</div></Badge>
      </div>
      {children}

    </motion.div>
  );
})