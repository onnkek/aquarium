import { PumpCardType } from 'entities/card/model/types';
import { useAppDispatch, useAppSelector } from 'models/Hook';
import { Status } from 'models/Status';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { classNames } from "shared/lib/classNames";
import { useIsMobile } from 'shared/lib/isMobile';
import { invertMode } from 'shared/lib/period';
import { validateNumber, validateString, validateTime } from 'shared/lib/validation';
import { Modal } from 'shared/ui/Modal';
import { getConfig, getCurrentInfo, IPumpPeriod, resetPump, updateDoser } from '../../../redux/AquariumSlice';
import cls from './PumpSettings.module.sass';

interface PumpSettingsProps {
  className?: string;
  open: boolean;
  onClose: () => void;
  card: PumpCardType;
}
type FormData = {
  name: string
  dosage: string;
  performance: string;
  remaining: string;
  maxVolume: string;
  time: string;
};
export const PumpSettings = ({
  className,
  open,
  onClose,
  card
}: PumpSettingsProps) => {
  const dispatch = useAppDispatch()
  const [period, setPeriod] = useState<IPumpPeriod>(card.config.period)
  const [mode, setMode] = useState(card.config.mode)
  const status = useAppSelector(state => state.aquarium.status)
  const isMobile = useIsMobile();

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
      name: card.config.name,
      dosage: String(card.config.dosage),
      performance: String(card.config.rate),
      remaining: String(card.config.currentVolume),
      maxVolume: String(card.config.maxVolume),
      time: card.config.time
    }
  });
  useEffect(() => {
    trigger();
  }, []);
  useEffect(() => {
    trigger("time");
  }, [mode]);
  useEffect(() => {
    reset({
      name: card.config.name,
      dosage: String(card.config.dosage),
      performance: String(card.config.rate),
      remaining: String(card.config.currentVolume),
      maxVolume: String(card.config.maxVolume),
      time: card.config.time
    })
    setPeriod(card.config.period)
    setMode(card.config.mode)

  }, [card.config])
  const sendConfig = async (data: FormData) => {
    await dispatch(updateDoser({
      number: card.number, config:
      {
        name: data.name,
        dosage: Number(data.dosage),
        time: data.time,
        currentVolume: Number(data.remaining),
        maxVolume: Number(data.maxVolume),
        period: period,
        mode: mode,
        status: card.config.status,
        rate: Number(data.performance),
        hasRunToday: card.config.hasRunToday
      }
    }));
    if (status === Status.Succeeded) {
      reset({
        name: card.config.name,
        dosage: String(card.config.dosage),
        performance: String(card.config.rate),
        remaining: String(card.config.currentVolume),
        maxVolume: String(card.config.maxVolume),
        time: card.config.time
      })
      setPeriod(card.config.period);
      setMode(card.config.mode);
    }
    onClose();
  }
  const sendPumpState = async () => {
    await dispatch(updateDoser({
      number: card.number, config:
      {
        ...card.config,
        mode: invertMode(mode, true)
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
    // onClose();
  }
  const handleNumberChange =
    (name: keyof FormData) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {

        setValue(name, e.target.value.replace(",", "."), {
          shouldDirty: true,
          shouldValidate: true,
        });
      };
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
      {mode === 2 && !card.config.hasRunToday && <div className={"alert alert-danger " + cls.warning} data-bs-theme="dark">
        <div>After saving the settings, the pump may start working!</div>
        <hr/>
        <div>If you need to prevent this, ensure that the current time is before the scheduled start time or set the daily flag at the bottom of the page to TRUE.</div>
      </div>}
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
        <label htmlFor="time">Turn on time</label>
        <input
          className={`form-control ${errors.time ? "is-invalid" : ""}`}
          data-bs-theme="dark"
          id="time"
          type="time"
          {...register("time", {
            required: "",
            validate: (v) => {
              if (mode !== 2) return true;
              return validateTime(v);
            }
          })}
        />
      </div>
      <div className={`${cls.field} ${cls.m0}`}>
        <label>Select working days</label>
        <div className={cls.daysWrap}>
          <div className={cls.daysRow}>
            <input type="checkbox" id="mon" checked={period.mo} onClick={(e) => setPeriod({ ...period, mo: !period.mo })} readOnly />
            <label className={cls.dayChip} htmlFor="mon">Mon</label>
            <input type="checkbox" id="tue" checked={period.tu} onClick={(e) => setPeriod({ ...period, tu: !period.tu })} readOnly />
            <label className={cls.dayChip} htmlFor="tue">Tue</label>
            <input type="checkbox" id="wed" checked={period.we} onClick={(e) => setPeriod({ ...period, we: !period.we })} readOnly />
            <label className={cls.dayChip} htmlFor="wed">Wed</label>
            <input type="checkbox" id="thu" checked={period.th} onClick={(e) => setPeriod({ ...period, th: !period.th })} readOnly />
            <label className={cls.dayChip} htmlFor="thu">Thu</label>
            <input type="checkbox" id="fri" checked={period.fr} onClick={(e) => setPeriod({ ...period, fr: !period.fr })} readOnly />
            <label className={cls.dayChip} htmlFor="fri">Fri</label>
            <input type="checkbox" id="sat" checked={period.sa} onClick={(e) => setPeriod({ ...period, sa: !period.sa })} readOnly />
            <label className={cls.dayChip} htmlFor="sat">Sat</label>
            <input type="checkbox" id="sun" checked={period.su} onClick={(e) => setPeriod({ ...period, su: !period.su })} readOnly />
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
      <button className={`btn btn-danger ${cls.button}`} onClick={resetPumpHandler}>{card.config.hasRunToday ? "Reset daily flag" : "Set daily flag"}</button>
      <div className={cls.note}>Reset the daily flag when you need the pump to be allowed to run again on the same day.</div>
    </section>
  )
  const generalContent = (
    <section className={cls.card}>
      <h2 className={cls.sectionTitle}>General</h2>
      <div className={cls.field}>
        <label htmlFor="name">Name</label>
        <input
          className={`form-control ${errors.name ? "is-invalid" : ""}`}
          data-bs-theme="dark"
          id="name"
          type="text"
          {...register("name", {
            required: "",
            validate: (v) =>
              validateString(v, {
                minLength: 1,
                maxLength: 20,
              }),
          })}
        />
      </div>
      <div className={cls.field}>
        <label htmlFor="dose">Dosage</label>
        <input
          className={`form-control ${errors.dosage ? "is-invalid" : ""}`}
          data-bs-theme="dark"
          id="dose"
          type="text"
          inputMode="decimal"
          {...register("dosage", {
            required: "",
            validate: (v) => validateNumber(v),
          })}
          onChange={handleNumberChange("dosage")}
        />
      </div>
      <div className={cls.field}>
        <label htmlFor="performance">Performance</label>
        <input
          className={`form-control ${errors.performance ? "is-invalid" : ""}`}
          data-bs-theme="dark"
          id="performance"
          type="text"
          inputMode="decimal"
          {...register("performance", {
            required: "",
            validate: (v) => validateNumber(v),
          })}
          onChange={handleNumberChange("performance")}
        />
      </div>
      <div className={cls.field}>
        <label htmlFor="remaining">Remaining volume</label>
        <input
          className={`form-control ${errors.remaining ? "is-invalid" : ""}`}
          data-bs-theme="dark"
          id="remaining"
          type="text"
          inputMode="decimal"
          {...register("remaining", {
            required: "",
            validate: (v) => validateNumber(v),
          })}
          onChange={handleNumberChange("remaining")}
        />
      </div>
      <div className={`${cls.field} ${cls.m0}`}>
        <label htmlFor="maxVolume">Max volume</label>
        <input
          className={`form-control ${errors.maxVolume ? "is-invalid" : ""}`}
          data-bs-theme="dark"
          id="maxVolume"
          type="text"
          inputMode="decimal"
          {...register("maxVolume", {
            required: "",
            validate: (v) => validateNumber(v),
          })}
          onChange={handleNumberChange("maxVolume")}
        />
      </div>
    </section>
  )

  return (
    <Modal isOpen={open} onClose={onClose} headerText={card.config.name} onConfirm={handleSubmit(sendConfig)} isValid={isValid}>
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
      </div>
    </Modal>
  );
}