import { classNames } from "shared/lib/classNames";
import cls from './Page.module.sass';
import { ReactNode } from "react";

export interface PageProps {
  className?: string;
  children?: ReactNode;
}

export const Page = ({ className, children }: PageProps) => {

  return (
    <main className={classNames(cls.page, {}, [className])}>
      {children}
    </main>
  );
};