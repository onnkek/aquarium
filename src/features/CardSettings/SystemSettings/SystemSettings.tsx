import { RelayCardType, SystemCardType, TempCardType } from 'entities/card/model/types';
import cls from './SystemSettings.module.sass';
import { classNames, Mods } from "shared/lib/classNames";
import { ReactComponent as UpdateIcon } from 'shared/assets/icons/aquarium/arrow-up.svg';
import { ReactComponent as TimeIcon } from 'shared/assets/icons/aquarium/time.svg';
import { ReactComponent as DateIcon } from 'shared/assets/icons/aquarium/calendar.svg';
import { ReactComponent as ChipIcon } from 'shared/assets/icons/aquarium/power.svg'
import { ReactComponent as ScheduleIcon } from 'shared/assets/icons/aquarium/lightning.svg'
import { SettingsWrapper } from '../SettingsWrapper';
import { SettingsItem } from 'shared/ui/settings/SettingsItem';
import { SettingsSection } from 'shared/ui/settings/SettingsSection';
import { useEffect, useState } from 'react';
import { Input } from 'shared/ui/Input';
import { getDateFromInput, getDateISO, getDateTimeFromInput, getDateTimeISO, getTimeFromInput, getTimeISO } from 'shared/lib/period';
import { useAppDispatch, useAppSelector } from 'models/Hook';
import { getCurrentInfo, updateDateTime, updateSystem } from '../../../redux/AquariumSlice';
import { Status } from 'models/Status';

interface SystemSettingsProps {
  className?: string;
  open: boolean;
  onClose: () => void;
  card: SystemCardType;
}

export const SystemSettings = ({
  className,
  open,
  onClose,
  card
}: SystemSettingsProps) => {
  const dispatch = useAppDispatch()
  const status = useAppSelector(state => state.aquarium.status)
  const [updateTime, setUpdateTime] = useState(card.config.update)
  const [dateTime, setDateTime] = useState(card.current.time)
  const [time, setTime] = useState({
    hour: card.current.time.hour,
    minute: card.current.time.minute,
    second: card.current.time.second
  })

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
    <SettingsWrapper open={open} onClose={onClose} card={card} onCofirm={onSendConfig}>
      <div className={classNames(cls.systemSettings, mods, [className])}>
        <div className={cls.body}>

          {<ChipIcon className={cls.icon} />}

          <SettingsSection className={cls.settings}>
            <SettingsItem
              label="Date"
              icon={<DateIcon />}
              control={<Input
                className={cls.input}
                type="date"
                step={1}
                value={getDateISO(dateTime)}
                onChange={(e) => setDateTime(
                  {
                    ...dateTime,
                    day: getDateFromInput(e.target.value).day,
                    month: getDateFromInput(e.target.value).month,
                    year: getDateFromInput(e.target.value).year
                  }
                )} />}
            />
            <SettingsItem
              label="Time"
              icon={<TimeIcon />}
              control={<Input
                className={cls.input}
                type="time"
                step={1}
                value={getTimeISO(dateTime)}
                onChange={(e) => setDateTime(
                  {
                    ...dateTime,
                    hour: getTimeFromInput(e.target.value).hour,
                    minute: getTimeFromInput(e.target.value).minute,
                    second: getTimeFromInput(e.target.value).second
                  }
                )} />}
            />
            <SettingsItem
              label="Update time"
              icon={<UpdateIcon />}
              control={<Input className={cls.input} type="number" value={updateTime} onChange={(e) => setUpdateTime(Number(e.target.value))} />}
            />
          </SettingsSection>
        </div>
      </div>
    </SettingsWrapper>
  );
}