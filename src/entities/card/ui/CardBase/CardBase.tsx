import cls from './CardBase.module.sass';
import { classNames } from "shared/lib/classNames";
import { motion } from "motion/react";
import { ICard } from 'entities/card/model/types';
import React from 'react';

interface CardBaseProps {
  children: React.ReactNode;
  className?: string;
  cardId: string;
  flexBasis?: string;
}
export const CardBase = React.memo(({
  children,
  className,
  cardId,
  flexBasis = "calc(50% - 10px)"
}: CardBaseProps) => {
  return (
    <motion.div
      layoutId={`card-${cardId}`}
      className={classNames(cls.cardBase, {}, [className])}
      style={{ flexBasis: flexBasis }}
      transition={{
        // duration: 0.15
        type: "spring",
        stiffness: 600,
        damping: 40
      }}
    >
      {children}
    </motion.div>
  );
})