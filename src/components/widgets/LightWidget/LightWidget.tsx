import React, { MouseEvent, ReactNode, useState } from "react"
import "./LightWidget.sass"
import { useAppDispatch, useAppSelector } from "../../../models/Hook"
import { IWidget, removeWidget, setSelect } from "../../../redux/WidgetsSlice"
import lightIcon from '../../../assets/icons/aquarium/light.svg'
import gearIcon from '../../../assets/icons/gear.svg'
import Modal from "../../Modal/Modal"
import { Toggle } from "components/Toggle"

interface LightWidgetProps {
  prop?: string
}

const LightWidget = ({ prop }: LightWidgetProps) => {
  const dispatch = useAppDispatch()
  const [showModal, setShowModal] = useState(false)
  const light = useAppSelector(state => state.aquarium.config.light)
  return (
    <div className="light">
      <div className="light__blur" />
      <div className="light__rect" />
      <div className="light__left">
        <img className="light__icon" src={lightIcon} />
        <Toggle size="XL" checked={true} />
      </div>
      <div className="light__right">
        <div className="light__body-right">
          <div className="light__text-container">
            <p className="light__text-tag">On Time</p>
            <p className="light__text">{light.on}</p>
            {/* <p className="light__text">13:00</p> */}
          </div>
          <div className="light__text-container">
            <p className="light__text-tag">Off Time</p>
            <p className="light__text">{light.off}</p>
            {/* <p className="light__text">20:00</p> */}
          </div>
        </div>
      </div>

      <button
        type="button"
        className="light__edit-btn"
        onClick={() => setShowModal(true)}
      >
        <img className="light__edit-btn-icon" src={gearIcon}></img>
      </button>
      <Modal title='Edit light parametrs' show={showModal} setShow={setShowModal}>
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

export default LightWidget