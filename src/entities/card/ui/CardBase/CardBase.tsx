import cls from './CardBase.module.sass';
import { classNames } from "shared/lib/classNames";
import { motion } from 'framer-motion';
import { ICard } from 'entities/card/model/types';

interface CardBaseProps {
  children: React.ReactNode;
  className?: string;
  cardId: string;
  flexBasis?: string;
}
export const CardBase = ({
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
        // duration: 0.25
        type: "spring",
        stiffness: 400,
        damping: 30
      }}
    >
      {children}
    </motion.div>
  );
}