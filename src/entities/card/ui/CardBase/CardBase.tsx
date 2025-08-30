import cls from './CardBase.module.sass';
import { classNames } from "shared/lib/classNames";
import { motion } from 'framer-motion';
import { ICard } from 'entities/card/model/types';

interface CardBaseProps {
  children: React.ReactNode;
  className?: string;
  cardId: string;
}
console.log("test")
export const CardBase = ({
  children,
  className,
  cardId
}: CardBaseProps) => {
  return (
    <motion.div
      layoutId={`card-${cardId}`}
      className={classNames(cls.cardBase, {}, [className])}
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