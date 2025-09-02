import { RelayCardType, SystemCardType, TempCardType } from 'entities/card/model/types';
import cls from './ServerSettings.module.sass';
import { classNames, Mods } from "shared/lib/classNames";
import { ReactComponent as TempIcon } from 'shared/assets/icons/aquarium/temp2.svg';
import { ReactComponent as ChipIcon } from 'shared/assets/icons/aquarium/chip.svg';
import { ReactComponent as HeatIcon } from 'shared/assets/icons/heat.svg';
import { ReactComponent as TimeIcon } from 'shared/assets/icons/aquarium/time.svg'
import { ReactComponent as ScheduleIcon } from 'shared/assets/icons/aquarium/lightning.svg'
import { SettingsWrapper } from '../SettingsWrapper';
import { ProgressCircle } from 'shared/ui/ProgressCircle';
import { SettingsSection } from 'shared/ui/settings/SettingsSection';
import { SettingsItem } from 'shared/ui/settings/SettingsItem';
import { getUptime } from 'shared/lib/period';

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


  const mods: Mods = {
    // [cls.on]: card.current.status !== 0
  }

  return (
    <SettingsWrapper open={open} onClose={onClose} card={card}>
      <div className={classNames(cls.serverSettings, mods, [className])}>

        <SettingsSection className={cls.settings}>
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
        </div>
      </div>
    </SettingsWrapper>
  );
}