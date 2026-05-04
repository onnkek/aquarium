import { TempCardType } from 'entities/card/model/types';
import { useAppDispatch, useAppSelector } from 'models/Hook';
import { Status } from 'models/Status';
import { useEffect, useState } from 'react';
import { classNames } from "shared/lib/classNames";
import { invertCoolMode, invertHeatMode } from 'shared/lib/period';
import { getCurrentInfo, updateTemp } from '../../../redux/AquariumSlice';
import { SettingsWrapper } from '../SettingsWrapper';
import cls from './TempSettings.module.sass';

interface TempSettingsProps {
  className?: string;
  open: boolean;
  onClose: () => void;
  card: TempCardType;
}

export const TempSettings = ({
  className,
  open,
  onClose,
  card
}: TempSettingsProps) => {
  const dispatch = useAppDispatch()
  const [mode, setMode] = useState(card.config.mode)
  const [setting, setSetting] = useState(card.config.setting)
  const [k, setK] = useState(card.config.k)
  const [hysteresis, setHysteresis] = useState(card.config.hysteresis)
  const [PIDTimeout, setPIDTimeout] = useState(card.config.timeout)
  const status = useAppSelector(state => state.aquarium.status)

  useEffect(() => {
    setMode(card.config.mode)
    setSetting(card.config.setting)
    setK(card.config.k)
    setHysteresis(card.config.hysteresis)
    setPIDTimeout(card.config.timeout)
  }, [card.config])

  const selectMode = async (mode: number) => {
    setMode(mode);
    await dispatch(updateTemp({
      name: card.config.name,
      setting: setting,
      timeout: PIDTimeout,
      k: k,
      hysteresis: hysteresis,
      mode: mode
    }))
  }

  const toggleCoolState = async () => {
    await dispatch(updateTemp({ name: card.config.name, setting: setting, timeout: PIDTimeout, k: k, hysteresis: hysteresis, mode: invertCoolMode(mode) }))
    if (status === Status.Succeeded) {
      setMode(invertCoolMode(mode))
      setTimeout(() => {
        dispatch(getCurrentInfo())
      }, 200);
    }
  }
  const toggleHeatState = async () => {
    await dispatch(updateTemp({ name: card.config.name, setting: setting, timeout: PIDTimeout, k: k, hysteresis: hysteresis, mode: invertHeatMode(mode) }))
    if (status === Status.Succeeded) {
      setMode(invertHeatMode(mode))
      setTimeout(() => {
        dispatch(getCurrentInfo())
      }, 200);
    }
  }

  const sendConfig = async () => {
    console.log(mode)
    await dispatch(updateTemp({
      name: card.config.name,
      setting: setting,
      k: k,
      hysteresis: hysteresis,
      timeout: PIDTimeout,
      mode: mode
    }))
    if (status === Status.Succeeded) {
      setSetting(card.config.setting)
      setK(card.config.k)
      setHysteresis(card.config.hysteresis)
      setPIDTimeout(card.config.timeout)
      setMode(card.config.mode)
    }
    onClose();
  }

  return (
    <SettingsWrapper open={open} onClose={onClose} card={card} onConfirm={sendConfig}>
      <div className={classNames(cls.tempSettings, {}, [className])}>

        <section className={cls.card}>
          <h2 className={cls.sectionTitle}>Mode</h2>
          <div className={cls.segmented}>
            <input type="radio" name="mode" id="manual" checked={mode !== 4} readOnly />
            <label htmlFor="manual" onClick={(e) => setMode(card.current.status)}>Manual</label>
            <input type="radio" name="mode" id="auto" checked={mode === 4} readOnly />
            <label htmlFor="auto" onClick={(e) => setMode(4)}>Automatic</label>
          </div>

          {mode != 4 &&
            <div className={classNames(cls.manualControls, { [cls.load]: status === Status.Loading }, [])} id="manualControls" style={{ display: "block" }}>
              <div className={cls.field} style={{ marginBottom: "10px" }}>
                <div className={cls.info}>
                  <label>Cooling state</label>
                  <span className={cls.loader}>Switching...</span>
                </div>

                <div className={cls.segmented}>
                  <input type="radio" name="coolState" id="coolStateOn" checked={(card.current.status === 1 || card.current.status === 3)} />
                  <label htmlFor="coolStateOn" onClick={toggleCoolState}>On</label>
                  <input type="radio" name="coolState" id="coolStateOff" checked={!(card.current.status == 1 || card.current.status == 3)} />
                  <label htmlFor="coolStateOff" onClick={toggleCoolState}>Off</label>
                </div>
              </div>
              <div className={cls.field} style={{ marginBottom: "0px" }}>
                <div className={cls.info}>
                  <label>Heating state</label>
                </div>

                <div className={cls.segmented}>
                  <input type="radio" name="heatState" id="heatStateOn" checked={(card.current.status === 2 || card.current.status === 3)} />
                  <label htmlFor="heatStateOn" onClick={toggleHeatState} >On</label>
                  <input type="radio" name="heatState" id="heatStateOff" checked={!(card.current.status === 2 || card.current.status === 3)} />
                  <label htmlFor="heatStateOff" onClick={toggleHeatState} >Off</label>
                </div>
              </div>
            </div>
          }

          {mode == 4 &&
            <div className={cls.field} id="autoStatus" style={{ marginTop: "14px", marginBottom: "0px" }}>
              <label>Current status</label>
              <div className={cls.statusBox}>
                <span className={cls.statusIndicator}>
                  <span className={classNames(cls.dot, { [cls.active]: card.current.status === 1 || card.current.status === 3 }, [])}></span> Cooling is {card.current.status === 1 || card.current.status === 3 ? "" : "in"}active</span>
                <span className={classNames(cls.statusTag, { [cls.active]: card.current.status === 1 || card.current.status === 3 }, [])}>{card.current.status === 1 || card.current.status === 3 ? "ON" : "OFF"}</span>
              </div>
              <div className={cls.statusBox}>
                <span className={cls.statusIndicator}>
                  <span className={classNames(cls.dot, { [cls.active]: card.current.status === 2 || card.current.status === 3 }, [])}></span> Heating is {card.current.status === 2 || card.current.status === 3 ? "" : "in"}active</span>
                <span className={classNames(cls.statusTag, { [cls.active]: card.current.status === 2 || card.current.status === 3 }, [])}>{card.current.status === 2 || card.current.status === 3 ? "ON" : "OFF"}</span>
              </div>
            </div>
          }
        </section>

        <section className={cls.card}>
          <h2 className={cls.sectionTitle}>General</h2>
          <div className={cls.field}>
            <label htmlFor="setting">Setting</label>
            <input id="setting" type="number" inputMode="decimal" value={setting} onChange={(e) => setSetting(Number(e.target.value))}/>
          </div>
          <div className={cls.field}>
            <label htmlFor="k">K</label>
            <input id="k" type="number" inputMode="decimal" value={k} onChange={(e) => setK(Number(e.target.value))} />
          </div>
          <div className={cls.field}>
            <label htmlFor="hysteresis">Hysteresis</label>
            <input id="hysteresis" type="number" inputMode="decimal" value={hysteresis} onChange={(e) => setHysteresis(Number(e.target.value))} />
          </div>
          <div className={cls.field}>
            <label htmlFor="timeout">Timeout</label>
            <input id="timeout" type="number" inputMode="decimal" value={PIDTimeout} onChange={(e) => setPIDTimeout(Number(e.target.value))} />
          </div>
        </section>
      </div>
    </SettingsWrapper>
  );
}