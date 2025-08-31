import { classNames } from "shared/lib/classNames";
import cls from './DashboardPage.module.sass';
import { useAppDispatch, useAppSelector } from "models/Hook";
import { Status } from "models/Status";
import React, { useEffect, useState } from "react";
import { getConfig, getCurrentInfo, switchModal } from "../../../redux/AquariumSlice";
import { Page } from "widgets/Page";
import BG from 'shared/assets/img/bg4.jpg';
import { RelayCard } from "entities/card/ui/RelayCard";
import { TempCard } from "entities/card/ui/TempCard";
import { ArgbCard } from "entities/card/ui/ArgbCard";
import { PumpCard } from "entities/card/ui/PumpCard";
import { ICard } from "entities/card/model/types";
import { TempSettings } from "features/CardSettings/TempSettings";
import { RelaySettings } from "features/CardSettings/RelaySettings";
import { ArgbSettings } from "features/CardSettings/ArgbSettings";
import { PumpSettings } from "features/CardSettings/PumpSettings";
import { mapConfigToCards } from "entities/card/lib/mapper";
import { Navbar } from "widgets/Navbar";
import { ServerCard } from "entities/card/ui/ServerCard";
import { SystemCard } from "entities/card/ui/SystemCard";
import { SystemSettings } from "features/CardSettings/SystemSettings";

export interface DashboardPageProps {
  className?: string;
}

export const DashboardPage = ({ className }: DashboardPageProps) => {
  const dispatch = useAppDispatch()
  const system = useAppSelector(state => state.aquarium.config.system)
  const openModal = useAppSelector(state => state.aquarium.modal)
  const updateStatus = useAppSelector(state => state.aquarium.updateStatus)
  const config = useAppSelector(state => state.aquarium.config)
  const current = useAppSelector(state => state.aquarium.currentInfo)
  const currentInfo = useAppSelector(state => state.aquarium.currentInfo)
  const [selectCard, setSelectCard] = useState<ICard | null>(null);
  const cards = mapConfigToCards(config, current);

  useEffect(() => {
    dispatch(getCurrentInfo())
    dispatch(getConfig())
  }, [dispatch])

  useEffect(() => {
    if (updateStatus === Status.Succeeded && system.update > 0 && !openModal) {

      const interval = setInterval(() => {
        dispatch(getCurrentInfo())
      }, 1000 * system.update)

      return () => clearInterval(interval);
    }

  }, [updateStatus, system.update, dispatch, openModal])

  const onOpenCard = (card: ICard) => {
    setSelectCard(card);
    dispatch(switchModal(true));
  }

  const getCardComponent = (card: ICard) => {
    switch (card.type) {
      case "server": return <ServerCard card={card} onToggle={() => onOpenCard(card)} />
      case "system": return <SystemCard card={card} onToggle={() => onOpenCard(card)} />
      case "relay": return <RelayCard card={card} onToggle={() => onOpenCard(card)} />
      case "temp": return <TempCard card={card} onToggle={() => onOpenCard(card)} />
      case "argb": return <ArgbCard card={card} onToggle={() => onOpenCard(card)} />
      case "pump": return <PumpCard card={card} onToggle={() => onOpenCard(card)} />
    }
  }
  const getSettingsComponent = (card: ICard) => {
    switch (card.type) {
      case "system": return <SystemSettings open={true} card={card} onClose={() => setSelectCard(null)} />
      case "relay": return <RelaySettings open={true} card={card} onClose={() => setSelectCard(null)} />
      case "temp": return <TempSettings open={true} card={card} onClose={() => setSelectCard(null)} />
      case "argb": return <ArgbSettings open={true} card={card} onClose={() => setSelectCard(null)} />
      case "pump": return <PumpSettings open={true} card={card} onClose={() => setSelectCard(null)} />
    }
  }

  return (
    <Page className={classNames(cls.dashboardPage, {}, [className])}>
      <img className={cls.background} src={BG}></img>
      <div className={cls.dashboardContent}>
        {cards.map(card => (
          <React.Fragment key={card.id}>
            {getCardComponent(card)}
          </React.Fragment>
        ))}
      </div>
      <Navbar />
      {selectCard && getSettingsComponent(selectCard)}
    </Page>
  );
};
