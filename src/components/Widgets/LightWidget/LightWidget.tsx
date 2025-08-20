import React, { MouseEvent, ReactNode, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../models/Hook"
import { ReactComponent as LightIcon } from '../../../assets/icons/aquarium/light.svg'
import { Toggle } from "components/Toggle"
import { Modal } from "components/Modal"
import cls from './LightWidget.module.sass'
import { getCurrentInfo, switchModal, updateLight, updateLightState } from "../../../redux/AquariumSlice"
import { Status } from "models/Status"
import { ReactComponent as Spinner } from 'assets/icons/spinner.svg';
import { Button } from "components/Button"
import { Input } from "components/Input"
import { WidgetWrapper } from "../WidgetWrapper"
import { Dropdown } from "components/Dropdown"
import { getStringMode, invertMode } from "helpers/period"

interface LightWidgetProps {
  prop?: string
}

const LightWidget = ({ prop }: LightWidgetProps) => {
  const dispatch = useAppDispatch()
  const [showModal, setShowModal] = useState(false)
  const light = useAppSelector(state => state.aquarium.config.light)
  const lightCurrent = useAppSelector(state => state.aquarium.currentInfo.light.status)
  const status = useAppSelector(state => state.aquarium.status)

  const [onTime, setOnTime] = useState(light.on)
  const [offTime, setOffTime] = useState(light.off)
  const [mode, setMode] = useState(light.mode)
  const openModal = () => {
    dispatch(switchModal(true));
    setOnTime(light.on)
    setOffTime(light.off)
    setMode(light.mode)
    setShowModal(true);
  }
  const closeModal = () => {
    dispatch(switchModal(false));
    setShowModal(false);
  }

  const sendConfig = async () => {
    await dispatch(updateLight({ on: onTime, off: offTime, mode: mode }))
    if (status === Status.Succeeded) {
      setOnTime(light.on)
      setOffTime(light.off)
      setMode(light.mode)
      closeModal()
    }
  }
  const sendLightState = async () => {
    await dispatch(updateLight({ on: onTime, off: offTime, mode: invertMode(mode) }))
    if (status === Status.Succeeded) {

      setMode(invertMode(mode))
      dispatch(getCurrentInfo())
    }
  }
  const selectMode = async (mode: number) => {
    setMode(mode);
    await dispatch(updateLight({ on: onTime, off: offTime, mode: mode }))
  }
  return (
    <WidgetWrapper color='red' onClickEdit={openModal} className={cls.widget_wrapper} state={lightCurrent}>
      <div className={cls.left}>
        <div className={cls.icon_wrapper}>
          <LightIcon className={cls.icon} />
        </div>
      </div>
      <div className={cls.right}>
        <div>
          <div className={cls.text_wrapper}>
            <p className={cls.text_header}>Mode</p>
            <p className={cls.text}>{getStringMode(light.mode)}</p>
          </div>
          {light.mode === 2 && <div className={cls.text_wrapper}>
            <p className={cls.text_header}>On Time</p>
            <p className={cls.text}>{light.on}</p>
          </div>}
          {light.mode === 2 && <div className={cls.text_wrapper}>
            <p className={cls.text_header}>Off Time</p>
            <p className={cls.text}>{light.off}</p>
          </div>}
        </div>
      </div>

      <Modal isOpen={showModal} onClose={closeModal} iconColor='green' bgWrapper='none' style='none'>
        <WidgetWrapper color='red' type='write' onClickEdit={closeModal} className={cls.wrapper} state={lightCurrent}>
          <div className={cls.edit}>
            <div className={cls.edit_right}>
              <div className={cls.edit_header}>
                <LightIcon className={cls.edit_icon} />
                <div className={cls.edit_header_text}>Light settings</div>
              </div>
              <div className={cls.edit_wrapper}>
                <div className={cls.edit_text_wrapper}>
                  <p className={cls.edit_text_header}>
                    Mode
                  </p>
                  <Dropdown className={cls.dropdown} select={getStringMode(mode)} items={[
                    [{
                      content: 'Auto',
                      onClick: () => selectMode(2)
                    },
                    {
                      content: 'Manual',
                      onClick: () => selectMode(Number(lightCurrent))
                    }]
                  ]} />
                </div>
                <div className={cls.edit_group}>
                  {mode === 2 && <div className={cls.edit_text_wrapper}>
                    <p className={cls.edit_text_header}>On Time</p>
                    <Input type="time" value={onTime} onChange={(e) => setOnTime(e.target.value)} />
                  </div>}
                  {mode === 2 && <div className={cls.edit_text_wrapper}>
                    <p className={cls.edit_text_header}>Off Time</p>
                    <Input type="time" value={offTime} onChange={(e) => setOffTime(e.target.value)} />
                  </div>}
                  {mode !== 2 && <div className={cls.edit_text_wrapper}>
                    <p className={cls.edit_text_header}>State</p>
                    <Toggle className={cls.toggle} size="XL" checked={lightCurrent} onClick={sendLightState} />
                  </div>}
                </div>
              </div>
            </div>
            <div className={cls.buttons}>
              {status !== Status.Loading ? (
                <>
                  <Button size='L' theme='outline-transp' onClick={closeModal}>Cancel</Button>
                  <Button size='L' onClick={sendConfig}>Confirm</Button>
                </>
              ) : (
                <>
                  <Button size='L' theme='outline' disabled>Cancel</Button>
                  <Button size='L' disabled>
                    <Spinner width={10} height={10} />
                    Loading...
                  </Button>
                </>
              )}
            </div>

          </div>
        </WidgetWrapper>
      </Modal>
    </WidgetWrapper>
  )
}

export default LightWidget