import { SystemCardType } from 'entities/card/model/types';
import { useAppDispatch, useAppSelector } from 'models/Hook';
import { Status } from 'models/Status';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getCurrentInfo, updateDateTime, updateFanSpeed, updateSystem } from 'redux/AquariumSlice';
import { classNames, Mods } from "shared/lib/classNames";
import { getDateFromInput, getTimeFromInput, getUptime, toDateInput, toTimeInput } from 'shared/lib/period';
import { validateDate, validateNumber, validateTime } from 'shared/lib/validation';
import { Modal } from 'shared/ui/Modal';
import { Slider } from 'shared/ui/Slider';
import cls from './ServerSettings.module.sass';

interface ServerSettingsProps {
  className?: string;
  open: boolean;
  onClose: () => void;
  card: SystemCardType;
}

type FormData = {
  update: string;
  date: string;
  time: string;
};

export const ServerSettings = ({
  className,
  open,
  onClose,
  card
}: ServerSettingsProps) => {
  const dispatch = useAppDispatch()
  const status = useAppSelector(state => state.aquarium.status)
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [speed, setSpeed] = useState(card.config.pwm);
  // const [updateTime, setUpdateTime] = useState<string>(String(card.config.update))
  // const [updateTimeError, setUpdateTimeError] = useState(false)
  // const [dateTime, setDateTime] = useState(card.current.time)
  // const [time, setTime] = useState({
  //   hour: card.current.time.hour,
  //   minute: card.current.time.minute,
  //   second: card.current.time.second
  // })

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
      update: String(card.config.update),
      date: toDateInput(card.current.time),
      time: toTimeInput(card.current.time),
    }
  });

  useEffect(() => {
    trigger();
  }, []);

  const handleSliderChange = useCallback(
    (value: number | number[]) => {
      const nextValue = Array.isArray(value) ? value[0] : value;
      setSpeed(nextValue);

      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        dispatch(updateFanSpeed(nextValue))
      }, 500);
    }, [dispatch]);

  useEffect(() => () => clearTimeout(timerRef.current), []);
  const sendConfig = async (data: FormData) => {
    const date = getDateFromInput(data.date);
    const time = getTimeFromInput(data.time);
    await dispatch(updateSystem({ update: Number(data.update) }))
    await dispatch(updateDateTime({
      dateTime: {
        ...card.current.time,
        day: date.day,
        month: date.month,
        year: date.year,
        hour: time.hour,
        minute: time.minute,
        second: time.second
      }
    }))
    if (status === Status.Succeeded) {
      reset({
        update: String(card.config.update),
        date: toDateInput(card.current.time),
        time: toTimeInput(card.current.time),
      })
      setTimeout(() => {
        dispatch(getCurrentInfo())
      }, 200);
    }
    onClose();
  }
  useEffect(() => {
    reset({
      update: String(card.config.update),
      date: toDateInput(card.current.time),
      time: toTimeInput(card.current.time),
    })
  }, [card.config])
  const mods: Mods = {
    // [cls.on]: card.current.status !== 0
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
    <Modal isOpen={open} onClose={onClose} headerText={card.config.name} onConfirm={handleSubmit(sendConfig)} isValid={isValid}>
      <div className={classNames(cls.serverSettings, mods, [className])}>

        <section className={cls.card}>
          <h2>Server Overview</h2>
          <div className={cls.statusRow}>
            <div>
              <div className={cls.statusLabel}>System uptime</div>
              <div className={cls.statusValue}>{getUptime(card.current.uptime, false)}</div>
            </div>
          </div>
        </section>

        <section className={cls.card}>
          <h2 className={cls.sectionTitle}>DateTime & Refresh</h2>
          <div className={cls.field}>
            <label htmlFor="onTime">Server date</label>
            <input
              className={`form-control ${errors.date ? "is-invalid" : ""}`}
              data-bs-theme="dark"
              id="date"
              type="date"
              {...register("date", { 
                required: "",
                validate: validateDate,
              })}
            />
          </div>
          <div className={cls.field}>
            <label htmlFor="onTime">Server time</label>
            <input
              className={`form-control ${errors.time ? "is-invalid" : ""}`}
              data-bs-theme="dark"
              id="time"
              type="time"
              {...register("time", {
                required: "",
                validate: validateTime,
              })}
            />
          </div>
          <div className={cls.field}>
            <label htmlFor="update">Refresh interval</label>
            <input
              className={`form-control ${errors.update ? "is-invalid" : ""}`}
              data-bs-theme="dark"
              id="update"
              type="text"
              inputMode='decimal'
              {...register("update", {
                required: "",
                validate: (v) => validateNumber(v, { allowZero: false, allowFloat: false }),
              })}
              onChange={handleNumberChange("update")}
            />
          </div>
        </section>


        <section className={cls.card}>
          <h2>Chip Metrics</h2>
          <div className={cls.metricGrid}>
            <div className={cls.metric}>
              <span>Chip temperature</span>
              <strong id="temp">{card.current.chipTemp} °C</strong>
            </div>
            <div className={cls.metric}>
              <span>Chip frequency</span>
              <strong id="freq">{card.current.frequency} MHz</strong>
            </div>
            <div className={cls.metric}>
              <span>Fan speed</span>
              <strong id="fanSpeedLabel">{card.current.fan} RPM</strong>
            </div>
          </div>
        </section>

        <section className={cls.card}>
          <h2>Fan Control</h2>
          <div className={cls.sliderWrap}>
            <div className={cls.sliderHead}>
              <span>Adjust speed</span>
              <strong id="fanPercent">{speed}%</strong>
            </div>
            <Slider className={cls.slider} minValue={0} maxValue={100} aria-label='fan control' value={speed} text='none' onChange={handleSliderChange} />
            <div className={cls.sliderMeta}>
              <span>0%</span>
              <span id="fanHint">{speed >= 35 ? (speed < 75 ? "Balanced cooling" : "Maximum cooling") : "Quiet cooling"}</span>
              <span>100%</span>
            </div>
          </div>
          <div className={cls.hint}>Fan speed changes in real time. Set 0% to stop and 100% for maximum cooling.</div>
        </section>

        <section className={cls.card}>
          <h2>Memory (RAM)</h2>
          <div>
            <div className={cls.barTop}><span>Total: {(card.current.heapSize / 1024).toFixed(1)} KB</span><strong>{((card.current.heapSize - card.current.freeHeap) / card.current.heapSize * 100).toFixed(1)}% Used</strong></div>
            <div className={cls.bar}><div className={`${cls.fill} ${cls.warn}`} style={{ width: `${((card.current.heapSize - card.current.freeHeap) / card.current.heapSize * 100).toFixed(1)}%` }}></div></div>
            <div className={cls.barLegend}><span>{((card.current.heapSize - card.current.freeHeap) / 1024).toFixed(1)} KB Used</span><span>{(card.current.freeHeap / 1024).toFixed(1)} KB Free</span></div>
          </div>
        </section>

        <section className={cls.card}>
          <h2>SD Storage</h2>
          <div>
            <div className={cls.barTop}><span>Total: {(card.current.totalSpace / 1024 / 1024 / 1024).toFixed(1)} GB</span><strong>{(card.current.usedSpace / card.current.totalSpace * 100).toFixed(1)}% Used</strong></div>
            <div className={cls.bar}><div className={`${cls.fill} ${cls.bad}`} style={{ width: `${(card.current.usedSpace / card.current.totalSpace * 100).toFixed(1)}%` }}></div></div>
            <div className={cls.barLegend}><span>{(card.current.usedSpace / 1024 / 1024).toFixed(1)} MB Used</span><span>{(card.current.freeSpace / 1024 / 1024 / 1024).toFixed(1)} GB Free</span></div>
          </div>
        </section>
      </div>
    </Modal>
  );
}