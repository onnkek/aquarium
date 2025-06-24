import React, { MouseEvent, ReactNode, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../models/Hook"
import { ReactComponent as LightIcon } from '../../../assets/icons/aquarium/light.svg'
import { Toggle } from "components/Toggle"
import { Modal } from "components/Modal"
import cls from './LightWidget.module.sass'
import { updateLight, updateLightState } from "../../../redux/AquariumSlice"
import { Status } from "models/Status"
import { ReactComponent as Spinner } from 'assets/icons/spinner.svg';
import { Button } from "components/Button"
import { Input } from "components/Input"
import { WidgetWrapper } from "../WidgetWrapper"

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
    <WidgetWrapper color='red' onClickEdit={openModal}>
      <div className={cls.left}>
        <div className={cls.icon_wrapper}>
          <LightIcon className={cls.icon} />
        </div>

        <Toggle className={cls.toggle} size="XL" checked={lightCurrent} onClick={openApprove} />
      </div>
      <div className={cls.right}>
        <div>
          <div className={cls.text_wrapper}>
            <p className={cls.text_header}>On Time</p>
            <p className={cls.text}>{light.on}</p>
          </div>
          <div className={cls.text_wrapper}>
            <p className={cls.text_header}>Off Time</p>
            <p className={cls.text}>{light.off}</p>
          </div>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={closeModal} iconColor='green' bgWrapper='none' style='none'>
        <WidgetWrapper color='red' type='write' onClickEdit={closeModal}>
          <div className={cls.edit}>
            <div className={cls.right}>
              <LightIcon className={cls.edit_icon} />
              <div>
                <div className={cls.text_wrapper}>
                  <p className={cls.edit_text_header}>On Time</p>
                  <Input type="time" value={onTime} onChange={(e) => setOnTime(e.target.value)} />
                </div>
                <div className={cls.text_wrapper}>
                  <p className={cls.edit_text_header}>Off Time</p>
                  <Input type="time" value={offTime} onChange={(e) => setOffTime(e.target.value)} />
                </div>
              </div>
            </div>
            <div className={cls.buttons}>
              {status !== Status.Loading ? (
                <>
                  <Button width='170px' size='L' theme='outline-transp' onClick={closeModal}>Cancel</Button>
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

          </div>
        </WidgetWrapper>
      </Modal>


      <Modal isOpen={showApprove} onClose={closeApprove} iconColor='green' bgWrapper='none'>
        <div className="co2__form">
          <div className="co2__input">
            <label className="co2__label">
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
    </WidgetWrapper>
  )
}

export default LightWidget