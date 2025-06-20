import React, { MouseEvent, ReactNode, useState } from "react"
import "./O2Widget.sass"
import { useAppDispatch, useAppSelector } from "../../../models/Hook"
import { IWidget, removeWidget, setSelect } from "../../../redux/WidgetsSlice"
import o2Icon from '../../../assets/icons/aquarium/o2.svg'
import gearIcon from '../../../assets/icons/gear.svg'
import Modal from "../../Modal/Modal"
import { Toggle } from "components/Toggle"

interface O2WidgetProps {
  prop?: string
}

const O2Widget = ({ prop }: O2WidgetProps) => {
  const dispatch = useAppDispatch()
  const [showModal, setShowModal] = useState(false)
  const o2 = useAppSelector(state => state.aquarium.config.o2)
  return (
    <div className="o2">
      <div className="o2__blur" />
      <div className="o2__rect" />
      <div className="o2__left">
        <img className="o2__icon" src={o2Icon} />
        <Toggle size="XL" checked={false} />
      </div>
      <div className="o2__right">
        <div className="o2__body-right">
          <div className="o2__text-container">
            <p className="o2__text-tag">On Time</p>
            <p className="o2__text">{o2.on}</p>
            {/* <p className="o2__text">13:00</p> */}
          </div>
          <div className="o2__text-container">
            <p className="o2__text-tag">Off Time</p>
            <p className="o2__text">{o2.off}</p>
            {/* <p className="o2__text">20:00</p> */}
          </div>
        </div>
      </div>

      <button
        type="button"
        className="o2__edit-btn"
        onClick={() => setShowModal(true)}
      >
        <img className="o2__edit-btn-icon" src={gearIcon}></img>
      </button>
      <Modal title='Edit O2 parametrs' show={showModal} setShow={setShowModal}>
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

export default O2Widget