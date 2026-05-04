import { PumpCardType } from 'entities/card/model/types';
import { SettingsWrapper } from '../SettingsWrapper';
import cls from './PumpSettings.module.sass';
import { classNames } from "shared/lib/classNames";
import { useAppDispatch, useAppSelector } from 'models/Hook';
import { useEffect, useState } from 'react';
import { ButtonGroup } from 'shared/ui/ButtonGroup';
import { Button } from 'shared/ui/Button';
import { SettingsSection } from 'shared/ui/settings/SettingsSection';
import { SettingsItem } from 'shared/ui/settings/SettingsItem';
import { Toggle } from 'shared/ui/Toggle';
import { Input } from 'shared/ui/Input';
import { ReactComponent as PumpIcon } from 'shared/assets/icons/aquarium/pump.svg'
import { ReactComponent as SpeedIcon } from 'shared/assets/icons/aquarium/speed.svg'
import { ReactComponent as TextIcon } from 'shared/assets/icons/aquarium/text.svg'
import { ReactComponent as FilterIcon } from 'shared/assets/icons/aquarium/filter.svg'
import { ReactComponent as PowerIcon } from 'shared/assets/icons/aquarium/power.svg'
import { ReactComponent as TimeIcon } from 'shared/assets/icons/aquarium/time.svg'
import { ReactComponent as BottleIcon } from 'shared/assets/icons/aquarium/bottle.svg'
import { ReactComponent as DropIcon } from 'shared/assets/icons/aquarium/drop.svg'
import { ReactComponent as ManualIcon } from 'shared/assets/icons/aquarium/hand.svg'
import { ReactComponent as ScheduleIcon } from 'shared/assets/icons/aquarium/arrow-up.svg'
import { getConfig, getCurrentInfo, IPumpPeriod, resetPump, updateDoser } from '../../../redux/AquariumSlice';
import { Status } from 'models/Status';
import { invertMode } from 'shared/lib/period';
import { useIsMobile } from 'shared/lib/isMobile';

interface PumpSettingsProps {
  className?: string;
  open: boolean;
  onClose: () => void;
  card: PumpCardType;
}

