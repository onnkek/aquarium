import React, { MouseEvent, ReactNode, useState } from "react"
import cls from "./CO2Widget.module.sass"
import { useAppDispatch, useAppSelector } from "../../../models/Hook"
import { Toggle } from "components/Toggle"
import { Modal } from "components/Modal"
import { Button } from "components/Button"
import { Input } from "components/Input"
import { updateCO2, updateCO2State } from "../../../redux/AquariumSlice"
import { Status } from "models/Status"
import { ReactComponent as CO2Icon } from 'assets/icons/aquarium/co2.svg';
import { ReactComponent as Spinner } from 'assets/icons/spinner.svg';
import { WidgetWrapper } from "../WidgetWrapper"

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
    console.log("test")
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
    <WidgetWrapper color='yellow' onClickEdit={openModal}>
      <div className={cls.left}>
        <div className={cls.icon_wrapper}>
          <CO2Icon className={cls.icon} />
        </div>
        <Toggle className={cls.toggle} size="XL" checked={co2current} onClick={openApprove} />
      </div>
      <div className={cls.right}>
        <div>
          <div className={cls.text_wrapper}>
            <p className={cls.text_header}>On Time</p>
            <p className={cls.text}>{co2.on}</p>
          </div>
          <div className={cls.text_wrapper}>
            <p className={cls.text_header}>Off Time</p>
            <p className={cls.text}>{co2.off}</p>
          </div>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={closeModal} iconColor='green' bgWrapper='none' style='none'>
        <WidgetWrapper color='yellow' type='write' onClickEdit={closeModal}>
          <div className={cls.edit}>
            <div className={cls.right}>
              <CO2Icon className={cls.edit_icon} />
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
    </WidgetWrapper>
  )
}

export default CO2Widget