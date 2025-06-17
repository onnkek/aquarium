import React from "react"
import './Doser.sass';
import { IPumpConfig, IPumpStatus } from "../../redux/AquariumSlice";
import { Pump } from "../Pump/Pump";


interface PumpProps {
  doserConfig: IPumpConfig[]
  doserStatus: IPumpStatus[]
}

export const Doser = ({ doserConfig, doserStatus }: PumpProps) => {
  return (
    <div className="doser">

      {doserConfig.map((pumpConfig, index) =>
        <Pump
          key={Math.random()}
          status={doserStatus[index]}
          number={index + 1}
          pumpConfig={pumpConfig}
        />)}
    </div>
  );
};