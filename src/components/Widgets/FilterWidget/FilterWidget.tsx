import React, { MouseEvent, ReactNode, useState } from "react"
import "./FilterWidget.sass"
import { useAppDispatch, useAppSelector } from "../../../models/Hook"
import filterIcon from '../../../assets/icons/aquarium/filter.svg'
import gearIcon from '../../../assets/icons/gear.svg'
import { Toggle } from "components/Toggle"
import { Modal } from "components/Modal"
import { Status } from "models/Status"
import { Button } from "components/Button"
import { ReactComponent as Spinner } from 'assets/icons/spinner.svg';
import { updateFilterState } from "../../../redux/AquariumSlice"

interface FilterWidgetProps {
  prop?: string
}

const FilterWidget = ({ prop }: FilterWidgetProps) => {
  const dispatch = useAppDispatch()
  // const [showModal, setShowModal] = useState(false)
  const filter = useAppSelector(state => state.aquarium.currentInfo.filter.status)
  const [showApprove, setShowApprove] = useState(false)
  const status = useAppSelector(state => state.aquarium.status)

  const openApprove = () => {
    setShowApprove(true);
  }
  const closeApprove = () => {
    setShowApprove(false);
  }
  const sendFilterState = async () => {
    await dispatch(updateFilterState(!filter))
    if (status === Status.Succeeded) {
      closeApprove()
    }
  }

  return (
    <div className="filter">
      <div className="filter__blur" />
      <div className="filter__rect" />
      <div className="filter__left">
        <img className="filter__icon" src={filterIcon} />
        <Toggle size="XL" checked={filter} onClick={openApprove} />
      </div>
      <div className="filter__right">
        <div className="filter__body-right">
          <div className="filter__text-container">
            <p className="filter__text-tag">Work time</p>
            <p className="filter__text">24/7</p>
          </div>
        </div>
      </div>

      {/* <button
        type="button"
        className="filter__edit-btn"
        onClick={() => setShowModal(true)}
      >
        <img className="filter__edit-btn-icon" src={gearIcon}></img>
      </button> */}
      <Modal isOpen={showApprove} onClose={closeApprove} iconColor='green' bgWrapper='none'>
        <div className="filter__form">
          <div className="filter__input">
            <label className="filter__label">
              This will lead to filter shutdown. Do you agree?
            </label>
          </div>
        </div>
        <div style={{ display: 'flex', marginTop: '32px', justifyContent: 'space-between' }}>
          {status !== Status.Loading ? (
            <>
              <Button width='170px' size='L' theme='outline' onClick={closeApprove}>Cancel</Button>
              <Button width='170px' size='L' onClick={sendFilterState}>Agree</Button>
            </>
          ) : (
            <>
              <Button width='170px' size='L' theme='outline' disabled>Cancel</Button>
              <Button width='170px' size='L' disabled>
                <Spinner />
                Loading...
              </Button>
            </>
          )}
        </div>
      </Modal>
    </div>
  )
}

export default FilterWidget