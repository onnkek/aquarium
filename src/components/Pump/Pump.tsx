import React from "react"
import { PumpItem } from '../PumpItem/PumpItem';
import './Pump.sass';
import { IPump } from "../../redux/AquariumSlice";

interface PumpProps {
  pump1: IPump
  pump2: IPump
  pump3: IPump
  pump4: IPump
}

export const Pump = ({ pump1, pump2, pump3, pump4 }: PumpProps) => {
  return (
    <div className="pump">
      <PumpItem
        number={1}
        name={pump1.name}
        setDose={pump1.dose}
        setPeriod={pump1.period}
        setTime={pump1.time}
        currentVolume={pump1.currentVolume}
        maxVolume={pump1.maxVolume}
        status={pump1.status}
      />
      <PumpItem
        number={2}
        name={pump2.name}
        setDose={pump2.dose}
        setPeriod={pump2.period}
        setTime={pump2.time}
        currentVolume={pump2.currentVolume}
        maxVolume={pump2.maxVolume}
        status={pump2.status}
      />
      <PumpItem
        number={3}
        name={pump3.name}
        setDose={pump3.dose}
        setPeriod={pump3.period}
        setTime={pump3.time}
        currentVolume={pump3.currentVolume}
        maxVolume={pump3.maxVolume}
        status={pump3.status}
      />
      <PumpItem
        number={4}
        name={pump4.name}
        setDose={pump4.dose}
        setPeriod={pump4.period}
        setTime={pump4.time}
        currentVolume={pump4.currentVolume}
        maxVolume={pump4.maxVolume}
        status={pump4.status}
      />
    </div>
  );
};