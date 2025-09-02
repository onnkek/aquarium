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
import { getCurrentInfo, updateCO2, updateFilter, updateLight, updateO2, updateRelay } from '../../../redux/AquariumSlice';
import { invertMode } from 'shared/lib/period';
import { Status } from 'models/Status';
import { SettingsSection } from 'shared/ui/settings/SettingsSection';
import { SettingsItem } from 'shared/ui/settings/SettingsItem';

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
        mode: invertMode(mode),
        name: card.config.name
      }
    }));

    if (status === Status.Succeeded) {
      setMode(invertMode(mode))
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

  return (
    <SettingsWrapper open={open} onClose={onClose} card={card} onConfirm={onSendConfig}>
      <div className={classNames(cls.relaySettings, mods, [className])}>
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
          <SettingsSection>
            <SettingsItem
              label="State"
              icon={<PowerIcon />}
              control={<Toggle size='XL' checked={card.current.status} disabled={mode === 2} onClick={changeState} />}
            />
            <SettingsItem
              label="On"
              icon={<TimeIcon />}
              control={<Input className={cls.input} type="time" value={onTime} onChange={(e) => setOnTime(e.target.value)}></Input>}
            />
            <SettingsItem
              label="Off"
              icon={<TimeIcon />}
              control={<Input className={cls.input} type="time" value={offTime} onChange={(e) => setOffTime(e.target.value)}></Input>}
            />
          </SettingsSection>
        </div>
      </div>
    </SettingsWrapper>
  );
}