import React, { MouseEvent, ReactNode, useState } from "react"
import cls from './TempWidget.module.sass'
import { useAppDispatch, useAppSelector } from "../../../models/Hook"
import { Toggle } from "components/Toggle"
import { Modal } from "components/Modal"
import { Status } from "models/Status"
import { Button } from "components/Button"
import { Input } from "components/Input"
import { updateTemp, updateTempState } from "../../../redux/AquariumSlice"
import { ReactComponent as Spinner } from 'assets/icons/spinner.svg';
import { ReactComponent as TempIcon } from 'assets/icons/aquarium/temp.svg';
import { ReactComponent as CoolIcon } from 'assets/icons/fan.svg';
import { ReactComponent as HeatIcon } from 'assets/icons/heat.svg';
import { classNames } from "helpers/classNames"
import { WidgetWrapper } from "../WidgetWrapper"

interface TempWidgetProps {
  prop?: string
}

const TempWidget = ({ prop }: TempWidgetProps) => {
  const dispatch = useAppDispatch()
  const [showModal, setShowModal] = useState(false)
  const [showApprove, setShowApprove] = useState(false)
  const temp = useAppSelector(state => state.aquarium.config.temp)
  const tempCurrent = useAppSelector(state => state.aquarium.currentInfo.temp)
  const status = useAppSelector(state => state.aquarium.status)

  const [setting, setSetting] = useState(temp.setting)
  const [k, setK] = useState(temp.k)
  const [hysteresis, setHysteresis] = useState(temp.hysteresis)
  const [timeout, setTimeout] = useState(temp.timeout)

  const openModal = () => {
    setSetting(temp.setting)
    setK(temp.k)
    setHysteresis(temp.hysteresis)
    setTimeout(temp.timeout)
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
    await dispatch(updateTemp({
      setting: setting,
      k: k,
      hysteresis: hysteresis,
      timeout: timeout
    }))
    if (status === Status.Succeeded) {
      setSetting(temp.setting)
      setK(temp.k)
      setHysteresis(temp.hysteresis)
      setTimeout(temp.timeout)
      closeModal()
    }
  }
  const sendTempState = async () => {
    await dispatch(updateTempState(!tempCurrent.status))
    if (status === Status.Succeeded) {
      closeApprove()
    }
  }

  return (
    <WidgetWrapper color='violet' onClickEdit={openModal}>
      <div className={cls.left}>
        <div className={cls.icon_wrapper}>
          <TempIcon className={cls.icon} />
        </div>

        <Toggle className={cls.toggle} size="XL" checked={tempCurrent.status} onClick={openApprove} />
      </div>
      <div className={cls.right}>
        <div>
          <div className={cls.text_wrapper}>
            <p className={cls.text_header}>Current</p>
            <p className={cls.text}>{tempCurrent.current} ℃</p>
          </div>

          {tempCurrent.cool && <div className={cls.text_wrapper}>
            <p className={cls.text_header}>Mode</p>
            <CoolIcon className={classNames(cls.cool, { [cls.cool_animation]: tempCurrent.status }, [])} />
          </div>}

          {tempCurrent.heat && <div className={cls.text_wrapper}>
            <p className={cls.text_header}>Mode</p>
            <HeatIcon className={classNames(cls.heat, { [cls.heat_animation]: tempCurrent.status }, [])} />
          </div>}
        </div>
      </div>

      <Modal isOpen={showModal} onClose={closeModal} iconColor='green' bgWrapper='none' style='none'>
        <WidgetWrapper color='violet' type='write' onClickEdit={closeModal}>
          <div className={cls.edit}>
            <div className={cls.right}>
              <TempIcon className={cls.edit_icon} />
              <div>
                <div className={cls.text_wrapper}>
                  <p className={cls.edit_text_header}>Set setting</p>
                  <Input type="number" value={setting} onChange={(e) => setSetting(Number(e.target.value))} />
                </div>
                <div className={cls.text_wrapper}>
                  <p className={cls.edit_text_header}>Set k</p>
                  <Input type="number" value={k} onChange={(e) => setK(Number(e.target.value))} />
                </div>
                <div className={cls.text_wrapper}>
                  <p className={cls.edit_text_header}>Set hysteresis</p>

                  <Input type="number" value={hysteresis} onChange={(e) => setHysteresis(Number(e.target.value))} />
                </div>
                <div className={cls.text_wrapper}>
                  <p className={cls.edit_text_header}>Set timeout</p>
                  <Input type="number" value={timeout} onChange={(e) => setTimeout(Number(e.target.value))} />
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
              This will lead to PID control shutdown. Do you agree?
            </label>
          </div>
        </div>
        <div style={{ display: 'flex', marginTop: '32px', justifyContent: 'space-between' }}>
          {status !== Status.Loading ? (
            <>
              <Button width='170px' size='L' theme='outline' onClick={closeApprove}>Cancel</Button>
              <Button width='170px' size='L' onClick={sendTempState}>Agree</Button>
            </>
          ) : (
            <>
              <Button width='170px' size='L' theme='outline' onClick={closeApprove} disabled>Cancel</Button>
              <Button width='170px' size='L' onClick={sendTempState} disabled>
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

export default TempWidget