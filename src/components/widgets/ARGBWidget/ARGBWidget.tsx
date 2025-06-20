import React, { MouseEvent, ReactNode, useState } from "react"
import "./ARGBWidget.sass"
import { useAppDispatch, useAppSelector } from "../../../models/Hook"
import { IWidget, removeWidget, setSelect } from "../../../redux/WidgetsSlice"
import argbIcon from '../../../assets/icons/aquarium/argb.svg'
import gearIcon from '../../../assets/icons/gear.svg'
import Modal from "../../Modal/Modal"
import { Toggle } from "components/Toggle"

interface ARGBWidgetProps {
  prop?: string
}

const ARGBWidget = ({ prop }: ARGBWidgetProps) => {
  const dispatch = useAppDispatch()
  const [showModal, setShowModal] = useState(false)
  const argb = useAppSelector(state => state.aquarium.config.rgb)
  return (
    <div className="argb">
      <div className="argb__blur" />
      <div className="argb__rect" />
      <div className="argb__left">
        <img className="argb__icon" src={argbIcon} />
        <Toggle size="XL" checked={true} />
      </div>
      <div className="argb__right">
        <div className="argb__body-right">
          <div className="argb__text-container">
            <p className="argb__text-tag">On Time</p>
            <p className="argb__text">{argb.on}</p>
            {/* <p className="argb__text">13:00</p> */}
          </div>
          <div className="argb__text-container">
            <p className="argb__text-tag">Off Time</p>
            <p className="argb__text">{argb.off}</p>
            {/* <p className="argb__text">20:00</p> */}
          </div>
          <div className="argb__text-container">
            <p className="argb__text-tag">Mode</p>
            <p className="argb__text">Cycle</p>
            {/* <p className="argb__text">20:00</p> */}
          </div>
        </div>
      </div>

      <button
        type="button"
        className="argb__edit-btn"
        onClick={() => setShowModal(true)}
      >
        <img className="argb__edit-btn-icon" src={gearIcon}></img>
      </button>
      <Modal title='Edit argb parametrs' show={showModal} setShow={setShowModal}>
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

export default ARGBWidget