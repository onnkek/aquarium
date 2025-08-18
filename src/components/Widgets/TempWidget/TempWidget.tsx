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
import { Dropdown } from "components/Dropdown"

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
  const [mode, setMode] = useState("Auto")

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
    <WidgetWrapper color='violet' onClickEdit={openModal} className={cls.widget_wrapper} state={tempCurrent.status}>
      <div className={cls.left}>
        <div className={cls.icon_wrapper}>
          <TempIcon className={cls.icon} />
        </div>
      </div>
      <div className={cls.right}>
        <div>
          <div className={cls.text_wrapper}>
            <p className={cls.text_header}>Mode</p>
            <p className={cls.text}>{mode}</p>
          </div>
          <div className={cls.text_wrapper}>
            <p className={cls.text_header}>Current</p>
            <p className={cls.text}>{tempCurrent.current.toFixed(2)} ℃</p>
          </div>

          {1 && <div className={cls.text_wrapper_status}>

            <CoolIcon className={classNames(cls.cool, { [cls.cool_animation]: true }, [])} />
            <HeatIcon className={classNames(cls.heat, { [cls.heat_animation]: true }, [])} />
          </div>}

          {/* {tempCurrent.heat && <div className={cls.text_wrapper}>
            <p className={cls.text_header}>Mode</p>
            <HeatIcon className={classNames(cls.heat, { [cls.heat_animation]: tempCurrent.status }, [])} />
          </div>} */}
        </div>
      </div>

      <Modal isOpen={showModal} onClose={closeModal} iconColor='green' bgWrapper='none' style='none' >
        <WidgetWrapper color='violet' type='write' onClickEdit={closeModal} className={cls.wrapper} state={tempCurrent.status}>
          <div className={cls.edit}>
            <div className={cls.edit_right}>
              <TempIcon className={cls.edit_icon} />
              <div className={cls.edit_wrapper}>
                <div className={cls.text_wrapper}>
                  <p className={cls.edit_text_header}>
                    Mode
                  </p>
                  <Dropdown className={cls.dropdown} select={mode} items={[
                    [{
                      content: 'Auto',
                      onClick: () => setMode("Auto")
                    },
                    {
                      content: 'Manual',
                      onClick: () => setMode("Manual")
                    }]
                  ]} />
                </div>
                {mode === "Auto" && <div className={cls.text_wrapper}>
                  <p className={cls.edit_text_header}>Set setting</p>
                  <Input type="number" value={setting} onChange={(e) => setSetting(Number(e.target.value))} />
                </div>}
                {mode === "Auto" && <div className={cls.text_wrapper}>
                  <p className={cls.edit_text_header}>Set k</p>
                  <Input type="number" value={k} onChange={(e) => setK(Number(e.target.value))} />
                </div>}
                {mode === "Auto" && <div className={cls.text_wrapper}>
                  <p className={cls.edit_text_header}>Set hysteresis</p>

                  <Input type="number" value={hysteresis} onChange={(e) => setHysteresis(Number(e.target.value))} />
                </div>}
                {mode === "Auto" && <div className={cls.text_wrapper}>
                  <p className={cls.edit_text_header}>Set timeout</p>
                  <Input type="number" value={timeout} onChange={(e) => setTimeout(Number(e.target.value))} />
                </div>}
                {mode === "Manual" && <div className={cls.text_wrapper}>
                  <p className={cls.edit_text_header}>State</p>
                  <Toggle className={cls.toggle} size="XL" checked={tempCurrent.status} onClick={() => { }} />
                </div>}
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
        <div>
          <div>
            <p className={cls.agree}>
              PID control, coolers and heaters will be {tempCurrent.status ? 'switched off' : 'switched on'}.
            </p>
          </div>
        </div>
        <div className={cls.buttons}>
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