import { RelayCardType, RelaySubtype } from 'entities/card/model/types';
import { SettingsWrapper } from '../SettingsWrapper';
import cls from './RelaySettings.module.sass';
import { classNames, Mods } from "shared/lib/classNames";
import { Input } from 'shared/ui/Input';
import { ButtonGroup } from 'shared/ui/ButtonGroup';
import { Button } from 'shared/ui/Button';
import { Toggle } from 'shared/ui/Toggle';
import { ReactComponent as LightIcon } from 'shared/assets/icons/aquarium/light.svg'
import { ReactComponent as O2Icon } from 'shared/assets/icons/aquarium/o2.svg'
import { ReactComponent as CO2Icon } from 'shared/assets/icons/aquarium/co2.svg'
import { ReactComponent as FilterIcon } from 'shared/assets/icons/aquarium/filter.svg'
import { ReactComponent as PowerIcon } from 'shared/assets/icons/aquarium/power.svg'
import { ReactComponent as TimeIcon } from 'shared/assets/icons/aquarium/time.svg'
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'models/Hook';
import { getCurrentInfo, updateCO2, updateFilter, updateLight, updateO2 } from '../../../redux/AquariumSlice';
import { invertMode } from 'shared/lib/period';
import { Status } from 'models/Status';

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
    switch (card.subtype) {
      case "co2":
        await dispatch(updateCO2({ on: onTime, off: offTime, mode: invertMode(mode), name: card.config.name }));
        break;
      case "o2":
        await dispatch(updateO2({ on: onTime, off: offTime, mode: invertMode(mode), name: card.config.name }));
        break;
      case "light":
        await dispatch(updateLight({ on: onTime, off: offTime, mode: invertMode(mode), name: card.config.name }));
        break;
      case "filter":
        await dispatch(updateFilter({ on: onTime, off: offTime, mode: invertMode(mode), name: card.config.name }));
        break;
    }

    if (status === Status.Succeeded) {
      setMode(invertMode(mode))
      setTimeout(() => {
        dispatch(getCurrentInfo())
      }, 200); // Написать чтобы сервер на апдейт кофига возвращал не новый конфиг, а currentInfo
    }
  }
  const onSendConfig = async () => {
    switch (card.subtype) {
      case "co2":
        await dispatch(updateCO2({ on: onTime, off: offTime, mode: mode, name: card.config.name }));
        break;
      case "o2":
        await dispatch(updateO2({ on: onTime, off: offTime, mode: mode, name: card.config.name }));
        break;
      case "light":
        await dispatch(updateLight({ on: onTime, off: offTime, mode: mode, name: card.config.name }));
        break;
      case "filter":
        await dispatch(updateFilter({ on: onTime, off: offTime, mode: mode, name: card.config.name }));
        break;
    }
    if (status === Status.Succeeded) {
      setOnTime(card.config.on)
      setOffTime(card.config.off)
      setMode(card.config.mode)
    }
    onClose();
  }

  const selectMode = async (mode: number) => {
    setMode(mode);
    switch (card.subtype) {
      case "co2":
        await dispatch(updateCO2({ on: onTime, off: offTime, mode: mode, name: card.config.name }));
        break;
      case "o2":
        await dispatch(updateO2({ on: onTime, off: offTime, mode: mode, name: card.config.name }));
        break;
      case "light":
        await dispatch(updateLight({ on: onTime, off: offTime, mode: mode, name: card.config.name }));
        break;
      case "filter":
        await dispatch(updateFilter({ on: onTime, off: offTime, mode: mode, name: card.config.name }));
        break;
    }
  }

  const mods: Mods = {
    [relaySubtypeClasses[card.subtype]]: true
  }

  return (
    <SettingsWrapper open={open} onClose={onClose} card={card} onCofirm={onSendConfig}>
      <div className={classNames(cls.relaySettings, mods, [className])}>
        <span className={cls.blur}></span>
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
          {getRelayIcon()}
          <div className={cls.props}>
            <div className={cls.prop}>
              <div className={cls.propType}>
                <PowerIcon />
                <div className={cls.propTitle}>State</div>
              </div>
              <Toggle size='XL' className={cls.toggle} checked={card.current.status} onClick={changeState} />
            </div>
            <div className={cls.prop}>
              <div className={cls.propType}>
                <TimeIcon />
                <div className={cls.propTitle}>On</div>
              </div>
              <Input className={cls.propInput} type="time" value={onTime} onChange={(e) => setOnTime(e.target.value)}></Input>
            </div>
            <div className={cls.prop}>
              <div className={cls.propType}>
                <TimeIcon />
                <div className={cls.propTitle}>Off</div>
              </div>
              <Input className={cls.propInput} type="time" value={offTime} onChange={(e) => setOffTime(e.target.value)}></Input>
            </div>
          </div>
        </div>
      </div>
    </SettingsWrapper>
  );
}