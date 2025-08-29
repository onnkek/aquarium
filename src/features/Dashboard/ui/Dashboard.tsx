import { IConfig, ICurrentInfo } from 'redux/AquariumSlice';
import cls from './Dashboard.module.sass';
import { classNames } from "shared/lib/classNames";
import { mapConfigToCards } from 'entities/card/lib/mapper';
import { CardList } from 'entities/card/ui/CardList/CardList';

interface DashboardProps {
  config: IConfig;
  current: ICurrentInfo;
  className?: string;
}

export const Dashboard = ({
  className,
  config,
  current
}: DashboardProps) => {
  const cards = mapConfigToCards(config, current);


  return (
    <div className={classNames(cls.dashboard, {}, [className])}>
      <CardList cards={cards} />
    </div>
  );
}