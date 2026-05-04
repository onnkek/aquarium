import { ArgbCardType } from 'entities/card/model/types';
import { SettingsWrapper } from '../SettingsWrapper';
import cls from './ArgbSettings.module.sass';
import { classNames } from "shared/lib/classNames";
import { ChangeEvent, useEffect, useState } from 'react';
import { getCurrentInfo, updateARGB } from '../../../redux/AquariumSlice';
import { useAppDispatch, useAppSelector } from 'models/Hook';
import { hexToRgb, rgbToHex } from 'shared/lib/colors';
import { Status } from 'models/Status';
import { invertMode } from 'shared/lib/period';

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
  const [style, setStyle] = useState(card.config.style);
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
    setStyle(card.config.style)
    setOnTime(card.config.on)
    setOffTime(card.config.off)
    setBrightness(card.config.brightness)
    setStaticColor(card.config.static)
    setGradientStartColor(card.config.gradient.start)
    setGradientEndColor(card.config.gradient.end)
    setCustomColor(card.config.custom)
    setCycleSpeed(card.config.cycle.speed)
  }, [card.config])

  const changeState = async () => {
    await dispatch(updateARGB({
      name: card.config.name,
      on: onTime,
      off: offTime,
      mode: invertMode(mode, card.current.status),
      style: style,
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
      setMode(invertMode(mode, card.current.status))
      setTimeout(() => {
        dispatch(getCurrentInfo())
      }, 200); // Написать чтобы сервер на апдейт кофига возвращал не новый конфиг, а currentInfo
    }
  }

  const selectStyle = async (style: number) => {
    setStyle(style);
    await dispatch(updateARGB({
      name: card.config.name,
      on: onTime,
      off: offTime,
      mode: mode,
      style: style,
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
      style: style,
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
      setStyle(card.config.style)
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
  const brightnessContent = (
    <div className={cls.field}>
      <label htmlFor="onTime">Brightness</label>
      <input id="onTime" type="number" value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} />
    </div>
  )
  return (
    <SettingsWrapper open={open} onClose={onClose} card={card} onConfirm={sendConfig}>
      <div className={classNames(cls.argbSettings, {}, [className])}>

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
                  <span className={classNames(cls.dot, { [cls.active]: card.current.status }, [])}></span> ARGB lightning is {card.current.status ? "" : "in"}active</span>
                <span className={classNames(cls.statusTag, { [cls.active]: card.current.status }, [])}>{card.current.status ? "ON" : "OFF"}</span>
              </div>
            </div>
          }
        </section>

        {mode === 2 && <section className={cls.card} style={{ order: 1 }}>
          <h2 className={cls.sectionTitle}>Schedule</h2>
          <div className={cls.field}>
            <label htmlFor="onTime">Turn on time</label>
            <input id="onTime" type="time" value={onTime} onChange={(e) => setOnTime(e.target.value)} />
          </div>
          <div className={cls.field}>
            <label htmlFor="offTime">Turn off time</label>
            <input id="offTime" type="time" value={offTime} onChange={(e) => setOffTime(e.target.value)} />
          </div>
        </section>}

        

        <section className={cls.card} style={{ order: 2 }}>
          <h2 className={cls.sectionTitle}>Style</h2>
          <div className={classNames(cls.manualControls, { [cls.load]: status === Status.Loading }, [])} id="manualControls" style={{ display: "block" }}>
          <div className={cls.field} style={{ marginBottom: "0px" }}>
            <div className={cls.info}>
              <label>Style</label>
              <span className={cls.loader}>Switching...</span>
            </div>

            <div className={`${cls.segmented} ${cls.style}`}>
              <input type="radio" name="style" id="static" checked={style === 1 || style === 0} readOnly />
              <label htmlFor="static" onClick={() => selectStyle(1)}>Static</label>
              <input type="radio" name="style" id="grad" checked={style === 3} readOnly />
              <label htmlFor="grad" onClick={() => selectStyle(3)}>Gradient</label>
              <input type="radio" name="style" id="cycle" checked={style === 2} readOnly />
              <label htmlFor="cycle" onClick={() => selectStyle(2)}>Cycle</label>
              <input type="radio" name="style" id="custom" checked={style === 4} readOnly />
              <label htmlFor="custom" onClick={() => selectStyle(4)}>Custom</label>
            </div>
          </div>
        </div>

        </section>

        {style === 1 && <section className={`${cls.card} ${cls.general}`}>
          <h2 className={cls.sectionTitle}>General</h2>
          {brightnessContent}
          <div className={cls.field}>
            <label htmlFor="color">Color</label>
            <input id="color" type="color" value={rgbToHex(staticColor.r, staticColor.g, staticColor.b)}
              onChange={(e) => setStaticColor({ r: hexToRgb(e.target.value).r, g: hexToRgb(e.target.value).g, b: hexToRgb(e.target.value).b })} />
          </div>
        </section>}
        {style === 3 && <section className={`${cls.card} ${cls.general}`}>
          <h2 className={cls.sectionTitle}>General</h2>
          {brightnessContent}
          <div className={cls.field}>
            <label htmlFor="startColor">Start color</label>
            <input id="startColor" type="color" value={rgbToHex(gradientStartColor.r, gradientStartColor.g, gradientStartColor.b)}
              onChange={(e) => setGradientStartColor({ r: hexToRgb(e.target.value).r, g: hexToRgb(e.target.value).g, b: hexToRgb(e.target.value).b })} />
          </div>
          <div className={cls.field}>
            <label htmlFor="endColor">End color</label>
            <input id="endColor" type="color" value={rgbToHex(gradientEndColor.r, gradientEndColor.g, gradientEndColor.b)}
              onChange={(e) => setGradientEndColor({ r: hexToRgb(e.target.value).r, g: hexToRgb(e.target.value).g, b: hexToRgb(e.target.value).b })} />
          </div>
        </section>}
        {style === 2 && <section className={`${cls.card} ${cls.general}`}>
          <h2 className={cls.sectionTitle}>General</h2>
          {brightnessContent}
          <div className={cls.field}>
            <label htmlFor="speed">Speed</label>
            <input id="speed" type="number" inputMode="decimal" value={cycleSpeed} onChange={(e) => setCycleSpeed(Number(e.target.value))} />
          </div>
        </section>}
        {style === 4 && <section className={`${cls.card} ${cls.general}`}>
          <h2 className={cls.sectionTitle}>General</h2>
          {brightnessContent}
          <div className={cls.custom}>
            {card.config.custom.map((item, index) =>
              <div className={cls.field} key={index}>
                <label htmlFor="color">Color {index + 1}</label>
                <input id="color" type="color" value={rgbToHex(customColor[index].r, customColor[index].g, customColor[index].b)}
                  onChange={(e) => changeCustomColorHandler(e, index)} />
              </div>
            )}
          </div>
        </section>}
      </div>
    </SettingsWrapper>
  );
}