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
        mode: invertMode(mode),
        status: card.config.status,
        rate: rate,
        hasRunToday: card.config.hasRunToday
      }
    }));
    if (status === Status.Succeeded) {

      setMode(invertMode(mode))
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
  return (
    <SettingsWrapper open={open} onClose={onClose} card={card} onConfirm={sendConfig}>
      <div className={classNames(cls.pumpSettings, {}, [className])}>
        <div className={cls.body}>
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
        </div>
      </div>
    </SettingsWrapper>
  );
}