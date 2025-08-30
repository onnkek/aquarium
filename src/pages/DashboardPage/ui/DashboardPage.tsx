import { classNames } from "shared/lib/classNames";
import cls from './DashboardPage.module.sass';
import { useAppDispatch, useAppSelector } from "models/Hook";
import { Status } from "models/Status";
import { useEffect } from "react";
import { getConfig, getCurrentInfo } from "../../../redux/AquariumSlice";
import { PumpWidget } from "widgets/PumpWidget/";
import { Page } from "widgets/Page";
import { ARGBWidget } from "widgets/ARGBWidget";
import { TempWidget } from "widgets/TempWidget";
import { SystemWidget } from "widgets/SystemWidget";
import { O2Widget } from "widgets/O2Widget";
import { LightWidget } from "widgets/LightWidget";
import { FilterWidget } from "widgets/FilterWidget";
import { CO2Widget } from "widgets/CO2Widget";
import { RelayWidget } from "widgets/RelayWidget";
import { PIDWidget } from "widgets/PIDWidget";
import { RGBWidget } from "widgets/RGBWidget";
import { PumpNewWidget } from "widgets/PumpNewWidget";
import { StartWidget } from "widgets/StartWidget";
import BG from 'shared/assets/img/bg4.jpg';
import { Dashboard } from "features/Dashboard";

export interface DashboardPageProps {
  className?: string;
}

export const DashboardPage = ({ className }: DashboardPageProps) => {
  const dispatch = useAppDispatch()
  const system = useAppSelector(state => state.aquarium.config.system)
  const openModal = useAppSelector(state => state.aquarium.modal)
  const updateStatus = useAppSelector(state => state.aquarium.updateStatus)
  const config = useAppSelector(state => state.aquarium.config)
  const currentInfo = useAppSelector(state => state.aquarium.currentInfo)

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

  return (
    <Page className={classNames(cls.dashboardPage, {}, [className])}>


      {/* <img className={cls.background} src={BG}></img> */}

      <div style={{ display: "flex", width: "100%" }}>
        <StartWidget config={config} currentInfo={currentInfo} />
      </div>

      <Dashboard config={config} current={currentInfo} />




      {/* <div style={{ display: "flex", width: "100%" }}>
        <RelayWidget relay={config.light} currentInfo={currentInfo.light} type="light" />
        <RelayWidget relay={config.co2} currentInfo={currentInfo.co2} type="co2" />
      </div>
      <div style={{ display: "flex", width: "100%" }}>
        <RelayWidget relay={config.o2} currentInfo={currentInfo.o2} type="o2" />
        <RelayWidget relay={config.filter} currentInfo={currentInfo.filter} type="filter" />
      </div> */}
      {/* <div style={{ display: "flex", width: "100%" }}>
        <PIDWidget temp={config.temp} currentInfo={currentInfo.temp} />
        <RGBWidget argb={config.argb} currentInfo={currentInfo.argb} />
      </div> */}
      {/* <div style={{ display: "flex", width: "100%" }}>
        <PumpNewWidget pump={config.doser[0]} currentInfo={currentInfo.doser[0]} />
        <PumpNewWidget pump={config.doser[1]} currentInfo={currentInfo.doser[1]} />
      </div>
      <div style={{ display: "flex", width: "100%" }}>
        <PumpNewWidget pump={config.doser[2]} currentInfo={currentInfo.doser[2]} />
        <PumpNewWidget pump={config.doser[3]} currentInfo={currentInfo.doser[3]} />
      </div> */}
      <SystemWidget />
      <div style={{ display: "flex", flexWrap: "wrap" }}>

        <TempWidget />
        <LightWidget />
        <CO2Widget />
        <O2Widget />
        <FilterWidget />
        <ARGBWidget />
      </div>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        <PumpWidget number={0} />
        <PumpWidget number={1} />
        <PumpWidget number={2} />
        <PumpWidget number={3} />
      </div>
    </Page>
  );
};
