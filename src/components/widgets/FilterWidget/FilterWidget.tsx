import React, { MouseEvent, ReactNode, useState } from "react"
import "./FilterWidget.sass"
import { useAppDispatch, useAppSelector } from "../../../models/Hook"
import { IWidget, removeWidget, setSelect } from "../../../redux/WidgetsSlice"
import filterIcon from '../../../assets/icons/aquarium/filter.svg'
import gearIcon from '../../../assets/icons/gear.svg'
import Modal from "../../Modal/Modal"
import { Toggle } from "components/Toggle"

interface FilterWidgetProps {
  prop?: string
}

const FilterWidget = ({ prop }: FilterWidgetProps) => {
  const dispatch = useAppDispatch()
  const [showModal, setShowModal] = useState(false)
  // const filter = useAppSelector(state => state.aquarium.config.filter)
  return (
    <div className="filter">
      <div className="filter__blur" />
      <div className="filter__rect" />
      <div className="filter__left">
        <img className="filter__icon" src={filterIcon} />
        <Toggle size="XL" checked={true} />
      </div>
      <div className="filter__right">
        <div className="filter__body-right">
          <div className="filter__text-container">
            <p className="filter__text-tag">Work time</p>
            <p className="filter__text">24/7</p>
            {/* <p className="filter__text">20:00</p> */}
          </div>
        </div>
      </div>

      <button
        type="button"
        className="filter__edit-btn"
        onClick={() => setShowModal(true)}
      >
        <img className="filter__edit-btn-icon" src={gearIcon}></img>
      </button>
      <Modal title='Edit filter parametrs' show={showModal} setShow={setShowModal}>
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

export default FilterWidget