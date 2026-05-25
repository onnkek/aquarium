import { TempCardType } from 'entities/card/model/types';
import { useAppDispatch, useAppSelector } from 'models/Hook';
import { Status } from 'models/Status';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { classNames } from "shared/lib/classNames";
import { invertCoolMode, invertHeatMode } from 'shared/lib/period';
import { validateNumber } from 'shared/lib/validation';
import { Modal } from 'shared/ui/Modal';
import { getCurrentInfo, updateTemp } from '../../../redux/AquariumSlice';
import cls from './TempSettings.module.sass';

interface TempSettingsProps {
  className?: string;
  open: boolean;
  onClose: () => void;
  card: TempCardType;
}
type FormData = {
  setting: string;
  k: string;
  hysteresis: string;
  timeout: string;
};

export const TempSettings = ({
  className,
  open,
  onClose,
  card
}: TempSettingsProps) => {
  const dispatch = useAppDispatch()
  const [mode, setMode] = useState(card.config.mode)
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
      setting: String(card.config.setting),
      k: String(card.config.k),
      hysteresis: String(card.config.hysteresis),
      timeout: String(card.config.timeout)
    }
  });


  useEffect(() => {
    setMode(card.config.mode)
    reset({
      setting: String(card.config.setting),
      k: String(card.config.k),
      hysteresis: String(card.config.hysteresis),
      timeout: String(card.config.timeout)
    })
  }, [card.config])

  const toggleCoolState = async () => {
    await dispatch(updateTemp({
      ...card.config,
      mode: invertCoolMode(mode)
    }))
    if (status === Status.Succeeded) {
      setMode(invertCoolMode(mode))
      setTimeout(() => {
        dispatch(getCurrentInfo())
      }, 200);
    }
  }
  const toggleHeatState = async () => {
    await dispatch(updateTemp({
      ...card.config,
      mode: invertHeatMode(mode)
    }))
    if (status === Status.Succeeded) {
      setMode(invertHeatMode(mode))
      setTimeout(() => {
        dispatch(getCurrentInfo())
      }, 200);
    }
  }

  const sendConfig = async (data: FormData) => {
    await dispatch(updateTemp({
      name: card.config.name,
      setting: Number(data.setting),
      k: Number(data.k),
      hysteresis: Number(data.hysteresis),
      timeout: Number(data.timeout),
      mode: mode
    }))
    if (status === Status.Succeeded) {
      reset({
        setting: String(card.config.setting),
        k: String(card.config.k),
        hysteresis: String(card.config.hysteresis),
        timeout: String(card.config.timeout)
      })
      setMode(card.config.mode)
    }
    onClose();
  }



  const handleNumberChange =
    (name: keyof FormData) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {

        setValue(name, e.target.value.replace(",", "."), {
          shouldDirty: true,
          shouldValidate: true,
        });
      };


  return (
    <Modal onClose={onClose} isOpen={open} headerText={card.config.name} onConfirm={handleSubmit(sendConfig)} isValid={isValid}>
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
                  <input type="radio" name="coolState" id="coolStateOn" checked={(card.current.status === 1 || card.current.status === 3)} readOnly />
                  <label htmlFor="coolStateOn" onClick={toggleCoolState}>On</label>
                  <input type="radio" name="coolState" id="coolStateOff" checked={!(card.current.status == 1 || card.current.status == 3)} readOnly />
                  <label htmlFor="coolStateOff" onClick={toggleCoolState}>Off</label>
                </div>
              </div>
              <div className={cls.field} style={{ marginBottom: "0px" }}>
                <div className={cls.info}>
                  <label>Heating state</label>
                </div>

                <div className={cls.segmented}>
                  <input type="radio" name="heatState" id="heatStateOn" checked={(card.current.status === 2 || card.current.status === 3)} readOnly />
                  <label htmlFor="heatStateOn" onClick={toggleHeatState} >On</label>
                  <input type="radio" name="heatState" id="heatStateOff" checked={!(card.current.status === 2 || card.current.status === 3)} readOnly />
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
            <input
              className={`form-control ${errors.setting ? "is-invalid" : ""}`}
              data-bs-theme="dark"
              id="setting"
              type="text"
              inputMode="decimal"
              {...register("setting", {
                required: "",
                validate: (v) => validateNumber(v),
              })}
              onChange={handleNumberChange("setting")}
            />
          </div>
          <div className={cls.field}>
            <label htmlFor="k">K</label>
            <input
              className={`form-control ${errors.k ? "is-invalid" : ""}`}
              data-bs-theme="dark"
              id="k"
              type="text"
              inputMode="decimal"
              {...register("k", {
                required: "",
                validate: (v) => validateNumber(v),
              })}
              onChange={handleNumberChange("k")}
            />
          </div>
          <div className={cls.field}>
            <label htmlFor="hysteresis">Hysteresis</label>
            <input
              className={`form-control ${errors.hysteresis ? "is-invalid" : ""}`}
              data-bs-theme="dark"
              id="hysteresis"
              type="text"
              inputMode="decimal"
              {...register("hysteresis", {
                required: "",
                validate: (v) => validateNumber(v),
              })}
              onChange={handleNumberChange("hysteresis")}
            />
          </div>
          <div className={cls.field}>
            <label htmlFor="timeout">Timeout</label>
            <input
              className={`form-control ${errors.timeout ? "is-invalid" : ""}`}
              data-bs-theme="dark"
              id="timeout"
              type="text"
              inputMode="decimal"
              {...register("timeout", {
                required: "",
                validate: (v) => validateNumber(v),
              })}
              onChange={handleNumberChange("timeout")}
            />
          </div>
        </section>
      </div>
    </Modal>
  );
}