import { ArgbCardType } from 'entities/card/model/types';
import { SettingsWrapper } from '../SettingsWrapper';
import cls from './ArgbSettings.module.sass';
import { classNames } from "shared/lib/classNames";
import { SettingsSection } from 'shared/ui/settings/SettingsSection';
import { SettingsItem } from 'shared/ui/settings/SettingsItem';
import { ButtonGroup } from 'shared/ui/ButtonGroup';
import { Button } from 'shared/ui/Button';
import { ReactComponent as ArgbIcon } from 'shared/assets/icons/aquarium/argb.svg';
import { ReactComponent as BrightnessIcon } from 'shared/assets/icons/aquarium/brightness.svg';
import { ReactComponent as SpeedIcon } from 'shared/assets/icons/aquarium/speed.svg'
import { ReactComponent as ColorIcon } from 'shared/assets/icons/aquarium/color.svg'
import { ReactComponent as HystIcon } from 'shared/assets/icons/aquarium/hysteresis.svg'
import { ReactComponent as TimeIcon } from 'shared/assets/icons/aquarium/time.svg'
import { Toggle } from 'shared/ui/Toggle';
import { Input } from 'shared/ui/Input';
import { ChangeEvent, useEffect, useState } from 'react';
import { getCurrentInfo, updateARGB } from '../../../redux/AquariumSlice';
import { useAppDispatch, useAppSelector } from 'models/Hook';
import { hexToRgb, rgbToHex } from 'shared/lib/colors';
import { Status } from 'models/Status';

interface ArgbSettingsProps {
  className?: string;
  open: boolean;
  onClose: () => void;
  card: ArgbCardType;
}

