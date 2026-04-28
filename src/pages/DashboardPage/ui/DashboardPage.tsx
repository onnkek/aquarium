import { classNames } from "shared/lib/classNames";
import cls from './DashboardPage.module.sass';
import { useAppDispatch, useAppSelector } from "models/Hook";
import { Status } from "models/Status";
import React, { useEffect, useMemo, useState } from "react";
import { getConfig, getCurrentInfo, switchModal } from "../../../redux/AquariumSlice";
import { Page } from "widgets/Page";
import BG from 'shared/assets/img/bg4.jpg';
import { CardBase } from "entities/card/ui/CardBase";
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
import { ServerSettings } from "features/CardSettings/ServerSettings";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { Collapse } from "shared/ui/Collapse";
import { RelayCard } from "entities/card/ui/RelayCard";
import { ReactComponent as DoserIcon } from 'shared/assets/icons/aquarium/doser.svg';
import { getDateTimeISO } from "shared/lib/period";

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
  const [selectCard, setSelectCard] = useState<ICard | null>(null);
  const cards = mapConfigToCards(config, current);
  const [now, setNow] = useState(Date.now());
  const [lastHeartbeatReceivedAt, setLastHeartbeatReceivedAt] = useState<number>(0);

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

  const onOpenCard = (card: ICard) => {
    setSelectCard(card);
    if (card.type !== "server") {
      dispatch(switchModal(true));
    }
  }

  const mappedCard = useMemo(() => {
    if (!selectCard) return;
    const cards = mapConfigToCards(config, current);
    return cards.find(card => card.id === selectCard.id);
  }, [config, current, selectCard?.id])

  const getCardComponent = (card: ICard) => {
    switch (card.type) {
      case "server": return <ServerCard className={cls.server} card={card} onToggle={() => onOpenCard(card)} />
      case "system": return <SystemCard indicationState={online} className={cls.system} card={card} onToggle={() => onOpenCard(card)} />
      case "relay": return <RelayCard className={cls.relay} card={card} onToggle={() => onOpenCard(card)} />
      case "temp": return <TempCard className={cls.temp} card={card} onToggle={() => onOpenCard(card)} />
      case "argb": return <ArgbCard className={cls.argb} card={card} onToggle={() => onOpenCard(card)} />
      case "pump": return <PumpCard className={cls.pump} card={card} onToggle={() => onOpenCard(card)} />
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
    <Page className={classNames(cls.dashboardPage, {}, [className])}>

      {/* <div className={cls.app}> */}
      {/* <aside className={cls.sidebar}>
          <div className={cls.brand}>
            <div className={cls.logo}></div>
            <div>
              <h1>Aquarium</h1>
              <p>Control Center</p>
            </div>
          </div>

          <nav className={cls.nav}>
            <a className={cls.active} href="#">Dashboard</a>
            <a href="#">Logs</a>
            <a href="#">Archive</a>
          </nav>

          <div className={cls.sidebox}>
            <span>Controller</span>
            <strong>Online</strong>
          </div>

          <div className={cls.sidebox}>
            <span>Last Update</span>
            <strong id="lastUpdate">2026-04-27 08:31:00</strong>
          </div>
        </aside> */}

      {/* <Navbar /> */}

      {/* <div className={cls.main}> */}


      <section className={cls.content}>
        <div className={cls.wrapper}>
          <div className={cls.grid}>
            {/* <div className={cls.card + " " + cls.span12}>
                <div className={cls.section}>
                  <div className={cls.kpis}>
                    <div className={cls.kpi}><span>Temperature</span><strong>24.6 °C</strong><small>Room climate</small></div>
                    <div className={cls.kpi}><span>Humidity</span><strong>51 %</strong><small>Air condition</small></div>
                    <div className={cls.kpi}><span>CO2 Active</span><strong>ON</strong><small>Auto mode</small></div>
                    <div className={cls.kpi}><span>Water Temp</span><strong>18.4 °C</strong><small>Thermostat</small></div>
                  </div>
                </div>
              </div> */}


            {/* <CardBase cardId={"1"} header={"General Data"} className={cls.span6} badge={"Live"} indication>
                <div className={cls.section + " " + cls.device}>
                  <div className={cls.pair}>
                    <div className={cls.metric}><span>Date</span><strong id="date">2026-04-27</strong></div>
                    <div className={cls.metric}><span>Time</span><strong id="time">08:31:00</strong></div>
                  </div>
                  <div className={cls.pair}>
                    <div className={cls.metric}><span>Temperature</span><strong>24.6 °C</strong></div>
                    <div className={cls.metric}><span>Humidity</span><strong>51 %</strong></div>
                  </div>
                </div>
              </CardBase> */}
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

            {/* <CardBase cardId={"1"} header={"System Card"} className={cls.span6} badge={"Hardware"}>
                <div className={cls.section + " " + cls.device}>
                  <div className={cls.pair}>
                    <div className={cls.metric}><span>Chip Temp</span><strong>43.2 °C</strong></div>
                    <div className={cls.metric}><span>Fan Speed</span><strong>2100 RPM</strong></div>
                  </div>
                  <div className={cls.pair}>
                    <div className={cls.metric}><span>SD Usage</span><strong>12.8 / 32 GB</strong></div>
                    <div className={cls.metric}><span>RAM</span><strong>78 / 320 KB</strong></div>
                  </div>
                </div>
              </CardBase> */}

            {/* <CardBase cardId={"1"} header={"CO2 System"} className={cls.span3} badge={"Relay"}>
                <div className={cls.section + " " + cls.device}>
                  <div className={cls.deviceTop}>
                    <div className={cls.deviceName}><h4>CO2 System</h4><p>Gas dosing controller</p></div>
                    <div className={cls.chips}><span className={cls.chip + " " + cls.on}>ON</span><span className={cls.chip + " " + cls.auto}>AUTO</span></div>
                  </div>
                </div>
              </CardBase> */}
            {/* <RelayCard card={cards.filter(x => x.type === "relay")[0]} onToggle={() => onOpenCard(cards.filter(x => x.type === "relay")[0])} />
              <RelayCard card={cards.filter(x => x.type === "relay")[1]} onToggle={() => onOpenCard(cards.filter(x => x.type === "relay")[1])} />
              <RelayCard card={cards.filter(x => x.type === "relay")[2]} onToggle={() => onOpenCard(cards.filter(x => x.type === "relay")[2])} />
              <RelayCard card={cards.filter(x => x.type === "relay")[3]} onToggle={() => onOpenCard(cards.filter(x => x.type === "relay")[3])} /> */}
            {cards.filter(x => x.type === "relay").map(card => (
              <React.Fragment key={card.id}>
                {getCardComponent(card)}
              </React.Fragment>
            ))}
            {/* <CardBase cardId={"1"} header={"O2 System"} className={cls.span3} badge={"Relay"}>
                <div className={cls.section + " " + cls.device}>
                  <div className={cls.deviceTop}>
                    <div className={cls.deviceName}><h4>O2 System</h4><p>Oxygen controller</p></div>
                    <div className={cls.chips}><span className={cls.chip + " " + cls.off}>OFF</span><span className={cls.chip + " " + cls.manual}>MANUAL</span></div>
                  </div>
                </div>
              </CardBase> */}
            {/* <CardBase cardId={"1"} header={"Lighting Cooling"} className={cls.span3} badge={"Relay"}>
                <div className={cls.section + " " + cls.device}>
                  <div className={cls.deviceTop}>
                    <div className={cls.deviceName}><h4>Lighting Cooling</h4><p>Light thermal control</p></div>
                    <div className={cls.chips}><span className={cls.chip + " " + cls.on}>ON</span><span className={cls.chip + " " + cls.auto}>AUTO</span></div>
                  </div>
                </div>
              </CardBase> */}
            {/* <CardBase cardId={"1"} header={"Filtration"} className={cls.span3} badge={"Relay"}>
                <div className={cls.section + " " + cls.device}>
                  <div className={cls.deviceTop}>
                    <div className={cls.deviceName}><h4>Filtration</h4><p>Circulation filtration</p></div>
                    <div className={cls.chips}><span className={cls.chip + " " + cls.on}>ON</span><span className={cls.chip + " " + cls.manual}>MANUAL</span></div>
                  </div>
                </div>
              </CardBase> */}


            {/* <CardBase cardId={"1"} header={"Water Thermostat"} className={cls.span6} badge={"Thermal"}>
                <div className={cls.section + " " + cls.device}>
                  <div className={cls.pair}>
                    <div className={cls.metric}><span>Current Temp</span><strong>18.4 °C</strong></div>
                    <div className={cls.metric}><span>Mode</span><strong>AUTO</strong></div>
                  </div>
                  <div className={cls.deviceTop}>
                    <div className={cls.deviceName}><h4>Status</h4><p>Thermostat state</p></div>
                    <div className={cls.chips}><span className={cls.chip + " " + cls.off}>OFF</span><span className={cls.chip + " " + cls.cooling}>COOLING</span><span className={cls.chip + " " + cls.heating}>HEATING</span></div>
                  </div>
                </div>
              </CardBase> */}

            {/* <TempCard card={cards.filter(x => x.type === "temp")[0]} onToggle={() => onOpenCard(cards.filter(x => x.type === "temp")[0])} /> */}

            {/* <CardBase cardId={"1"} header={"ARGB Backlight"} className={cls.span6} badge={"Lighting"}>
                <div className={cls.section + " " + cls.device}>
                  <div className={cls.deviceTop}>
                    <div className={cls.deviceName}><h4>Backlight</h4><p>Visual effect system</p></div>
                    <div className={cls.chips}><span className={cls.chip + " " + cls.on}>ON</span><span className={cls.chip + " " + cls.auto}>AUTO</span></div>
                  </div>
                  <div className={cls.deviceTop}>
                    <div className={cls.deviceName}><h4>Style</h4><p>Current profile</p></div>
                    <div className={cls.chips}><span className={cls.chip + " " + cls.static}>STATIC</span><span className={cls.chip + " " + cls.gradient}>GRADIENT</span><span className={cls.chip + " " + cls.cycle}>CYCLE</span><span className={cls.chip + " " + cls.custom}>CUSTOM</span></div>
                  </div>
                </div>
              </CardBase> */}
            {/* <ArgbCard card={cards.filter(x => x.type === "argb")[0]} onToggle={() => onOpenCard(cards.filter(x => x.type === "argb")[0])} /> */}
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
            >
              <div className={cls.section}>
                <div className={cls.pumpsRow}>
                  {/* <div className={cls.card + " " + cls.pumpCard}>
                      <div className={cls.section + " " + cls.device}>
                        <div className={cls.deviceTop}>
                          <div className={cls.deviceName}><h4>Pump 1</h4><p>ON • AUTO</p></div>
                          <div className={cls.chips}><span className={cls.chip + " " + cls.on}>ON</span><span className={cls.chip + " " + cls.auto}>AUTO</span></div>
                        </div>
                        <div className={cls.metric}>
                          <span>Added Fertilizer</span>
                          <strong>120 / 200 ml</strong>
                          <div className={cls.progress}><div className={cls.bar} style={{ width: "60%" }}></div></div>
                          <div className={cls.sub}><span>60% completed</span><span>80 ml left</span></div>
                        </div>
                        <div className={cls.metric}>
                          <span>Fertilizer Left in Tank</span>
                          <strong>780 / 1000 ml</strong>
                          <div className={cls.progress}><div className={cls.bar} style={{ width: "78%" }}></div></div>
                          <div className={cls.sub}><span>78% remaining</span><span>220 ml used</span></div>
                        </div>
                      </div>
                    </div> */}

                  {/* <div className={cls.card + " " + cls.pumpCard}>
                      <div className={cls.section + " " + cls.device}>
                        <div className={cls.deviceTop}>
                          <div className={cls.deviceName}><h4>Pump 2</h4><p>OFF • MANUAL</p></div>
                          <div className={cls.chips}><span className={cls.chip + " " + cls.off}>OFF</span><span className={cls.chip + " " + cls.manual}>MANUAL</span></div>
                        </div>
                        <div className={cls.metric}>
                          <span>Added Fertilizer</span>
                          <strong>40 / 150 ml</strong>
                          <div className={cls.progress}><div className={cls.bar} style={{ width: "26%" }}></div></div>
                          <div className={cls.sub}><span>26% completed</span><span>110 ml left</span></div>
                        </div>
                        <div className={cls.metric}>
                          <span>Fertilizer Left in Tank</span>
                          <strong>310 / 1000 ml</strong>
                          <div className={cls.progress}><div className={cls.bar} style={{ width: "31%" }}></div></div>
                          <div className={cls.sub}><span>31% remaining</span><span>690 ml used</span></div>
                        </div>
                      </div>
                    </div> */}

                  {/* <div className={cls.card + " " + cls.pumpCard}>
                      <div className={cls.section + " " + cls.device}>
                        <div className={cls.deviceTop}>
                          <div className={cls.deviceName}><h4>Pump 3</h4><p>ON • AUTO</p></div>
                          <div className={cls.chips}><span className={cls.chip + " " + cls.on}>ON</span><span className={cls.chip + " " + cls.auto}>AUTO</span></div>
                        </div>
                        <div className={cls.metric}>
                          <span>Added Fertilizer</span>
                          <strong>90 / 180 ml</strong>
                          <div className={cls.progress}><div className={cls.bar} style={{ width: "50%" }}></div></div>
                          <div className={cls.sub}><span>50% completed</span><span>90 ml left</span></div>
                        </div>
                        <div className={cls.metric}>
                          <span>Fertilizer Left in Tank</span>
                          <strong>560 / 1000 ml</strong>
                          <div className={cls.progress}><div className={cls.bar} style={{ width: "56%" }}></div></div>
                          <div className={cls.sub}><span>56% remaining</span><span>440 ml used</span></div>
                        </div>
                      </div>
                    </div> */}

                  {/* <div className={cls.card + " " + cls.pumpCard}>
                      <div className={cls.section + " " + cls.device}>
                        <div className={cls.deviceTop}>
                          <div className={cls.deviceName}><h4>Pump 4</h4><p>OFF • MANUAL</p></div>
                          <div className={cls.chips}><span className={cls.chip + " " + cls.off}>OFF</span><span className={cls.chip + " " + cls.manual}>MANUAL</span></div>
                        </div>
                        <div className={cls.metric}>
                          <span>Added Fertilizer</span>
                          <strong>0 / 100 ml</strong>
                          <div className={cls.progress}><div className={cls.bar} style={{ width: "0%" }}></div></div>
                          <div className={cls.sub}><span>0% completed</span><span>100 ml left</span></div>
                        </div>
                        <div className={cls.metric}>
                          <span>Fertilizer Left in Tank</span>
                          <strong>920 / 1000 ml</strong>
                          <div className={cls.progress}><div className={cls.bar} style={{ width: "92%" }}></div></div>
                          <div className={cls.sub}><span>92% remaining</span><span>80 ml used</span></div>
                        </div>
                      </div>
                    </div> */}
                  {/* <PumpCard card={cards.filter(x => x.type === "pump")[0]} onToggle={() => onOpenCard(cards.filter(x => x.type === "pump")[0])} />
                    <PumpCard card={cards.filter(x => x.type === "pump")[1]} onToggle={() => onOpenCard(cards.filter(x => x.type === "pump")[1])} />
                    <PumpCard card={cards.filter(x => x.type === "pump")[2]} onToggle={() => onOpenCard(cards.filter(x => x.type === "pump")[2])} />
                    <PumpCard card={cards.filter(x => x.type === "pump")[3]} onToggle={() => onOpenCard(cards.filter(x => x.type === "pump")[3])} /> */}
                  {cards.filter(x => x.type === "pump").map(card => (
                    <React.Fragment key={card.id}>
                      {getCardComponent(card)}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </CardBase>

          </div>
        </div>

      </section>
      {/* </div> */}
      {/* </div> */}
      {selectCard && getSettingsComponent(mappedCard!)}
    </Page>
    // <Page className={classNames(cls.dashboardPage, {}, [className])}>
    //   <img className={cls.background} src={BG}></img>
    //   <div className={cls.dashboardContent}>
    //     <div className={cls.systemContainer}>
    //       {cards.filter(x => x.type === "system").map(card => (
    //         <React.Fragment key={card.id}>
    //           {getCardComponent(card)}
    //         </React.Fragment>
    //       ))}
    //     </div>

    //     <Collapse buttonText="Other">
    //       {cards.filter(x => x.type === "argb" || x.type === "temp").map(card => (
    //         <React.Fragment key={card.id}>
    //           {getCardComponent(card)}
    //         </React.Fragment>
    //       ))}
    //     </Collapse>
    //     <Collapse buttonText="Relays">
    //       {cards.filter(x => x.type === "relay").map(card => (
    //         <React.Fragment key={card.id}>
    //           {getCardComponent(card)}
    //         </React.Fragment>
    //       ))}
    //     </Collapse>
    //     <Collapse buttonText="Doser">
    //       {cards.filter(x => x.type === "pump").map(card => (
    //         <React.Fragment key={card.id}>
    //           {getCardComponent(card)}
    //         </React.Fragment>
    //       ))}
    //     </Collapse>
    //     <Collapse buttonText="Server" defaultOpen={false}>
    //       {cards.filter(x => x.type === "server").map(card => (
    //         <React.Fragment key={card.id}>
    //           {getCardComponent(card)}
    //         </React.Fragment>
    //       ))}
    //     </Collapse>
    //   </div>
    //   <Navbar />
    //   {selectCard && getSettingsComponent(mappedCard!)}
    // </Page >
  );
};
