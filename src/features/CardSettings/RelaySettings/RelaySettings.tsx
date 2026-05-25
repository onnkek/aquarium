import { RelayCardType, RelaySubtype } from 'entities/card/model/types';
import { useAppDispatch, useAppSelector } from 'models/Hook';
import { Status } from 'models/Status';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { classNames, Mods } from "shared/lib/classNames";
import { invertMode } from 'shared/lib/period';
import { validateTime } from 'shared/lib/validation';
import { Modal } from 'shared/ui/Modal';
import { getCurrentInfo, updateRelay } from '../../../redux/AquariumSlice';
import cls from './RelaySettings.module.sass';

interface RelaySettingsProps {
  className?: string;
  open: boolean;
  onClose: () => void;
  card: RelayCardType;
}
type FormData = {
  onTime: string
  offTime: string;
};
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
      onTime: card.config.on,
      offTime: card.config.off
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
      onTime: card.config.on,
      offTime: card.config.off
    })
    setMode(card.config.mode)
  }, [card.config])

  const changeState = async () => {
    await dispatch(updateRelay({
      subtype: card.subtype,
      relay: {
        ...card.config,
        mode: invertMode(mode, card.current.status)
      }
    }));

    if (status === Status.Succeeded) {
      setMode(invertMode(mode, card.current.status))
      setTimeout(() => {
        dispatch(getCurrentInfo())
      }, 200); // Написать чтобы сервер на апдейт кофига возвращал не новый конфиг, а currentInfo
    }
  }
  const sendConfig = async (data: FormData) => {
    await dispatch(updateRelay({
      subtype: card.subtype,
      relay: {
        on: data.onTime,
        off: data.offTime,
        mode: mode,
        name: card.config.name
      }
    }));
    if (status === Status.Succeeded) {
      reset({
        onTime: card.config.on,
        offTime: card.config.off
      })
      setMode(card.config.mode)
    }
    onClose();
  }


  const mods: Mods = {
    [relaySubtypeClasses[card.subtype]]: true
  }
  console.log(mode)
  return (
    <Modal isOpen={open} onClose={onClose} headerText={card.config.name} onConfirm={handleSubmit(sendConfig)} isValid={isValid}>
      <div className={classNames(cls.relaySettings, mods, [className])}>

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
                  <span className={classNames(cls.dot, { [cls.active]: card.current.status }, [])}></span> Relay is {card.current.status ? "" : "in"}active</span>
                <span className={classNames(cls.statusTag, { [cls.active]: card.current.status }, [])}>{card.current.status ? "ON" : "OFF"}</span>
              </div>
            </div>
          }
        </section>


        {mode === 2 && <section className={cls.card}>
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
      </div >
    </Modal >
  );
}