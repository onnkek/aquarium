import React, { MouseEvent, ReactNode, useState } from "react"
import "./TempWidget.sass"
import { useAppDispatch, useAppSelector } from "../../../models/Hook"
import tempIcon from '../../../assets/icons/aquarium/temp.svg'
import gearIcon from '../../../assets/icons/gear.svg'
import { Toggle } from "components/Toggle"
import fanIcon from '../../../assets/icons/fan.svg'
import heatIcon from '../../../assets/icons/heat.svg'
import { Modal } from "components/Modal"
import { Status } from "models/Status"
import { Button } from "components/Button"
import { Input } from "components/Input"
import { updateTemp, updateTempState } from "../../../redux/AquariumSlice"
import { ReactComponent as Spinner } from 'assets/icons/spinner.svg';
import { classNames } from "helpers/classNames"

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
    <div className="temp">
      <div className="temp__blur" />
      <div className="temp__rect" />
      <div className="temp__left">
        <img className="temp__icon" src={tempIcon} />
        <Toggle size="XL" checked={tempCurrent.status} onClick={openApprove} />
      </div>
      <div className="temp__right">
        <div className="temp__body-right">
          <div className="temp__text-container">
            <p className="temp__text-tag">Current</p>
            <p className="temp__text">{tempCurrent.current} ℃</p>
          </div>

          {tempCurrent.cool && <div className="temp__text-container temp__text-container-mode">
            <p className="temp__text-tag">Mode</p>
            <img className={classNames("fan", { ["fan-animation"]: tempCurrent.status }, [])} src={fanIcon}></img>
          </div>}

          {tempCurrent.heat && <div className="temp__text-container temp__text-container-mode">
            <p className="temp__text-tag">Mode</p>
            <img className={classNames("heat", { ["heat-animation"]: tempCurrent.status }, [])} src={heatIcon}></img>
          </div>}

        </div>
      </div>

      <button
        type="button"
        className="temp__edit-btn"
        onClick={openModal}
      >
        <img className="temp__edit-btn-icon" src={gearIcon}></img>
      </button>
      <Modal isOpen={showApprove} onClose={closeApprove} iconColor='green' bgWrapper='none'>
        <div className="temp__form">
          <div className="temp__input">
            <label className="temp__label">
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
      <Modal isOpen={showModal} onClose={closeModal} iconColor='green' bgWrapper='none'>
        <div className="temp__form">
          <div className="temp__input-group">
            <div className="temp__input">
              <label className="temp__label">
                Set setting
              </label>
              <Input type="number" value={setting} onChange={(e) => setSetting(Number(e.target.value))} />
            </div>
            <div className="temp__input">
              <label className="temp__label">
                Set k
              </label>
              <Input type="number" value={k} onChange={(e) => setK(Number(e.target.value))} />
            </div>
          </div>
          <div className="temp__input-group">
            <div className="temp__input">
              <label className="temp__label">
                Set hysteresis
              </label>
              <Input type="number" value={hysteresis} onChange={(e) => setHysteresis(Number(e.target.value))} />
            </div>
            <div className="temp__input">
              <label className="temp__label">
                Set timeout
              </label>
              <Input type="number" value={timeout} onChange={(e) => setTimeout(Number(e.target.value))} />
            </div>
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
    </div >
  )
}

export default TempWidget