import { useState } from "react";
import { classNames } from "shared/lib/classNames";
import { Modal } from 'shared/ui/Modal';
import cls from './FertCalc.module.sass';

interface FertCalcProps {
  className?: string;
  open: boolean;
  onClose: () => void;
}
type FormData = {
  setting: string;
  k: string;
  hysteresis: string;
  timeout: string;
};

export const FertCalc = ({
  className,
  open,
  onClose
}: FertCalcProps) => {

  const [V, setV] = useState(300)
  const [N, setN] = useState(0)
  const [P, setP] = useState(0)
  const [redP, setRedP] = useState(1)
  const [redN, setRedN] = useState(20)


  return (
    <Modal onClose={onClose} isOpen={open} headerText={"Fertilizer Calculator"}>
      <div className={classNames(cls.fertCalc, {}, [className])}>

        <section className={cls.card}>
          {/* <h2 className={cls.sectionTitle}>General</h2> */}
          <div className={cls.field}>
            <label htmlFor="v">Aquarium volume (L)</label>
            <input
              className={`form-control`}
              data-bs-theme="dark"
              id="v"
              type="number"
              inputMode="decimal"
              value={V}
              onChange={(e) => setV(Number(e.target.value))}
            />
          </div>
          <div className={cls.field}>
            <label htmlFor="redP">Increase PO4 (mg/L)</label>
            <input
              className={`form-control`}
              data-bs-theme="dark"
              id="redP"
              type="number"
              inputMode="decimal"
              value={redP}
              onChange={(e) => setRedP(Number(e.target.value))}
            />
          </div>
          <div className={cls.field}>
            <label htmlFor="redN">Redfield ratio (NO3:PO4)</label>
            <input
              className={`form-control`}
              data-bs-theme="dark"
              id="redN"
              type="number"
              inputMode="decimal"
              value={redN}
              onChange={(e) => setRedN(Number(e.target.value))}
            />
          </div>
          <div className={cls.metricGrid}>
            <label>Result</label>
            <div className={cls.metric}>
              <span>NO3 increase</span>
              <strong id="temp">{(redP * redN).toFixed(2)} mg/L</strong>
            </div>
            <div className={cls.metric}>
              <span>Dose PO4</span>
              <strong id="freq">{(redP * V / 10.467910).toFixed(2)} ml</strong>
            </div>
            <div className={cls.metric}>
              <span>Dose NO3</span>
              <strong id="fanSpeedLabel">{(redP * redN * V / 101.960743).toFixed(2)} ml</strong>
            </div>
            <div className={cls.metric}>
              <span>Daily NO3 dose</span>
              <strong id="fanSpeedLabel">{(redP * V / 10.467910 / 7).toFixed(2)} ml</strong>
            </div>
            <div className={cls.metric}>
              <span>Daily PO4 dose</span>
              <strong id="fanSpeedLabel">{(redP * redN * V / 101.960743 / 7).toFixed(2)} ml</strong>
            </div>
          </div>
        </section>
      </div>
    </Modal>
  );
}