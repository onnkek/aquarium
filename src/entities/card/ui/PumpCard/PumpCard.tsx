import { PumpCardType } from 'entities/card/model/types';
import { ReactComponent as PumpIcon } from 'shared/assets/icons/aquarium/pump.svg';
import { classNames, Mods } from "shared/lib/classNames";
import { Badge } from 'shared/ui/Badge';
import cls from './PumpCard.module.sass';

interface PumpCardProps {
  className?: string;
  card: PumpCardType;
  onToggle: () => void;
}

export const PumpCard = ({
  className,
  card,
  onToggle
}: PumpCardProps) => {

  const mods: Mods = {
    [cls.on]: card.current.status
  }

  return (
    <div className={classNames(cls.pumpCard, {}, [className])} onClick={onToggle}>
      <div className={cls.section + " " + cls.device}>
        <div className={cls.deviceTop}>
          <div className={cls.deviceLeft}>
            <PumpIcon className={cls.icon} />
            <div className={cls.deviceName}>
              <h4>{card.config.name}</h4>
              <div className={cls.chips}>
                {card.current.status && <Badge theme='outline' color='success'>ON</Badge>}
                {!card.current.status && <Badge theme='outline' color='black'>OFF</Badge>}
                {card.config.mode === 2 && <Badge theme='outline' color='success'>AUTO</Badge>}
                {card.config.mode !== 2 && <Badge theme='outline' color='black'>MANUAL</Badge>}
              </div>
            </div>
          </div>


        </div>
        <div className={cls.metric}>
          <span>Added Fertilizer</span>
          <strong>{(card.current.introduced / 100 * card.config.dosage).toFixed(1)} / {card.config.dosage.toFixed(1)} ml</strong>
          <div className={cls.progress}>
            <div className={cls.bar} style={{ width: `${card.current.introduced.toFixed(0)}%`}}></div>
          </div>
          <div className={cls.sub}>
            <span>{(card.current.introduced).toFixed(0)}% completed</span>
            <span>{`${(card.config.dosage - card.config.dosage * card.current.introduced / 100).toFixed(0)} ml left`}</span>
          </div>
        </div>
        <div className={cls.metric}>
          <span>Fertilizer Left in Bottle</span>
          <strong>{card.config.currentVolume.toFixed(0)} / {card.config.maxVolume.toFixed(0)} ml</strong>
          <div className={cls.progress}><div className={cls.bar} style={{ width: `${card.config.currentVolume / card.config.maxVolume * 100}%` }}></div></div>
          <div className={cls.sub}><span>{((card.config.currentVolume / card.config.maxVolume) * 100).toFixed(0)}% remaining</span><span>{(card.config.currentVolume / card.config.dosage).toFixed(0)} days</span></div>
        </div>
      </div>
    </div>
  );
}