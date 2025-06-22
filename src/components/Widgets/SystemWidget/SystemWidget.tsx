import React, { MouseEvent, ReactNode, useState } from "react"
import "./SystemWidget.sass"
import { useAppDispatch, useAppSelector } from "../../../models/Hook"
import systemIcon from '../../../assets/icons/aquarium/chip.svg'
import gearIcon from '../../../assets/icons/gear.svg'
import { Toggle } from "components/Toggle"
import fanIcon from '../../../assets/icons/fan.svg'
import heatIcon from '../../../assets/icons/heat.svg'
import chipIcon from '../../../assets/icons/aquarium/chip.svg'
import timeIcon from '../../../assets/icons/aquarium/time.svg'
import harddriveIcon from '../../../assets/icons/aquarium/harddrive.svg'
import { Modal } from "components/Modal"
interface SystemWidgetProps {
  prop?: string
}

const SystemWidget = ({ prop }: SystemWidgetProps) => {
  const dispatch = useAppDispatch()
  const [showModal, setShowModal] = useState(false)
  const system = useAppSelector(state => state.aquarium.currentInfo.system)
  return (
    <div className="system">
      <div className="system__blur" />
      <div className="system__rect" />
      <div className="system__left">


        <div className="system__text-container">
          <img className="system__icon" src={chipIcon}></img>
          <div>
            <p className="system__text-tag">Chip temperature</p>
            <p className="system__text">{system.chipTemp} ℃</p>
          </div>

        </div>
        <div className="system__text-container">
          <img className="system__icon" src={timeIcon}></img>
          <div>
            <p className="system__text-tag">Uptime</p>
            <p className="system__text">{(system.uptime / 1000000).toFixed(1)} sec</p>
          </div>
        </div>



      </div>
      <div className="system__right">
        <div className="system__text-container">
          <img className="system__icon" src={timeIcon}></img>
          <div>
            <p className="system__text-tag">Update time</p>
            <p className="system__text">{5} sec</p>
          </div>
        </div>
        <div className="system__text-container">
          <img className="system__icon" src={harddriveIcon}></img>

          <div className="system__space">
            <p className="system__text-tag">Space</p>
            <div className="progress system__progress">
              <div className="progress-bar system__progress-bar"
                style={{ width: system.usedSpace / system.totalSpace * 100 + "%" }}
              >25%</div>
            </div>
            <div className="system__space_values">
              <p className="system__text-space">{(system.usedSpace / 1024 / 1024).toFixed(1)} MB</p>
              <p className="system__text-space">{(system.freeSpace / 1024 / 1024 / 1024).toFixed(1)} GB</p>
            </div>
          </div>
        </div>

      </div>

      <button
        type="button"
        className="system__edit-btn"
        onClick={() => setShowModal(true)}
      >
        <img className="system__edit-btn-icon" src={gearIcon}></img>
      </button>
      {/* <Modal isOpen={showModal}>
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
      </Modal> */}
    </div>
  )
}

export default SystemWidget