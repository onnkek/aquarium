import { PumpCardType } from 'entities/card/model/types';
import cls from './PumpCard.module.sass';
import { classNames, Mods } from "shared/lib/classNames";
import { ReactComponent as PumpIcon } from 'shared/assets/icons/aquarium/pump.svg'
import { ReactComponent as BottleIcon } from 'shared/assets/icons/aquarium/bottle.svg'
import { ReactComponent as DropIcon } from 'shared/assets/icons/aquarium/drop.svg'
import { ReactComponent as ManualIcon } from 'shared/assets/icons/aquarium/hand.svg'
import { ReactComponent as ScheduleIcon } from 'shared/assets/icons/aquarium/arrow-up.svg'
import { Progress } from 'shared/ui/Progress';
import { CardBase } from '../CardBase';
import { Badge } from 'shared/ui/Badge';

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
              <h4>Pump 1</h4>
              <div className={cls.chips}>
                <Badge theme='outline' color='success'>ON</Badge>
                <Badge theme='outline' color='success'>AUTO</Badge>
              </div>
            </div>
          </div>


        </div>
        <div className={cls.metric}>
          <span>Added Fertilizer</span>
          <strong>120 / 200 ml</strong>
          <div className={cls.progress}>
            <div className={cls.bar} style={{ width: "60%" }}></div>
          </div>
          <div className={cls.sub}>
            <span>60% completed</span>
            <span>80 ml left</span>
          </div>
        </div>
        <div className={cls.metric}>
          <span>Fertilizer Left in Tank</span>
          <strong>780 / 1000 ml</strong>
          <div className={cls.progress}><div className={cls.bar} style={{ width: "78%" }}></div></div>
          <div className={cls.sub}><span>78% remaining</span><span>220 ml used</span></div>
        </div>
      </div>
      {/* <div className={classNames(cls.pumpCard, mods, [className])} onClick={onToggle}>
        <div className={cls.body}>


          {<PumpIcon className={cls.icon} />}
          <div className={cls.right}>
            <h2 className={cls.name}>{card.config.name}</h2>
            <p className={cls.status}>{card.current.status ? "On" : "Off"}</p>
          </div>
        </div>

        <span className={cls.blur}></span>

        <div className={cls.mode}>
          {card.config.mode !== 2 ? <ManualIcon /> : <ScheduleIcon />}
          <p>{card.config.mode !== 2 ? "Manual" : `${card.config.time}`}</p>
        </div>
        <div className={cls.mode}>
          <DropIcon className={cls.modeIcon} />
          <p>{(card.current.introduced / 100 * card.config.dosage).toFixed(0)}/{card.config.dosage.toFixed(0)} ml</p>
          <Progress className={cls.progress_dose} text="none" value={card.current.introduced} />
        </div>
        <div className={cls.mode}>
          <BottleIcon className={cls.modeIcon} />
          <p>{(card.config.currentVolume / card.config.dosage).toFixed(0)} days</p>
          <Progress className={cls.progress} text="none" value={card.config.currentVolume / card.config.maxVolume * 100} />
        </div>
      </div> */}
    </div>
  );
}