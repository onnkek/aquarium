import { RelayCardType, SystemCardType, TempCardType } from 'entities/card/model/types';
import cls from './ServerSettings.module.sass';
import { classNames, Mods } from "shared/lib/classNames";
import { ReactComponent as TempIcon } from 'shared/assets/icons/aquarium/temp2.svg';
import { ReactComponent as ChipIcon } from 'shared/assets/icons/aquarium/chip.svg';
import { ReactComponent as FanIcon } from 'shared/assets/icons/aquarium/fan.svg';
import { ReactComponent as TimeIcon } from 'shared/assets/icons/aquarium/time.svg'
import { ReactComponent as ScheduleIcon } from 'shared/assets/icons/aquarium/lightning.svg'
import { SettingsWrapper } from '../SettingsWrapper';
import { ProgressCircle } from 'shared/ui/ProgressCircle';
import { SettingsSection } from 'shared/ui/settings/SettingsSection';
import { SettingsItem } from 'shared/ui/settings/SettingsItem';
import { getDateFromInput, getDateISO, getTimeFromInput, getTimeISO, getUptime } from 'shared/lib/period';
import { Input } from 'shared/ui/Input';
import { Slider } from 'shared/ui/Slider';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'models/Hook';
import { getConfig, getCurrentInfo, updateDateTime, updateFanSpeed, updateSystem } from 'redux/AquariumSlice';
import { Status } from 'models/Status';

interface ServerSettingsProps {
  className?: string;
  open: boolean;
  onClose: () => void;
  card: SystemCardType;
}

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
  const [updateTime, setUpdateTime] = useState(card.config.update)
  const [dateTime, setDateTime] = useState(card.current.time)
  const [time, setTime] = useState({
    hour: card.current.time.hour,
    minute: card.current.time.minute,
    second: card.current.time.second
  })

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
  const onSendConfig = async () => {
    await dispatch(updateSystem({ update: updateTime }))
    await dispatch(updateDateTime({ dateTime: dateTime }))
    if (status === Status.Succeeded) {
      setUpdateTime(card.config.update)
      setTimeout(() => {
        dispatch(getCurrentInfo())
      }, 200);
    }
    onClose();
  }
  useEffect(() => {
    setUpdateTime(card.config.update);
    setDateTime(card.current.time);
  }, [card.config])
  const mods: Mods = {
    // [cls.on]: card.current.status !== 0
  }



  return (
    <SettingsWrapper open={open} onClose={onClose} card={card} onConfirm={onSendConfig}>
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
            <input id="onTime" type="date" value={getDateISO(dateTime)}
              onChange={(e) => setDateTime(
                {
                  ...dateTime,
                  day: getDateFromInput(e.target.value).day,
                  month: getDateFromInput(e.target.value).month,
                  year: getDateFromInput(e.target.value).year
                }
              )} />
          </div>
          <div className={cls.field}>
            <label htmlFor="onTime">Server time</label>
            <input id="onTime" type="time" value={getTimeISO(dateTime)}
              onChange={(e) => setDateTime(
                {
                  ...dateTime,
                  hour: getTimeFromInput(e.target.value).hour,
                  minute: getTimeFromInput(e.target.value).minute,
                  second: getTimeFromInput(e.target.value).second
                }
              )} />
          </div>
          <div className={cls.field}>
            <label htmlFor="onTime">Refresh interval</label>
            <input id="onTime" type="number" value={updateTime} onChange={(e) => setUpdateTime(Number(e.target.value))} />
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

        {/* <SettingsSection className={cls.settings}>
          <SettingsItem
            label="Uptime"
            icon={<TimeIcon />}
            control={<p className={cls.uptime}>{getUptime(card.current.uptime, false)}</p>}
          />
          <SettingsItem
            label="Chip temperature"
            icon={<TempIcon />}
            control={<p className={cls.uptime}>{card.current.chipTemp} °C</p>}
          />

          <SettingsItem
            label="Fan speed"
            icon={<FanIcon />}
            control={<p className={cls.uptime}>{card.current.fan} RPM</p>}
          />
          <div className='slider'>
            <Slider minValue={0} maxValue={100} value={speed} onChange={handleSliderChange} />
          </div>

          <SettingsItem
            label="Chip frequency"
            icon={<ChipIcon />}
            control={<p className={cls.uptime}>{card.current.frequency} MHz</p>}
          />
        </SettingsSection>
        <div className={cls.container}>
          <div className={cls.item}>
            <ProgressCircle size='S' title='SD' value={card.current.usedSpace / card.current.totalSpace * 100} />
            <div className={cls.info}>
              <div className={cls.text}>
                <p>Total space:</p>
                <p>{(card.current.totalSpace / 1024 / 1024 / 1024).toFixed(1)} GB</p>
              </div>
              <div className={cls.text}>
                <p>Used space:</p>
                <p>{(card.current.usedSpace / 1024 / 1024).toFixed(1)} MB</p>
              </div>
              <div className={cls.text}>
                <p>Free space:</p>
                <p>{(card.current.freeSpace / 1024 / 1024 / 1024).toFixed(1)} GB</p>
              </div>
            </div>
          </div>
          <div className={cls.item}>
            <ProgressCircle size='S' title='RAM' value={(card.current.heapSize - card.current.freeHeap) / card.current.heapSize * 100} />
            <div className={cls.info}>
              <div className={cls.text}>
                <p>Total RAM:</p>
                <p>{(card.current.heapSize / 1024).toFixed(1)} KB</p>
              </div>
              <div className={cls.text}>
                <p>Used RAM:</p>
                <p>{((card.current.heapSize - card.current.freeHeap) / 1024).toFixed(1)} KB</p>
              </div>
              <div className={cls.text}>
                <p>Free RAM:</p>
                <p>{(card.current.freeHeap / 1024).toFixed(1)} KB</p>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </SettingsWrapper>
  );
}