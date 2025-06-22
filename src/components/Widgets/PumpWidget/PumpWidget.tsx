import React, { useState } from "react"
import './PumpWidget.sass'
import dropIcon from '../../assets/icons/drop.svg'
import bottleIcon from '../../assets/icons/bottle.svg'
import { IPumpConfig, IPumpStatus } from "redux/AquariumSlice"
import { useAppDispatch, useAppSelector } from "models/Hook"
import gearIcon from '../../../assets/icons/gear.svg'
import pumpIcon from '../../../assets/icons/aquarium/pump.svg'
import { Modal } from "components/Modal"

interface PumpWidgetProps {
  number: number
}

export const PumpWidget = ({ number }: PumpWidgetProps) => {
  const dispatch = useAppDispatch()
  const [showModal, setShowModal] = useState(false)
  const pumpConfig = useAppSelector(state => state.aquarium.config.doser[number])
  return (
    <div className="pump1">
      <div className="pump1__blur" />
      <div className="pump1__rect" />
      <div className="pump1__body">
        <div className="pump1__left">
          <img className="pump1__icon" src={pumpIcon} />
        </div>
        <div className="pump1__right">
          <div className="pump1__text-container">
            <p className="pump1__text">{pumpConfig.name}</p>
          </div>
          <div className="pump1__text-container pump1__remainder-container">
            {/* <img className="pump1__icon" src={harddriveIcon}></img> */}

            <div className="pump1__remainder">
              <p className="pump1__text-tag">Remainder</p>
              <div className="pump1__values">
                <p className="pump1__text">{pumpConfig.currentVolume / pumpConfig.dose} days</p>
                <p className="pump1__text">{pumpConfig.currentVolume} ml</p>
              </div>
              <div className="progress pump1__progress">
                <div className="progress-bar pump1__progress-bar"
                  style={{ width: pumpConfig.status / pumpConfig.dose * 100 + "%" }}
                >{pumpConfig.status / pumpConfig.dose * 100} %</div>
              </div>

            </div>
          </div>


        </div>
      </div>
      <div className="pump1__dose-container">
        <div className="pump1__dose">
          <p className="pump1__text-tag">Dose</p>
          <p className="pump1__text">ПН, ВТ, СР, ЧТ, ПТ, СБ</p>
          <div className="pump1__values">
            <p className="pump1__text">{pumpConfig.dose} ml</p>

            <p className="pump1__text">{pumpConfig.time}</p>
          </div>
          <div className="progress pump1__progress-dose">
            <div className="progress-bar pump1__progress-bar-dose"
              style={{ width: pumpConfig.status / pumpConfig.dose * 100 + "%" }}
            >{pumpConfig.status / pumpConfig.dose * 100} %</div>
          </div>
        </div>
      </div>
      <button
        type="button"
        className="pump1__edit-btn"
        onClick={() => setShowModal(true)}
      >
        <img className="pump1__edit-btn-icon" src={gearIcon}></img>
      </button>
      <Modal isOpen={showModal}>
        <label className="form-label">
          Set on time
        </label>
        <input
          type="time"
          name="deadline"
          className="form-control add-form-date"
        //value={deadline}
        //onChange={onDeadlineChange}
        />
        <label className="form-label mt-3">
          Set off time
        </label>
        <input
          type="time"
          name="deadline"
          className="form-control add-form-date"
        //value={deadline}
        //onChange={onDeadlineChange}
        />
        <div className="form-footer">
          <button type="submit" className="btn btn-primary" onClick={() => { }}>
            Add
          </button>
        </div>
      </Modal>
    </div>
    // <div className={`pump ${status.status && "pump_active"}`}>
    //   <div className="pump__header">
    //     <div className="pump__header-number">{number}</div>
    //     <h3 className="pump__header-title">{pumpConfig.name}</h3>
    //   </div>
    //   <div className="pump__body-container">
    //     <div className="pump__dose-container">
    //       <img className="pump__dose-icon" src={dropIcon} alt="" />
    //       <span className="pump__dose">{pumpConfig.dose} ml</span>
    //     </div>
    //     <span className="pump__period">{pumpConfig.period}</span>
    //     <span className="pump__period">{pumpConfig.time}</span>
    //   </div>
    //   <div className="pump__status">
    //     <div className="pump__status-bar">
    //       <div className="pump__status-bar_active" style={{ width: pumpConfig.status / pumpConfig.dose * 100 + "%" }}></div>
    //     </div>
    //   </div>
    //   <div className="pump__remainder">
    //     <div className="pump__remainder-container">
    //       <div className="pump__remainder-left">
    //         <img className="pump__remainder-icon" src={bottleIcon} alt="" />
    //         <span className="pump__remainder-days">{pumpConfig.currentVolume / pumpConfig.dose} days</span>
    //       </div>
    //       <span className="pump__remainder-volume">{pumpConfig.maxVolume} ml</span>
    //     </div>
    //     <div className="pump__remainder-bar">
    //       <div className="pump__remainder-bar_active" style={{ width: pumpConfig.currentVolume / pumpConfig.maxVolume * 100 + "%" }}></div>
    //     </div>
    //   </div>
    // </div>
  );
};