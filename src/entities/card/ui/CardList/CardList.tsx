import { ICard } from '../../model/types';
import cls from './CardList.module.sass';
import { classNames } from "shared/lib/classNames";
import { RelayCard } from '../RelayCard/RelayCard';
import { TempCard } from '../TempCard/TempCard';
import { ArgbCard } from '../ArgbCard/ArgbCard';
import { PumpCard } from '../PumpCard/PumpCard';

interface CardListProps {
  cards: ICard[];
  className?: string;
}

export const CardList = ({ cards, className }: CardListProps) => {
  return (
    <div className={classNames(cls.cardList, {}, [className])}>
      {cards.map((card, index) => {
        switch (card.type) {
          case "relay":
            return <RelayCard card={card} />
          case "temp":
            return <TempCard card={card} />
          case "argb":
            return <ArgbCard card={card} />
          case "pump":
            return <PumpCard card={card} />
        }
      })}
    </div>
  );
}