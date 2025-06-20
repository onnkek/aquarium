import React, { MouseEvent, ReactNode, useState } from "react"
import "./TempWidget.sass"
import { useAppDispatch, useAppSelector } from "../../../models/Hook"
import { IWidget, removeWidget, setSelect } from "../../../redux/WidgetsSlice"
import tempIcon from '../../../assets/icons/aquarium/temp.svg'
import gearIcon from '../../../assets/icons/gear.svg'
import Modal from "../../Modal/Modal"
import { Toggle } from "components/Toggle"
import fanIcon from '../../../assets/icons/fan.svg'
import heatIcon from '../../../assets/icons/heat.svg'

interface TempWidgetProps {
  prop?: string
}

const TempWidget = ({ prop }: TempWidgetProps) => {
  const dispatch = useAppDispatch()
  const [showModal, setShowModal] = useState(false)
  const temp = useAppSelector(state => state.aquarium.config.temp)
  return (
    <div className="temp">
      <div className="temp__blur" />
      <div className="temp__rect" />
      <div className="temp__left">
        <img className="temp__icon" src={tempIcon} />
        <Toggle size="XL" checked={true} />
      </div>
      <div className="temp__right">
        <div className="temp__body-right">
          <div className="temp__text-container">
            <p className="temp__text-tag">Current</p>
            <p className="temp__text">{23.55} ℃</p>
            {/* <p className="temp__text">13:00</p> */}
          </div>
          {/* <img className="heat" style={{ width: "80px" }} src={heatIcon}></img> */}

          <div className="temp__text-container">
            <p className="temp__text-tag">Mode</p>
            <img className="fan" style={{ width: "100px" }} src={fanIcon}></img>
          </div>
          {/* <div className="temp__text-container">
            <p className="temp__text-tag">Off Time</p>
            <img className="fan" style={{ width: "80px" }} src={fanIcon}></img>
          </div> */}

        </div>
      </div>

      <button
        type="button"
        className="temp__edit-btn"
        onClick={() => setShowModal(true)}
      >
        <img className="temp__edit-btn-icon" src={gearIcon}></img>
      </button>
      <Modal title='Edit temp parametrs' show={showModal} setShow={setShowModal}>
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
}

export default TempWidget