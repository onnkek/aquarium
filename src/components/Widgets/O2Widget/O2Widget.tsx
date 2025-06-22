import React, { MouseEvent, ReactNode, useState } from "react"
import "./O2Widget.sass"
import { useAppDispatch, useAppSelector } from "../../../models/Hook"
import o2Icon from '../../../assets/icons/aquarium/o2.svg'
import gearIcon from '../../../assets/icons/gear.svg'
import { Toggle } from "components/Toggle"
import { Modal } from "components/Modal"
import { Status } from "models/Status"
import { Button } from "components/Button"
import { updateO2, updateO2State } from "../../../redux/AquariumSlice"
import { ReactComponent as Spinner } from 'assets/icons/spinner.svg';
import { Input } from "components/Input"

interface O2WidgetProps {
  prop?: string
}

const O2Widget = ({ prop }: O2WidgetProps) => {
  const dispatch = useAppDispatch()
  const [showModal, setShowModal] = useState(false)
  const [showApprove, setShowApprove] = useState(false)
  const o2 = useAppSelector(state => state.aquarium.config.o2)
  const o2current = useAppSelector(state => state.aquarium.currentInfo.o2.status)
  const status = useAppSelector(state => state.aquarium.status)

  const [onTime, setOnTime] = useState(o2.on)
  const [offTime, setOffTime] = useState(o2.off)

  const openModal = () => {
    setOnTime(o2.on)
    setOffTime(o2.off)
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
    await dispatch(updateO2({ on: onTime, off: offTime }))
    if (status === Status.Succeeded) {
      setOnTime(o2.on)
      setOnTime(o2.off)
      closeModal()
    }
  }
  const sendO2State = async () => {
    await dispatch(updateO2State(!o2current))
    if (status === Status.Succeeded) {
      closeApprove()
    }
  }


  return (
    <div className="o2">
      <div className="o2__blur" />
      <div className="o2__rect" />
      <div className="o2__left">
        <img className="o2__icon" src={o2Icon} />
        <Toggle size="XL" checked={o2current} onClick={openApprove} />
      </div>
      <div className="o2__right">
        <div className="o2__body-right">
          <div className="o2__text-container">
            <p className="o2__text-tag">On Time</p>
            <p className="o2__text">{o2.on}</p>
          </div>
          <div className="o2__text-container">
            <p className="o2__text-tag">Off Time</p>
            <p className="o2__text">{o2.off}</p>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="o2__edit-btn"
        onClick={openModal}
      >
        <img className="o2__edit-btn-icon" src={gearIcon}></img>
      </button>
      <Modal isOpen={showApprove} onClose={closeApprove} iconColor='green' bgWrapper='none'>
        <div className="o2__form">
          <div className="o2__input">
            <label className="o2__label">
              This will lead to O2 shutdown. Do you agree?
            </label>
          </div>
        </div>
        <div style={{ display: 'flex', marginTop: '32px', justifyContent: 'space-between' }}>
          {status !== Status.Loading ? (
            <>
              <Button width='170px' size='L' theme='outline' onClick={closeApprove}>Cancel</Button>
              <Button width='170px' size='L' onClick={sendO2State}>Agree</Button>
            </>
          ) : (
            <>
              <Button width='170px' size='L' theme='outline' onClick={closeApprove} disabled>Cancel</Button>
              <Button width='170px' size='L' onClick={sendO2State} disabled>
                <Spinner />
                Loading...
              </Button>
            </>
          )}
        </div>
      </Modal>
      <Modal isOpen={showModal} onClose={closeModal} iconColor='green' bgWrapper='none'>
        <div className="o2__form">
          <div className="o2__input">
            <label className="o2__label">
              Set on time
            </label>
            <Input type="time" value={onTime} onChange={(e) => setOnTime(e.target.value)} />
          </div>
          <div className="o2__input">
            <label className="o2__label">
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

export default O2Widget