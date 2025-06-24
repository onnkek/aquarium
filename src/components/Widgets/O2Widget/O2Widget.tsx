import React, { MouseEvent, ReactNode, useState } from "react"
import cls from './O2Widget.module.sass'
import { useAppDispatch, useAppSelector } from "../../../models/Hook"
import { Toggle } from "components/Toggle"
import { Modal } from "components/Modal"
import { Status } from "models/Status"
import { Button } from "components/Button"
import { updateO2, updateO2State } from "../../../redux/AquariumSlice"
import { ReactComponent as O2Icon } from 'assets/icons/aquarium/o2.svg';
import { ReactComponent as Spinner } from 'assets/icons/spinner.svg';
import { Input } from "components/Input"
import { WidgetWrapper } from "../WidgetWrapper"

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
    <WidgetWrapper color='blue' onClickEdit={openModal}>
      <div className={cls.left}>
        <div className={cls.icon_wrapper}>
          <O2Icon className={cls.icon} />
        </div>

        <Toggle className={cls.toggle} size="XL" checked={o2current} onClick={openApprove} />
      </div>
      <div className={cls.right}>
        <div>
          <div className={cls.text_wrapper}>
            <p className={cls.text_header}>On Time</p>
            <p className={cls.text}>{o2.on}</p>
          </div>
          <div className={cls.text_wrapper}>
            <p className={cls.text_header}>Off Time</p>
            <p className={cls.text}>{o2.off}</p>
          </div>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={closeModal} iconColor='green' bgWrapper='none' style='none'>
        <WidgetWrapper color='blue' type='write' onClickEdit={closeModal}>
          <div className={cls.edit}>
            <div className={cls.right}>
              <O2Icon className={cls.edit_icon} />
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
    </WidgetWrapper>
  )
}

export default O2Widget