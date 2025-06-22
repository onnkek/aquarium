import React, { MouseEvent, ReactNode, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../models/Hook"
import lightIcon from '../../../assets/icons/aquarium/light.svg'
import gearIcon from '../../../assets/icons/gear.svg'
import { Toggle } from "components/Toggle"
import { Modal } from "components/Modal"
import cls from './LightWidget.module.sass'
import { updateLight, updateLightState } from "../../../redux/AquariumSlice"
import { Status } from "models/Status"
import { ReactComponent as Spinner } from 'assets/icons/spinner.svg';
import { Button } from "components/Button"
import { Input } from "components/Input"

interface LightWidgetProps {
  prop?: string
}

const LightWidget = ({ prop }: LightWidgetProps) => {
  const dispatch = useAppDispatch()
  const [showModal, setShowModal] = useState(false)
  const [showApprove, setShowApprove] = useState(false)
  const light = useAppSelector(state => state.aquarium.config.light)
  const lightCurrent = useAppSelector(state => state.aquarium.currentInfo.light.status)
  const status = useAppSelector(state => state.aquarium.status)

  const [onTime, setOnTime] = useState(light.on)
  const [offTime, setOffTime] = useState(light.off)

  const openModal = () => {
    setOnTime(light.on)
    setOffTime(light.off)
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
    await dispatch(updateLight({ on: onTime, off: offTime }))
    if (status === Status.Succeeded) {
      setOnTime(light.on)
      setOnTime(light.off)
      closeModal()
    }
  }
  const sendLightState = async () => {
    await dispatch(updateLightState(!lightCurrent))
    if (status === Status.Succeeded) {
      closeApprove()
    }
  }

  return (
    <div className={cls.light}>
      <div className={cls.light__blur} />
      <div className={cls.light__rect} />
      <div className={cls.light__left} >
        <img className={cls.light__icon} src={lightIcon} />
        <Toggle size="XL" checked={lightCurrent} onClick={openApprove} />
      </div>
      <div className={cls.light__right}>
        <div className={cls.light__body_right}>
          <div className={cls.light__text_container}>
            <p className={cls.light__text_tag}>On Time</p>
            <p className={cls.light__text}>{light.on}</p>
          </div>
          <div className={cls.light__text_container}>
            <p className={cls.light__text_tag}>Off Time</p>
            <p className={cls.light__text}>{light.off}</p>
          </div>
        </div>
      </div>

      <button
        type="button"
        className={cls.light__edit_btn}
        onClick={openModal}
      >
        <img className={cls.light__edit_btn_icon} src={gearIcon}></img>
      </button>
      <Modal isOpen={showApprove} onClose={closeApprove} iconColor='green' bgWrapper='none'>
        <div className={cls.light__form}>
          <div className={cls.light__input}>
            <label className={cls.light__label}>
              This will lead to light shutdown. Do you agree?
            </label>
          </div>
        </div>
        <div style={{ display: 'flex', marginTop: '32px', justifyContent: 'space-between' }}>
          {status !== Status.Loading ? (
            <>
              <Button width='170px' size='L' theme='outline' onClick={closeApprove}>Cancel</Button>
              <Button width='170px' size='L' onClick={sendLightState}>Agree</Button>
            </>
          ) : (
            <>
              <Button width='170px' size='L' theme='outline' onClick={closeApprove} disabled>Cancel</Button>
              <Button width='170px' size='L' onClick={sendLightState} disabled>
                <Spinner />
                Loading...
              </Button>
            </>
          )}
        </div>
      </Modal>
      <Modal isOpen={showModal} onClose={closeModal} iconColor='green' bgWrapper='none'>
        <div className={cls.light__form}>
          <div className={cls.light__input}>
            <label className={cls.light__label}>
              Set on time
            </label>
            <Input type="time" value={onTime} onChange={(e) => setOnTime(e.target.value)} />
          </div>
          <div className={cls.light__input}>
            <label className={cls.light__label}>
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

export default LightWidget