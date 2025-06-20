import React, { MouseEvent, ReactNode, useState } from "react"
import "./CO2Widget.sass"
import { useAppDispatch, useAppSelector } from "../../../models/Hook"
import { IWidget, removeWidget, setSelect } from "../../../redux/WidgetsSlice"
import co2Icon from '../../../assets/icons/aquarium/co2.svg'
import gearIcon from '../../../assets/icons/gear.svg'
import Modal from "../../Modal/Modal"
import { Toggle } from "components/Toggle"

interface CO2WidgetProps {
  prop?: string
}

const CO2Widget = ({ prop }: CO2WidgetProps) => {
  const dispatch = useAppDispatch()
  const [showModal, setShowModal] = useState(false)
  const co2 = useAppSelector(state => state.aquarium.config.co2)
  return (
    <div className="co2">
      <div className="co2__blur" />
      <div className="co2__rect" />
      <div className="co2__left">
        <img className="co2__icon" src={co2Icon} />
        <Toggle size="XL" checked={true} />
      </div>
      <div className="co2__right">
        <div className="co2__body-right">
          <div className="co2__text-container">
            <p className="co2__text-tag">On Time</p>
            <p className="co2__text">{co2.on}</p>
            {/* <p className="co2__text">13:00</p> */}
          </div>
          <div className="co2__text-container">
            <p className="co2__text-tag">Off Time</p>
            <p className="co2__text">{co2.off}</p>
            {/* <p className="co2__text">20:00</p> */}
          </div>
        </div>
      </div>

      <button
        type="button"
        className="co2__edit-btn"
        onClick={() => setShowModal(true)}
      >
        <img className="co2__edit-btn-icon" src={gearIcon}></img>
      </button>
      <Modal title='Edit CO2 parametrs' show={showModal} setShow={setShowModal}>
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

export default CO2Widget