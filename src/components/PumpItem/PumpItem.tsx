import React from "react"
import './PumpItem.sass';
import dropIcon from '../../assets/icons/drop.svg'
import bottleIcon from '../../assets/icons/bottle.svg'

interface PumpItemProps {
  number: number
  name: string
  setDose: number
  setPeriod: string
  setTime: string
  currentVolume: number
  maxVolume: number
  status: number
}

export const PumpItem = ({ number, name, setDose, setPeriod, setTime, currentVolume, maxVolume, status }: PumpItemProps) => {
  return (
    <div className="pumpItem">
      <div className="pumpItem__header">
        <div className="pumpItem__header-number">{number}</div>
        <h3 className="pumpItem__header-title">{name}</h3>
      </div>
      <div className="pumpItem__body-container">
        <div className="pumpItem__dose-container">
          <img className="pumpItem__dose-icon" src={dropIcon} alt="" />
          <span className="pumpItem__dose">{setDose} ml</span>
        </div>
        <span className="pumpItem__period">{setPeriod}</span>
        <span className="pumpItem__period">{setTime}</span>
      </div>
      <div className="pumpItem__status">
        <div className="pumpItem__status-bar">
          <div className="pumpItem__status-bar_active" style={{ width: status / setDose * 100 + "%" }}></div>
        </div>
      </div>
      <div className="pumpItem__remainder">
        <div className="pumpItem__remainder-container">
          <div className="pumpItem__remainder-left">
            <img className="pumpItem__remainder-icon" src={bottleIcon} alt="" />
            <span className="pumpItem__remainder-days">{currentVolume / setDose} days</span>
          </div>
          <span className="pumpItem__remainder-volume">{maxVolume} ml</span>
        </div>
        <div className="pumpItem__remainder-bar">
          <div className="pumpItem__remainder-bar_active" style={{ width: currentVolume / maxVolume * 100 + "%" }}></div>
        </div>
      </div>
    </div>
  );
};