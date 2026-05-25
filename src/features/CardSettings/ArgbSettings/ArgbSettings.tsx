import { ArgbCardType } from 'entities/card/model/types';
import { useAppDispatch, useAppSelector } from 'models/Hook';
import { Status } from 'models/Status';
import { ChangeEvent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { classNames } from "shared/lib/classNames";
import { hexToRgb, rgbToHex } from 'shared/lib/colors';
import { invertMode } from 'shared/lib/period';
import { validateNumber, validateTime } from 'shared/lib/validation';
import { Modal } from 'shared/ui/Modal';
import { getCurrentInfo, updateARGB } from '../../../redux/AquariumSlice';
import cls from './ArgbSettings.module.sass';

interface ArgbSettingsProps {
  className?: string;
  open: boolean;
  onClose: () => void;
  card: ArgbCardType;
}
type FormData = {
  brightness: string;
  onTime: string;
  offTime: string;
  cycleSpeed: string;
};
export const ArgbSettings = ({
  className,
  open,
  onClose,
  card
}: ArgbSettingsProps) => {

  const dispatch = useAppDispatch()
  const [mode, setMode] = useState(card.config.mode);
  const [style, setStyle] = useState(card.config.style);
  const [staticColor, setStaticColor] = useState(card.config.static)
  const [gradientStartColor, setGradientStartColor] = useState(card.config.gradient.start)
  const [gradientEndColor, setGradientEndColor] = useState(card.config.gradient.end)
  const [customColor, setCustomColor] = useState(card.config.custom)
  const status = useAppSelector(state => state.aquarium.status)
  const {
    register,
    reset,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors, isValid },
  } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      brightness: String(card.config.brightness),
      onTime: card.config.on,
      offTime: card.config.off,
      cycleSpeed: String(card.config.cycle.speed)
    }
  });

  useEffect(() => {
    trigger();
  }, []);
  useEffect(() => {
    trigger();
  }, [mode]);
  useEffect(() => {
    reset({
      brightness: String(card.config.brightness),
      onTime: card.config.on,
      offTime: card.config.off,
      cycleSpeed: String(card.config.cycle.speed)
    })
    setMode(card.config.mode)
    setStyle(card.config.style)
    setStaticColor(card.config.static)
    setGradientStartColor(card.config.gradient.start)
    setGradientEndColor(card.config.gradient.end)
    setCustomColor(card.config.custom)
  }, [card.config])

  const changeState = async () => {
    await dispatch(updateARGB({
      ...card.config,
      mode: invertMode(mode, card.current.status)
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
      ...card.config,
      style: style
    }));
  }
  const sendConfig = async (data: FormData) => {
    await dispatch(updateARGB({
      ...card.config,
      on: data.onTime,
      off: data.offTime,
      mode: mode,
      style: style,
      brightness: Number(data.brightness),
      static: staticColor,
      gradient: {
        start: gradientStartColor,
        end: gradientEndColor
      },
      custom: customColor,
      cycle: {
        speed: Number(data.cycleSpeed)
      }
    }));
    if (status === Status.Succeeded) {
      reset({
        brightness: String(card.config.brightness),
        onTime: card.config.on,
        offTime: card.config.off,
        cycleSpeed: String(card.config.cycle.speed)
      })
      setMode(card.config.mode);
      setStyle(card.config.style)
      setStaticColor(card.config.static);
      setGradientStartColor(card.config.gradient.start);
      setGradientEndColor(card.config.gradient.end);
      setCustomColor(card.config.custom);
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
      <input
        className={`form-control ${errors.brightness ? "is-invalid" : ""}`}
        data-bs-theme="dark"
        id="brightness"
        type="number"
        {...register("brightness", {
          required: "",
          validate: (v) => validateNumber(v, { min: 0, max: 255, allowFloat: false }),
        })}
      />
    </div>
  )

  const handleNumberChange =
    (name: keyof FormData) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {

        setValue(name, e.target.value.replace(",", "."), {
          shouldDirty: true,
          shouldValidate: true,
        });
      };
  return (
    <Modal isOpen={open} onClose={onClose} headerText={card.config.name} onConfirm={handleSubmit(sendConfig)} isValid={isValid}>
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
            <input
              className={`form-control ${errors.onTime ? "is-invalid" : ""}`}
              data-bs-theme="dark"
              id="onTime"
              type="time"
              {...register("onTime", {
                required: "",
                validate: (v) => {
                  if (mode !== 2) return true;
                  return validateTime(v);
                }
              })}
            />
          </div>
          <div className={cls.field}>
            <label htmlFor="offTime">Turn off time</label>
            <input
              className={`form-control ${errors.offTime ? "is-invalid" : ""}`}
              data-bs-theme="dark"
              id="offTime"
              type="time"
              {...register("offTime", {
                required: "",
                validate: (v) => {
                  if (mode !== 2) return true;
                  return validateTime(v);
                }
              })}
            />
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
          <div className={cls.field} data-bs-theme="dark">
            <label className="form-label" htmlFor="color">Color</label>
            <input className="form-control form-control-color" id="color" type="color" value={rgbToHex(staticColor.r, staticColor.g, staticColor.b)}
              onChange={(e) => setStaticColor({ r: hexToRgb(e.target.value).r, g: hexToRgb(e.target.value).g, b: hexToRgb(e.target.value).b })} />
          </div>
        </section>}
        {style === 3 && <section className={`${cls.card} ${cls.general}`}>
          <h2 className={cls.sectionTitle}>General</h2>
          {brightnessContent}
          <div className={cls.field} data-bs-theme="dark">
            <label className="form-label" htmlFor="startColor">Start color</label>
            <input className="form-control form-control-color" id="startColor" type="color" value={rgbToHex(gradientStartColor.r, gradientStartColor.g, gradientStartColor.b)}
              onChange={(e) => setGradientStartColor({ r: hexToRgb(e.target.value).r, g: hexToRgb(e.target.value).g, b: hexToRgb(e.target.value).b })} />
          </div>
          <div className={cls.field} data-bs-theme="dark">
            <label className="form-label" htmlFor="endColor">End color</label>
            <input className="form-control form-control-color" id="endColor" type="color" value={rgbToHex(gradientEndColor.r, gradientEndColor.g, gradientEndColor.b)}
              onChange={(e) => setGradientEndColor({ r: hexToRgb(e.target.value).r, g: hexToRgb(e.target.value).g, b: hexToRgb(e.target.value).b })} />
          </div>
        </section>}
        {style === 2 && <section className={`${cls.card} ${cls.general}`}>
          <h2 className={cls.sectionTitle}>General</h2>
          {brightnessContent}
          <div className={cls.field} data-bs-theme="dark">
            <label htmlFor="cycleSpeed">Speed</label>
            <input
              className={`form-control ${errors.cycleSpeed ? "is-invalid" : ""}`}
              id="cycleSpeed"
              type="text"
              inputMode="decimal"
              {...register("cycleSpeed", {
                required: "",
                validate: (v) => validateNumber(v),
              })}
              onChange={handleNumberChange("cycleSpeed")}
            />
          </div>
        </section>}
        {style === 4 && <section className={`${cls.card} ${cls.general}`}>
          <h2 className={cls.sectionTitle}>General</h2>
          {brightnessContent}
          <div className={cls.custom}>
            {card.config.custom.map((item, index) =>
              <div className={cls.field} key={index} data-bs-theme="dark">
                <label className="form-label" htmlFor="color">Color {index + 1}</label>
                <input className="form-control form-control-color" id="color" type="color" value={rgbToHex(customColor[index].r, customColor[index].g, customColor[index].b)}
                  onChange={(e) => changeCustomColorHandler(e, index)} />
              </div>
            )}
          </div>
        </section>}
      </div>
    </Modal>
  );
}