import React from "react"
import './Pump.sass';
import dropIcon from '../../assets/icons/drop.svg'
import bottleIcon from '../../assets/icons/bottle.svg'
import { IPumpConfig, IPumpStatus } from "../../redux/AquariumSlice";

interface PumpProps {
  number: number
  pumpConfig: IPumpConfig
  status: IPumpStatus
}

export const Pump = ({ pumpConfig, number, status }: PumpProps) => {
  return (
    <div className={`pump ${status.status && "pump_active"}`}>
      <div className="pump__header">
        <div className="pump__header-number">{number}</div>
        <h3 className="pump__header-title">{pumpConfig.name}</h3>
      </div>
      <div className="pump__body-container">
        <div className="pump__dose-container">
          <img className="pump__dose-icon" src={dropIcon} alt="" />
          <span className="pump__dose">{pumpConfig.dose} ml</span>
        </div>
        <span className="pump__period">{pumpConfig.period}</span>
        <span className="pump__period">{pumpConfig.time}</span>
      </div>
      <div className="pump__status">
        <div className="pump__status-bar">
          <div className="pump__status-bar_active" style={{ width: pumpConfig.status / pumpConfig.dose * 100 + "%" }}></div>
        </div>
      </div>
      <div className="pump__remainder">
        <div className="pump__remainder-container">
          <div className="pump__remainder-left">
            <img className="pump__remainder-icon" src={bottleIcon} alt="" />
            <span className="pump__remainder-days">{pumpConfig.currentVolume / pumpConfig.dose} days</span>
          </div>
          <span className="pump__remainder-volume">{pumpConfig.maxVolume} ml</span>
        </div>
        <div className="pump__remainder-bar">
          <div className="pump__remainder-bar_active" style={{ width: pumpConfig.currentVolume / pumpConfig.maxVolume * 100 + "%" }}></div>
        </div>
      </div>
    </div>
  );
};