export const PumpSettings = ({
  className,
  open,
  onClose,
  card
}: PumpSettingsProps) => {
  const dispatch = useAppDispatch()
  const [name, setName] = useState(card.config.name)
  const [time, setTime] = useState(card.config.time)
  const [currentVolume, setCurrentVolume] = useState(card.config.currentVolume)
  const [maxVolume, setMaxVolume] = useState(card.config.maxVolume)
  const [dosage, setDosage] = useState(card.config.dosage)
  const [rate, setRate] = useState(card.config.rate)
  const [period, setPeriod] = useState<IPumpPeriod>(card.config.period)
  const [mode, setMode] = useState(card.config.mode)
  const status = useAppSelector(state => state.aquarium.status)
  const isMobile = useIsMobile();

  useEffect(() => {
    setName(card.config.name)
    setTime(card.config.time)
    setCurrentVolume(card.config.currentVolume)
    setMaxVolume(card.config.maxVolume)
    setDosage(card.config.dosage)
    setRate(card.config.rate)
    setPeriod(card.config.period)
    setMode(card.config.mode)

  }, [card.config])
  const sendConfig = async () => {
    await dispatch(updateDoser({
      number: card.number, config:
      {
        name: name,
        dosage: dosage,
        time: time,
        currentVolume: currentVolume,
        maxVolume: maxVolume,
        period: period,
        mode: mode,
        status: card.config.status,
        rate: rate,
        hasRunToday: card.config.hasRunToday
      }
    }));
    if (status === Status.Succeeded) {
      setName(card.config.name);
      setTime(card.config.time);
      setCurrentVolume(card.config.currentVolume);
      setMaxVolume(card.config.maxVolume);
      setDosage(card.config.dosage);
      setRate(card.config.rate);
      setPeriod(card.config.period);
      setMode(card.config.mode);
    }
    onClose();
  }
  const selectMode = async (mode: number) => {
    setMode(mode);
    await dispatch(updateDoser({
      number: card.number, config:
      {
        name: name,
        dosage: dosage,
        time: time,
        currentVolume: currentVolume,
        maxVolume: maxVolume,
        period: period,
        mode: mode,
        status: card.config.status,
        rate: rate,
        hasRunToday: card.config.hasRunToday
      }
    }));
  }
  const sendPumpState = async () => {
    await dispatch(updateDoser({
      number: card.number, config:
      {
        name: name,
        dosage: dosage,
        time: time,
        currentVolume: currentVolume,
        maxVolume: maxVolume,
        period: period,
        mode: invertMode(mode, true),
        status: card.config.status,
        rate: rate,
        hasRunToday: card.config.hasRunToday
      }
    }));
    if (status === Status.Succeeded) {

      setMode(invertMode(mode, true))
      setTimeout(() => {
        dispatch(getCurrentInfo())
      }, 200);
    }
  }
  const resetPumpHandler = () => {
    dispatch(resetPump({ number: card.number }));
    setTimeout(() => {
      dispatch(getConfig())
    }, 500);
    onClose();
  }


  const modeContent = (
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
              <label>Pump state</label>
              <span className={cls.loader}>Switching...</span>
            </div>

            <div className={cls.segmented}>
              <input type="radio" name="state" id="stateOn" checked={card.current.status} readOnly />
              <label htmlFor="stateOn" onClick={!card.current.status ? sendPumpState : () => { }}>On</label>
              <input type="radio" name="state" id="stateOff" checked={!card.current.status} readOnly />
              <label htmlFor="stateOff" onClick={card.current.status ? sendPumpState : () => { }}>Off</label>
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
  )
  const scheduleContent = (
    <section className={cls.card}>
      <h2 className={cls.sectionTitle}>Schedule</h2>
      <div className={cls.field}>
        <label htmlFor="onTime">Turn on time</label>
        <input id="onTime" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
      </div>
      <div className={`${cls.field} ${cls.m0}`}>
        <label>Select working days</label>
        <div className={cls.daysWrap}>
          <div className={cls.daysRow}>
            <input type="checkbox" id="mon" checked={period.mo} onClick={(e) => setPeriod({ ...period, mo: !period.mo })}/>
            <label className={cls.dayChip} htmlFor="mon">Mon</label>
            <input type="checkbox" id="tue" checked={period.tu} onClick={(e) => setPeriod({ ...period, tu: !period.tu })}/>
            <label className={cls.dayChip} htmlFor="tue">Tue</label>
            <input type="checkbox" id="wed" checked={period.we} onClick={(e) => setPeriod({ ...period, we: !period.we })}/>
            <label className={cls.dayChip} htmlFor="wed">Wed</label>
            <input type="checkbox" id="thu" checked={period.th} onClick={(e) => setPeriod({ ...period, th: !period.th })}/>
            <label className={cls.dayChip} htmlFor="thu">Thu</label>
            <input type="checkbox" id="fri" checked={period.fr} onClick={(e) => setPeriod({ ...period, fr: !period.fr })}/>
            <label className={cls.dayChip} htmlFor="fri">Fri</label>
            <input type="checkbox" id="sat" checked={period.sa} onClick={(e) => setPeriod({ ...period, sa: !period.sa })}/>
            <label className={cls.dayChip} htmlFor="sat">Sat</label>
            <input type="checkbox" id="sun" checked={period.su} onClick={(e) => setPeriod({ ...period, su: !period.su })}/>
            <label className={cls.dayChip} htmlFor="sun">Sun</label>
          </div>
        </div>
      </div>
    </section>
  )
  const dailyFlagContent = (
    <section className={`${cls.card} ${cls.dailyFlag}`}>
      <h2 className={cls.sectionTitle}>Daily flag</h2>
      <div className={cls.field} style={{ marginBottom: "10px" }}>
        <label>Worked today</label>
        <div className={cls.statusBox}>
          <span className={cls.statusIndicator}>
            <span className={classNames(`${cls.dot} ${cls.active}`, { [cls.danger]: !card.config.hasRunToday }, [])}>
            </span> {card.config.hasRunToday ? "Yes" : "No"}, the pump {card.config.hasRunToday ? "has already" : "hasn't"} run today</span>
          <span className={classNames(`${cls.statusTag} ${cls.active}`, { [cls.danger]: !card.config.hasRunToday }, [])}>SET</span>
        </div>
      </div>
      <button className={`btn btn-danger ${cls.button} ${!card.config.hasRunToday && "disabled"}`} onClick={resetPumpHandler}>Reset daily flag</button>
      <div className={cls.note}>Reset the daily flag when you need the pump to be allowed to run again on the same day.</div>
    </section>
  )
  const generalContent = (
    <section className={cls.card}>
      <h2 className={cls.sectionTitle}>General</h2>
      <div className={cls.field}>
        <label htmlFor="pumpName">Name</label>
        <input id="pumpName" type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className={cls.field}>
        <label htmlFor="dose">Dosage</label>
        <input id="dose" type="number" inputMode="decimal" value={dosage} step="0.1" onChange={(e) => setDosage(Number(e.target.value))} />
      </div>
      <div className={cls.field}>
        <label htmlFor="performance">Performance</label>
        <input id="performance" type="number" inputMode="decimal" value={rate} step="1" onChange={(e) => setRate(Number(e.target.value))} />
      </div>
      <div className={cls.field}>
        <label htmlFor="remaining">Remaining volume</label>
        <input id="remaining" type="number" inputMode="decimal" value={currentVolume} step="1" onChange={(e) => setCurrentVolume(Number(e.target.value))} />
      </div>
      <div className={`${cls.field} ${cls.m0}`}>
        <label htmlFor="maxVolume">Max volume</label>
        <input id="maxVolume" type="number" inputMode="decimal" value={maxVolume} step="1" onChange={(e) => setMaxVolume(Number(e.target.value))} />
      </div>
    </section>
  )

  return (
    <SettingsWrapper open={open} onClose={onClose} card={card} onConfirm={sendConfig}>
      <div className={classNames(cls.pumpSettings, {}, [className])}>

        {isMobile || <>
          <div className={cls.desktop}>
            {modeContent}
            {mode == 2 && scheduleContent}
            {dailyFlagContent}
          </div>
          {generalContent}
        </>}
        {isMobile && <>
          {modeContent}
          {mode == 2 && scheduleContent}
          {generalContent}
          {dailyFlagContent}
        </>}









        {/* <div className={cls.body}>
          <ButtonGroup className={cls.group}>
            <Button
              className={classNames(cls.groupButton, { [cls.active]: mode !== 2 }, [])}
              onClick={() => selectMode(Number(card.current.status))}
            >Manual</Button>
            <Button
              className={classNames(cls.groupButton, { [cls.active]: mode === 2 }, [])}
              onClick={() => selectMode(2)}
            >Schedule</Button>
          </ButtonGroup>
          {<PumpIcon className={cls.icon} />}
          <ButtonGroup className={cls.group}>
            <Button className={classNames(cls.groupButton, { [cls.active]: period.su }, [])} onClick={(e) => setPeriod({ ...period, su: !period.su })}>Su</Button>
            <Button className={classNames(cls.groupButton, { [cls.active]: period.mo }, [])} onClick={(e) => setPeriod({ ...period, mo: !period.mo })}>Mo</Button>
            <Button className={classNames(cls.groupButton, { [cls.active]: period.tu }, [])} onClick={(e) => setPeriod({ ...period, tu: !period.tu })}>Tu</Button>
            <Button className={classNames(cls.groupButton, { [cls.active]: period.we }, [])} onClick={(e) => setPeriod({ ...period, we: !period.we })}>We</Button>
            <Button className={classNames(cls.groupButton, { [cls.active]: period.th }, [])} onClick={(e) => setPeriod({ ...period, th: !period.th })}>Th</Button>
            <Button className={classNames(cls.groupButton, { [cls.active]: period.fr }, [])} onClick={(e) => setPeriod({ ...period, fr: !period.fr })}>Fr</Button>
            <Button className={classNames(cls.groupButton, { [cls.active]: period.sa }, [])} onClick={(e) => setPeriod({ ...period, sa: !period.sa })}>Sa</Button>
          </ButtonGroup>

          <SettingsSection className={cls.settings}>
            <SettingsItem
              label="State"
              icon={<PowerIcon />}
              control={<Toggle disabled={mode === 2} size='XL' checked={card.current.status} onClick={sendPumpState} />}
            />
            <SettingsItem
              label="Name"
              icon={<TextIcon />}
              control={<Input className={cls.input} value={name} onChange={(e) => setName(e.target.value)} />}
            />
            <SettingsItem
              label="Time"
              icon={<TimeIcon />}
              control={<Input className={cls.input} type="time" value={time} onChange={(e) => setTime(e.target.value)} />}
            />
            <SettingsItem
              label="Dosage"
              icon={<DropIcon />}
              control={<Input className={cls.input} type="number" value={dosage} onChange={(e) => setDosage(Number(e.target.value))} />}
            />
            <SettingsItem
              label="Rate"
              icon={<SpeedIcon />}
              control={<Input className={cls.input} type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} />}
            />
            <SettingsItem
              label="Remainder"
              icon={<BottleIcon />}
              control={<Input className={cls.input} type="number" value={currentVolume} onChange={(e) => setCurrentVolume(Number(e.target.value))} />}
            />
            <SettingsItem
              label="Volume"
              icon={<BottleIcon />}
              control={<Input className={cls.input} type="number" value={maxVolume} onChange={(e) => setMaxVolume(Number(e.target.value))} />}
            />
          </SettingsSection>
          <Button onClick={resetPumpHandler} className={cls.resetButton}>Reset pump</Button>
        </div> */}
      </div>
    </SettingsWrapper>
  );
}