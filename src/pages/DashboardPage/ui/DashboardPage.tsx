import { mapConfigToCards } from "entities/card/lib/mapper";
import { ICard } from "entities/card/model/types";
import { ArgbCard } from "entities/card/ui/ArgbCard";
import { CardBase } from "entities/card/ui/CardBase";
import { PumpCard } from "entities/card/ui/PumpCard";
import { RelayCard } from "entities/card/ui/RelayCard";
import { ServerCard } from "entities/card/ui/ServerCard";
import { SystemCard } from "entities/card/ui/SystemCard";
import { TempCard } from "entities/card/ui/TempCard";
import { ArgbSettings } from "features/CardSettings/ArgbSettings";
import { PumpSettings } from "features/CardSettings/PumpSettings";
import { RelaySettings } from "features/CardSettings/RelaySettings";
import { ServerSettings } from "features/CardSettings/ServerSettings";
import { TempSettings } from "features/CardSettings/TempSettings";
import { FertCalc } from "features/FertCalc";
import { useAppDispatch, useAppSelector } from "models/Hook";
import { Status } from "models/Status";
import React, { useEffect, useMemo, useState } from "react";
import { ReactComponent as DoserIcon } from 'shared/assets/icons/aquarium/doser.svg';
import { classNames } from "shared/lib/classNames";
import { Page } from "widgets/Page";
import { getConfig, getCurrentInfo, switchModal } from "../../../redux/AquariumSlice";
import cls from './DashboardPage.module.sass';

export interface DashboardPageProps {
  className?: string;
}

export const DashboardPage = ({ className }: DashboardPageProps) => {
  const dispatch = useAppDispatch()
  const system = useAppSelector(state => state.aquarium.config.system)
  const openModal = useAppSelector(state => state.aquarium.modal)
  const updateStatus = useAppSelector(state => state.aquarium.updateStatus)
  const config = useAppSelector(state => state.aquarium.config)
  const doserState = useAppSelector(state => state.aquarium.doserState)
  const current = useAppSelector(state => state.aquarium.currentInfo)
  const safety = useAppSelector(state => state.aquarium.safety)
  const [selectCard, setSelectCard] = useState<ICard | null>(null);
  const cards = mapConfigToCards(config, current, doserState);
  const [now, setNow] = useState(Date.now());
  const [lastHeartbeatReceivedAt, setLastHeartbeatReceivedAt] = useState<number>(0);
  const [openCalc, setOpenCalc] = useState(false);
  const hasEmergencyOverride = safety.emergencyOverride && !safety.emergencyMode;

  useEffect(() => {
    dispatch(getCurrentInfo())
    if (current.system.time) {
      setLastHeartbeatReceivedAt(Date.now());
    }
    dispatch(getConfig())
  }, [dispatch])

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const online = lastHeartbeatReceivedAt !== null &&
    now - lastHeartbeatReceivedAt <= config.system.update * 1000 * 2;

  useEffect(() => {
    if (updateStatus === Status.Succeeded && system.update > 0 && !openModal) {

      const interval = setInterval(() => {
        dispatch(getCurrentInfo())
        if (current.system.time) {
          setLastHeartbeatReceivedAt(Date.now());
        }
      }, 1000 * system.update)

      return () => clearInterval(interval);
    }

  }, [updateStatus, system.update, dispatch, openModal])

  const handleOpenCard = (card: ICard) => {
	return (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation()

		setSelectCard(card)

		if (card.type !== "server" && card.type !== "system") {
			dispatch(switchModal(true))
		}
	}
}

  const mappedCard = useMemo(() => {
    if (!selectCard) return;
    const cards = mapConfigToCards(config, current, doserState);
    return cards.find(card => card.id === selectCard.id);
  }, [config, current, doserState, selectCard?.id])

  const getCardComponent = (card: ICard) => {
    const onToggle = handleOpenCard(card)
    switch (card.type) {
      case "server": return <ServerCard className={cls.server} card={card} onToggle={onToggle} />
      case "system": return <SystemCard indicationState={online} className={cls.system} card={card} onToggle={onToggle} />
      case "relay": return <RelayCard className={cls.relay} card={card} onToggle={onToggle} />
      case "temp": return <TempCard className={cls.temp} card={card} onToggle={onToggle} />
      case "argb": return <ArgbCard className={cls.argb} card={card} onToggle={onToggle} />
      case "pump": return <PumpCard className={cls.pump} card={card} onToggle={onToggle} />
    }
  }
  const getSettingsComponent = (card: ICard) => {
    switch (card!.type) {
      case "pump": return <PumpSettings open={true} card={card} onClose={() => setSelectCard(null)} />
      case "server": return <ServerSettings open={true} card={card} onClose={() => setSelectCard(null)} />
      case "system": return <ServerSettings open={true} card={card} onClose={() => setSelectCard(null)} />
      case "relay": return <RelaySettings open={true} card={card} onClose={() => setSelectCard(null)} />
      case "temp": return <TempSettings open={true} card={card} onClose={() => setSelectCard(null)} />
      case "argb": return <ArgbSettings open={true} card={card} onClose={() => setSelectCard(null)} />

    }
  }
  console.log(online)
  return (
    <Page className={classNames(cls.dashboardPage, { [cls.emergency]: safety.emergencyMode, [cls.override]: hasEmergencyOverride }, [className])}>

      <section className={cls.content}>
        <div className={cls.wrapper}>
          {safety.emergencyMode && (
            <div className={cls.emergencyBanner}>
              <strong>Emergency mode active</strong>
              <span>{safety.activeReasons?.length ? safety.activeReasons.join(", ") : "Aquarium is running in safety policy mode"}</span>
            </div>
          )}

          {hasEmergencyOverride && (
            <div className={`${cls.emergencyBanner} ${cls.overrideBanner}`}>
              <strong>Emergency override active</strong>
              <span>{safety.activeReasons?.length ? `Ignored: ${safety.activeReasons.join(", ")}` : "Manual override is enabled"}</span>
            </div>
          )}
          <div className={cls.grid}>

            {cards.filter(x => x.type === "system").map(card => (
              <React.Fragment key={card.id}>
                {getCardComponent(card)}
              </React.Fragment>
            ))}
            {cards.filter(x => x.type === "server").map(card => (
              <React.Fragment key={card.id}>
                {getCardComponent(card)}
              </React.Fragment>
            ))}

            {cards.filter(x => x.type === "relay").map(card => (
              <React.Fragment key={card.id}>
                {getCardComponent(card)}
              </React.Fragment>
            ))}

            {cards.filter(x => x.type === "argb" || x.type === "temp").map(card => (
              <React.Fragment key={card.id}>
                {getCardComponent(card)}
              </React.Fragment>
            ))}
            <CardBase
              cardId={"1"}
              header={"Doser"}
              className={cls.span12}
              badge={"4 Channels"}
              icon={<DoserIcon className={cls.icon} />}
              onToggle={() => {setOpenCalc(true)}}
            >
              <div className={cls.section}>
                <div className={cls.pumpsRow}>
                  {cards.filter(x => x.type === "pump").map(card => (
                    <React.Fragment key={card.id}>
                      {getCardComponent(card)}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </CardBase>
          </div>
          <div className={cls.version} id="clock">Version: {__APP_VERSION__} © onnkek {new Date(Date.now()).getFullYear()}</div>
        </div>
      </section>
      {selectCard && getSettingsComponent(mappedCard!)}
      <FertCalc open={openCalc} onClose={() => setOpenCalc(false)} />
    </Page>
  );
};