export const ArgbSettings = ({
  className,
  open,
  onClose,
  card
}: ArgbSettingsProps) => {

  const dispatch = useAppDispatch()
  const [mode, setMode] = useState(card.config.mode);
  const [onTime, setOnTime] = useState(card.config.on);
  const [offTime, setOffTime] = useState(card.config.off);
  const [cycleSpeed, setCycleSpeed] = useState(card.config.cycle.speed)
  const [brightness, setBrightness] = useState(card.config.brightness)
  const [staticColor, setStaticColor] = useState(card.config.static)
  const [gradientStartColor, setGradientStartColor] = useState(card.config.gradient.start)
  const [gradientEndColor, setGradientEndColor] = useState(card.config.gradient.end)
  const [customColor, setCustomColor] = useState(card.config.custom)
  const status = useAppSelector(state => state.aquarium.status)

  useEffect(() => {
    setMode(card.config.mode)
    setOnTime(card.config.on)
    setOffTime(card.config.off)
    setBrightness(card.config.brightness)
    setStaticColor(card.config.static)
    setGradientStartColor(card.config.gradient.start)
    setGradientEndColor(card.config.gradient.end)
    setCustomColor(card.config.custom)
    setCycleSpeed(card.config.cycle.speed)
  }, [card.config])

  const selectMode = async (mode: number) => {
    setMode(mode);
    await dispatch(updateARGB({
      name: card.config.name,
      on: onTime,
      off: offTime,
      mode: mode,
      brightness: brightness,
      static: staticColor,
      gradient: {
        start: gradientStartColor,
        end: gradientEndColor
      },
      custom: customColor,
      cycle: {
        speed: cycleSpeed
      }
    }));
  }
  const sendConfig = async () => {
    await dispatch(updateARGB({
      name: card.config.name,
      on: onTime,
      off: offTime,
      mode: mode,
      brightness: brightness,
      static: staticColor,
      gradient: {
        start: gradientStartColor,
        end: gradientEndColor
      },
      custom: customColor,
      cycle: {
        speed: cycleSpeed
      }
    }));
    if (status === Status.Succeeded) {
      setMode(card.config.mode);
      setOnTime(card.config.on);
      setOffTime(card.config.off);
      setStaticColor(card.config.static);
      setGradientStartColor(card.config.gradient.start);
      setGradientEndColor(card.config.gradient.end);
      setCustomColor(card.config.custom);
      setCycleSpeed(card.config.cycle.speed);
      setBrightness(card.config.brightness);
      setTimeout(() => {
        dispatch(getCurrentInfo());
      }, 200);
    }
    onClose();
  }
  const changeCustomColorHandler = (event: ChangeEvent<HTMLInputElement>, index: number) => {
    const newColor = hexToRgb(event.target.value)
    const newColors = [...customColor]
    newColors[index] = { ...customColor[index] }
    newColors[index] = {
      r: newColor.r,
      g: newColor.g,
      b: newColor.b
    }
    setCustomColor(newColors)
  }
  return (
    <SettingsWrapper open={open} onClose={onClose} card={card} onCofirm={sendConfig}>
      <div className={classNames(cls.argbSettings, {}, [className])}>
        <div className={cls.body}>
          <ButtonGroup className={cls.group}>
            <Button
              className={classNames(cls.groupButton, { [cls.active]: mode === 0 }, [])}
              onClick={() => selectMode(0)}
            >Off</Button>
            <Button
              className={classNames(cls.groupButton, { [cls.active]: mode === 1 }, [])}
              onClick={() => selectMode(1)}
            >Static</Button>
            <Button
              className={classNames(cls.groupButton, { [cls.active]: mode === 3 }, [])}
              onClick={() => selectMode(3)}
            >Gradient</Button>
            <Button
              className={classNames(cls.groupButton, { [cls.active]: mode === 2 }, [])}
              onClick={() => selectMode(2)}
            >Cycle</Button>
            <Button
              className={classNames(cls.groupButton, { [cls.active]: mode === 4 }, [])}
              onClick={() => selectMode(4)}
            >Custom</Button>
          </ButtonGroup>
          {<ArgbIcon className={cls.icon} />}
          <SettingsSection>
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
            <SettingsItem
              label="Brightness"
              icon={<BrightnessIcon />}
              control={<Input className={cls.input} type="number" value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} />}
            />
            {mode === 1 && <SettingsItem
              label="Color"
              icon={<ColorIcon />}
              control={<Input
                className={cls.input}
                type="color"
                value={rgbToHex(staticColor.r, staticColor.g, staticColor.b)}
                onChange={(e) => setStaticColor({ r: hexToRgb(e.target.value).r, g: hexToRgb(e.target.value).g, b: hexToRgb(e.target.value).b })}
              />}
            />}
            {mode === 3 && <SettingsItem
              label="Start color"
              icon={<ColorIcon />}
              control={<Input
                className={cls.input}
                type="color"
                value={rgbToHex(gradientStartColor.r, gradientStartColor.g, gradientStartColor.b)}
                onChange={(e) => setGradientStartColor({ r: hexToRgb(e.target.value).r, g: hexToRgb(e.target.value).g, b: hexToRgb(e.target.value).b })}
              />}
            />}
            {mode === 3 && <SettingsItem
              label="End color"
              icon={<ColorIcon />}
              control={<Input
                className={cls.input}
                type="color"
                value={rgbToHex(gradientEndColor.r, gradientEndColor.g, gradientEndColor.b)}
                onChange={(e) => setGradientEndColor({ r: hexToRgb(e.target.value).r, g: hexToRgb(e.target.value).g, b: hexToRgb(e.target.value).b })}
              />}
            />}
            {mode === 2 && <SettingsItem
              label="Speed"
              icon={<SpeedIcon />}
              control={<Input type="number"
                className={cls.input}
                value={cycleSpeed}
                onChange={(e) => setCycleSpeed(Number(e.target.value))}
              />}
            />}
            {mode === 4 && card.config.custom.map((item, index) =>
              <SettingsItem
                key={index}
                label={`Color ${index + 1}`}
                icon={<ColorIcon />}
                control={<Input
                  className={cls.input}
                  type="color"
                  value={rgbToHex(card.config.custom[index].r, card.config.custom[index].g, card.config.custom[index].b)}
                  onChange={(e) => changeCustomColorHandler(e, index)}
                />}
              />
            )}
          </SettingsSection>
        </div>
      </div>
    </SettingsWrapper>
  );
}