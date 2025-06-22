import React, { MouseEvent, ReactNode, useState } from "react"
import "./CO2Widget.sass"
import { useAppDispatch, useAppSelector } from "../../../models/Hook"
import co2Icon from '../../../assets/icons/aquarium/co2.svg'
import gearIcon from '../../../assets/icons/gear.svg'
import { Toggle } from "components/Toggle"
import { Modal } from "components/Modal"
import { Button } from "components/Button"
import { Input } from "components/Input"
import { updateCO2, updateCO2State } from "../../../redux/AquariumSlice"
import { Status } from "models/Status"
import { ReactComponent as Spinner } from 'assets/icons/spinner.svg';

interface CO2WidgetProps {
  prop?: string
}

const CO2Widget = ({ prop }: CO2WidgetProps) => {
  const dispatch = useAppDispatch()
  const [showModal, setShowModal] = useState(false)
  const [showApprove, setShowApprove] = useState(false)
  const co2 = useAppSelector(state => state.aquarium.config.co2)
  const co2current = useAppSelector(state => state.aquarium.currentInfo.co2.status)
  const status = useAppSelector(state => state.aquarium.status)

  const [onTime, setOnTime] = useState(co2.on)
  const [offTime, setOffTime] = useState(co2.off)

  const openModal = () => {
    setOnTime(co2.on)
    setOffTime(co2.off)
    setShowModal(true);
  }
  const closeModal = () => {
    setShowModal(false);
  }
  const openApprove = () => {
    setShowApprove(true);
  }
  const closeApprove = () => {
    setShowApprove(false);
  }
  const sendConfig = async () => {
    await dispatch(updateCO2({ on: onTime, off: offTime }))
    if (status === Status.Succeeded) {
      setOnTime(co2.on)
      setOnTime(co2.off)
      closeModal()
    }
  }
  const sendCO2State = async () => {
    await dispatch(updateCO2State(!co2current))
    if (status === Status.Succeeded) {
      closeApprove()
    }
  }
  return (
    <div className="co2">
      <div className="co2__blur" />
      <div className="co2__rect" />
      <div className="co2__left">
        <img className="co2__icon" src={co2Icon} />
        <Toggle size="XL" checked={co2current} onClick={openApprove} />
      </div>
      <div className="co2__right">
        <div className="co2__body-right">
          <div className="co2__text-container">
            <p className="co2__text-tag">On Time</p>
            <p className="co2__text">{co2.on}</p>
          </div>
          <div className="co2__text-container">
            <p className="co2__text-tag">Off Time</p>
            <p className="co2__text">{co2.off}</p>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="co2__edit-btn"
        onClick={openModal}
      >
        <img className="co2__edit-btn-icon" src={gearIcon}></img>
      </button>
      <Modal isOpen={showApprove} onClose={closeApprove} iconColor='green' bgWrapper='none'>
        <div className="co2__form">
          <div className="co2__input">
            <label className="co2__label">
              This will lead to CO2 shutdown. Do you agree?
            </label>
          </div>
        </div>
        <div style={{ display: 'flex', marginTop: '32px', justifyContent: 'space-between' }}>
          {status !== Status.Loading ? (
            <>
              <Button width='170px' size='L' theme='outline' onClick={closeApprove}>Cancel</Button>
              <Button width='170px' size='L' onClick={sendCO2State}>Agree</Button>
            </>
          ) : (
            <>
              <Button width='170px' size='L' theme='outline' onClick={closeApprove} disabled>Cancel</Button>
              <Button width='170px' size='L' onClick={sendCO2State} disabled>
                <Spinner />
                Loading...
              </Button>
            </>
          )}
        </div>
      </Modal>
      <Modal isOpen={showModal} onClose={closeModal} iconColor='green' bgWrapper='none'>
        <div className="co2__form">
          <div className="co2__input">
            <label className="co2__label">
              Set on time
            </label>
            <Input type="time" value={onTime} onChange={(e) => setOnTime(e.target.value)} />
          </div>
          <div className="co2__input">
            <label className="co2__label">
              Set off time
            </label>
            <Input type="time" value={offTime} onChange={(e) => setOffTime(e.target.value)} />
          </div>
        </div>
        <div style={{ display: 'flex', marginTop: '32px', justifyContent: 'space-between' }}>
          {status !== Status.Loading ? (
            <>
              <Button width='170px' size='L' theme='outline' onClick={closeModal}>Cancel</Button>
              <Button width='170px' size='L' onClick={sendConfig}>Confirm</Button>
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

export default CO2Widget