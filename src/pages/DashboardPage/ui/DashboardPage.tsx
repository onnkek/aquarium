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

export interface DashboardPageProps {
  className?: string;
}

export const DashboardPage = ({ className }: DashboardPageProps) => {
  const dispatch = useAppDispatch()
  const system = useAppSelector(state => state.aquarium.config.system)
  const openModal = useAppSelector(state => state.aquarium.modal)
  const updateStatus = useAppSelector(state => state.aquarium.updateStatus)


  useEffect(() => {
    dispatch(getCurrentInfo())
    dispatch(getConfig())
  }, [dispatch])

  console.log(openModal)
  useEffect(() => {
    if (updateStatus === Status.Succeeded && system.update > 0 && !openModal) {

      const interval = setInterval(() => {
        dispatch(getCurrentInfo())
      }, 1000 * system.update)

      return () => clearInterval(interval);
    }

  }, [updateStatus, system.update, dispatch, openModal])

  console.log("Render dashboard")
  return (
    <Page className={classNames(cls.dashboardPage, {}, [className])}>
      <div style={{ color: "white" }}>
        <p>visualViewport.height {window.visualViewport?.height}</p>
        <p>visualViewport.width {window.visualViewport?.width}</p>

        <p>html.height {document.getElementsByTagName("html")[0].clientHeight}</p>
        <p>html.width {document.getElementsByTagName("html")[0].clientWidth}</p>

        {/* eslint-disable-next-line */}
        <p>screen.height {screen.height}</p>
        {/* eslint-disable-next-line */}
        <p>screen.width {screen.width}</p>
        {/* eslint-disable-next-line */}
        <p>screen.availHeight {screen.availHeight}</p>
        {/* eslint-disable-next-line */}
        <p>screen.availWidth {screen.availWidth}</p>


        <p>document.documentElement.clientHeight {document.documentElement.clientHeight}</p>
        <p>document.documentElement.clientWidth {document.documentElement.clientWidth}</p>

        <p>html.offsetHeight {document.getElementsByTagName("html")[0].offsetHeight}</p>
        <p>html.offsetWidth {document.getElementsByTagName("html")[0].offsetWidth}</p>

        <p>window.innerHeight {window.innerHeight}</p>
        <p>window.innerWidth {window.innerWidth}</p>
        <p>window.outerHeight {window.outerHeight}</p>
        <p>window.outerWidth {window.outerWidth}</p>

        <p>visualViewport.offsetTop {window.visualViewport?.offsetTop}</p>
        <p>visualViewport.pageTop {window.visualViewport?.pageTop}</p>
        <p>visualViewport.scale {window.visualViewport?.scale}</p>
        <p>window.pageYOffset {window.pageYOffset}</p>
      </div>

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
