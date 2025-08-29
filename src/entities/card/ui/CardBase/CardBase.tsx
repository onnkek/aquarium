import cls from './CardBase.module.sass';
import { classNames } from "shared/lib/classNames";

interface CardBaseProps {
  children: React.ReactNode;
  className?: string;
}

export const CardBase = ({
  children,
  className
}: CardBaseProps) => {
  return (
    <div className={classNames(cls.cardBase, {}, [className])}>
      {children}
    </div>
  );
}