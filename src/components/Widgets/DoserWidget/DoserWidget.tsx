import React, { useState } from "react"
import './DoserWidget.sass';
import { IPumpConfig, IPumpStatus } from "../../../redux/AquariumSlice";
import { useAppDispatch, useAppSelector } from "models/Hook";
import gearIcon from '../../../assets/icons/gear.svg'
import { PumpWidget } from "../PumpWidget/PumpWidget";
import { Modal } from "components/Modal";


interface DoserWidgetProps {
  doserConfig: IPumpConfig[]
  doserStatus: IPumpStatus[]
}

export const DoserWidget = ({ doserConfig, doserStatus }: DoserWidgetProps) => {
  const dispatch = useAppDispatch()
  const [showModal, setShowModal] = useState(false)
  const system = useAppSelector(state => state.aquarium.currentInfo.system)
  return (
    <div className="doser">
      <div className="doser__blur" />
      <div className="doser__rect" />
      {doserConfig.map((pumpConfig, index) =>
        <PumpWidget
          key={Math.random()}
          number={1}
        // status={doserStatus[index]}
        // number={index + 1}
        // pumpConfig={pumpConfig}
        />)}

      <button
        type="button"
        className="system__edit-btn"
        onClick={() => setShowModal(true)}
      >
        <img className="system__edit-btn-icon" src={gearIcon}></img>
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
  )
};