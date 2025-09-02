import { TempCardType } from 'entities/card/model/types';
import { SettingsWrapper } from '../SettingsWrapper';
import cls from './TempSettings.module.sass';
import { classNames } from "shared/lib/classNames";
import { ButtonGroup } from 'shared/ui/ButtonGroup';
import { Button } from 'shared/ui/Button';
import { SettingsSection } from 'shared/ui/settings/SettingsSection';
import { SettingsItem } from 'shared/ui/settings/SettingsItem';
import { useAppDispatch, useAppSelector } from 'models/Hook';
import { useEffect, useState } from 'react';
import { ReactComponent as TempIcon } from 'shared/assets/icons/aquarium/temp.svg';
import { ReactComponent as SettingIcon } from 'shared/assets/icons/aquarium/temp2.svg';
import { ReactComponent as PowerIcon } from 'shared/assets/icons/aquarium/power.svg'
import { ReactComponent as GearIcon } from 'shared/assets/icons/gear.svg'
import { ReactComponent as HystIcon } from 'shared/assets/icons/aquarium/hysteresis.svg'
import { ReactComponent as TimeIcon } from 'shared/assets/icons/aquarium/time.svg'
import { getCurrentInfo, updateTemp } from '../../../redux/AquariumSlice';
import { Toggle } from 'shared/ui/Toggle';
import { Input } from 'shared/ui/Input';
import { invertCoolMode, invertHeatMode } from 'shared/lib/period';
import { Status } from 'models/Status';

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
        <div className={cls.body}>
          <ButtonGroup className={cls.group}>
            <Button
              className={classNames(cls.groupButton, { [cls.active]: mode !== 4 }, [])}
              onClick={() => selectMode(Number(card.current.status))}
            >Manual</Button>
            <Button
              className={classNames(cls.groupButton, { [cls.active]: mode === 4 }, [])}
              onClick={() => selectMode(4)}
            >PID</Button>
          </ButtonGroup>
          {<TempIcon className={cls.icon} />}
          <SettingsSection>
            <SettingsItem
              label="Cooling state"
              icon={<PowerIcon />}
              control={<Toggle size='XL' disabled={mode === 4} checked={(card.current.status === 1 || card.current.status === 3) ? true : false} onClick={toggleCoolState} />}
            />
            <SettingsItem
              label="Heating state"
              icon={<PowerIcon />}
              control={<Toggle size='XL' disabled={mode === 4} checked={(card.current.status === 2 || card.current.status === 3) ? true : false} onClick={toggleHeatState} />}
            />
            <SettingsItem
              label="Setting"
              icon={<SettingIcon />}
              control={<Input className={cls.input} type="number" value={setting} onChange={(e) => setSetting(Number(e.target.value))} />}
            />
            <SettingsItem
              label="K"
              icon={<GearIcon />}
              control={<Input className={cls.input} type="number" value={k} onChange={(e) => setK(Number(e.target.value))} />}
            />
            <SettingsItem
              label="Hysteresis"
              icon={<HystIcon />}
              control={<Input className={cls.input} type="number" value={hysteresis} onChange={(e) => setHysteresis(Number(e.target.value))} />}
            />
            <SettingsItem
              label="Timeout"
              icon={<TimeIcon />}
              control={<Input className={cls.input} type="number" value={PIDTimeout} onChange={(e) => setPIDTimeout(Number(e.target.value))} />}
            />
          </SettingsSection>
        </div>
      </div>
    </SettingsWrapper>
  );
}