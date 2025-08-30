import { IConfig, ICurrentInfo } from 'redux/AquariumSlice';
import cls from './Dashboard.module.sass';
import { classNames } from "shared/lib/classNames";
import { mapConfigToCards } from 'entities/card/lib/mapper';
import { RelayCard } from 'entities/card/ui/RelayCard';
import { TempCard } from 'entities/card/ui/TempCard';
import { ArgbCard } from 'entities/card/ui/ArgbCard';
import { PumpCard } from 'entities/card/ui/PumpCard';
import { RelaySettings } from 'features/CardSettings/RelaySettings';
import { TempSettings } from 'features/CardSettings/TempSettings';
import { ArgbSettings } from 'features/CardSettings/ArgbSettings';
import { PumpSettings } from 'features/CardSettings/PumpSettings';
import React, { useState } from 'react';

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
  const [openCardId, setOpenCardId] = useState<string | null>(null);
  const toggleCard = (id: string) => setOpenCardId(prev => (prev === id ? null : id));

  return (
    <div className={classNames(cls.dashboard, {}, [className])}>
      <div className={cls.cardList}>
        {cards.map((card) => {
          const open = openCardId === card.id;

          switch (card.type) {
            case "relay":
              return (
                <React.Fragment key={card.id}>
                  <RelayCard card={card} onToggle={() => toggleCard(card.id)} />
                  <RelaySettings card={card} open={open} onClose={() => setOpenCardId(null)} />
                </React.Fragment>
              )
            case "temp":
              return (
                <React.Fragment key={card.id}>
                  <TempCard card={card} onToggle={() => toggleCard(card.id)} />
                  <TempSettings card={card} open={open} onClose={() => setOpenCardId(null)} />
                </React.Fragment>
              )
            case "argb":
              return (
                <React.Fragment key={card.id}>
                  <ArgbCard card={card} onToggle={() => toggleCard(card.id)} />
                  <ArgbSettings card={card} open={open} onClose={() => setOpenCardId(null)} />
                </React.Fragment>
              )
            case "pump":
              return (
                <React.Fragment key={card.id}>
                  <PumpCard card={card} onToggle={() => toggleCard(card.id)} />
                  <PumpSettings card={card} open={open} onClose={() => setOpenCardId(null)} />
                </React.Fragment>
              )
          }
        })}
      </div>
    </div>
  );
}