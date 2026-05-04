import { RelayCardType, RelaySubtype } from 'entities/card/model/types';
import { useAppDispatch, useAppSelector } from 'models/Hook';
import { Status } from 'models/Status';
import { useEffect, useState } from 'react';
import { ReactComponent as CO2Icon } from 'shared/assets/icons/aquarium/co2.svg';
import { ReactComponent as FilterIcon } from 'shared/assets/icons/aquarium/filter.svg';
import { ReactComponent as LightIcon } from 'shared/assets/icons/aquarium/light.svg';
import { ReactComponent as O2Icon } from 'shared/assets/icons/aquarium/o2.svg';
import { classNames, Mods } from "shared/lib/classNames";
import { invertMode } from 'shared/lib/period';
import { getCurrentInfo, updateRelay } from '../../../redux/AquariumSlice';
import { SettingsWrapper } from '../SettingsWrapper';
import cls from './RelaySettings.module.sass';

interface RelaySettingsProps {
  className?: string;
  open: boolean;
  onClose: () => void;
  card: RelayCardType;
}
const relaySubtypeClasses: Record<RelaySubtype, string> = {
  light: cls.light,
  co2: cls.co2,
  o2: cls.o2,
  filter: cls.filter
};
export const RelaySettings = ({
  className,
  open,
  onClose,
  card
}: RelaySettingsProps) => {
  const dispatch = useAppDispatch()
  const [mode, setMode] = useState(card.config.mode);
  const [onTime, setOnTime] = useState(card.config.on);
  const [offTime, setOffTime] = useState(card.config.off);
  const status = useAppSelector(state => state.aquarium.status)
  useEffect(() => {
    setMode(card.config.mode)
    setOnTime(card.config.on)
    setOffTime(card.config.off)
  }, [card.config])

  const getRelayIcon = () => {
    switch (card.subtype) {
      case "co2":
        return <CO2Icon className={cls.icon} />
      case "o2":
        return <O2Icon className={cls.icon} />
      case "light":
        return <LightIcon className={cls.icon} />
      case "filter":
        return <FilterIcon className={cls.icon} />
    }
  }
  const changeState = async () => {
    await dispatch(updateRelay({
      subtype: card.subtype,
      relay: {
        on: onTime,
        off: offTime,
        mode: invertMode(mode, card.current.status),
        name: card.config.name
      }
    }));

    if (status === Status.Succeeded) {
      setMode(invertMode(mode, card.current.status))
      setTimeout(() => {
        dispatch(getCurrentInfo())
      }, 200); // Написать чтобы сервер на апдейт кофига возвращал не новый конфиг, а currentInfo
    }
  }
  const onSendConfig = async () => {
    await dispatch(updateRelay({
      subtype: card.subtype,
      relay: {
        on: onTime,
        off: offTime,
        mode: mode,
        name: card.config.name
      }
    }));
    if (status === Status.Succeeded) {
      setOnTime(card.config.on)
      setOffTime(card.config.off)
      setMode(card.config.mode)
    }
    onClose();
  }

  const selectMode = async (mode: number) => {
    setMode(mode);
    await dispatch(updateRelay({
      subtype: card.subtype,
      relay: {
        on: onTime,
        off: offTime,
        mode: mode,
        name: card.config.name
      }
    }));
  }

  const mods: Mods = {
    [relaySubtypeClasses[card.subtype]]: true
  }
  console.log(mode)
  return (
    <SettingsWrapper open={open} onClose={onClose} card={card} onConfirm={onSendConfig}>
      <div className={classNames(cls.relaySettings, mods, [className])}>

        <section className={cls.card}>
          <h2 className={cls.sectionTitle}>Mode</h2>
          <div className={cls.segmented}>
            <input type="radio" name="mode" id="manual" checked={mode === 1 || mode === 0} readOnly />
            <label htmlFor="manual" onClick={(e) => setMode(card.current.status ? 1 : 0)}>Manual</label>
            <input type="radio" name="mode" id="auto" checked={mode === 2} readOnly />
            <label htmlFor="auto" onClick={(e) => setMode(2)}>Automatic</label>
          </div>

          {mode != 2 &&
            <div className={classNames(cls.manualControls, { [cls.load]: status === Status.Loading }, [])} id="manualControls" style={{ display: "block" }}>
              <div className={cls.field} style={{ marginBottom: "0px" }}>
                <div className={cls.info}>
                  <label>Relay state</label>
                  <span className={cls.loader}>Switching...</span>
                </div>

                <div className={cls.segmented}>
                  <input type="radio" name="state" id="stateOn" checked={card.current.status} readOnly />
                  <label htmlFor="stateOn" onClick={!card.current.status ? changeState : () => { }}>On</label>
                  <input type="radio" name="state" id="stateOff" checked={!card.current.status} readOnly />
                  <label htmlFor="stateOff" onClick={card.current.status ? changeState : () => { }}>Off</label>
                </div>
              </div>
            </div>
          }

          {mode == 2 &&
            <div className={cls.field} id="autoStatus" style={{ marginTop: "14px", marginBottom: "0px" }}>
              <label>Current status</label>
              <div className={cls.statusBox}>
                <span className={cls.statusIndicator}>
                  <span className={classNames(cls.dot, { [cls.active]: card.current.status }, [])}></span> Relay is {card.current.status ? "" : "in"}active</span>
                <span className={classNames(cls.statusTag, { [cls.active]: card.current.status }, [])}>{card.current.status ? "ON" : "OFF"}</span>
              </div>
            </div>
          }
        </section>


        <section className={cls.card}>
          <h2 className={cls.sectionTitle}>Schedule</h2>
          <div className={cls.field}>
            <label htmlFor="onTime">Turn on time</label>
            <input id="onTime" type="time" value={onTime} onChange={(e) => setOnTime(e.target.value)} />
          </div>
          <div className={cls.field}>
            <label htmlFor="offTime">Turn off time</label>
            <input id="offTime" type="time" value={offTime} onChange={(e) => setOffTime(e.target.value)} />
          </div>
        </section>
      </div >
    </SettingsWrapper >
  );
}