import cls from './[FTName].module.sass';
import { useTranslation } from 'react-i18next';
import { classNames } from 'shared/lib/classNames/classNames';

export interface [FTName]Props {
  className?: string;
}

export const [FTName] = ({ className }: [FTName]Props) => {
  const { t } = useTranslation();

  return (
    <div className={classNames(cls.[FTName | camelcase], {}, [className])}>

    </div>
  );
};