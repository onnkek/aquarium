import React, { useState } from "react"
import { useAppDispatch, useAppSelector } from "models/Hook"
import { ReactComponent as LightIcon } from 'shared/assets/icons/aquarium/light.svg'
import { Toggle } from "shared/ui/Toggle"
import { Modal } from "shared/ui/Modal"
import cls from './LightWidget.module.sass'
import { getCurrentInfo, switchModal, updateLight } from "../../../redux/AquariumSlice"
import { Status } from "models/Status"
import { ReactComponent as Spinner } from 'shared/assets/icons/spinner.svg';
import { Button } from "shared/ui/Button"
import { Input } from "shared/ui/Input"
import { Dropdown } from "shared/ui/Dropdown"
import { getStringMode, invertMode } from "shared/lib/period"
import { WidgetWrapper } from "widgets/WidgetWrapper"

interface LightWidgetProps {
  prop?: string
}

export const LightWidget = ({ prop }: LightWidgetProps) => {
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
    await dispatch(updateLight({ on: onTime, off: offTime, mode: mode, name: light.name }))
    if (status === Status.Succeeded) {
      setOnTime(light.on)
      setOffTime(light.off)
      setMode(light.mode)
      closeModal()
    }
  }
  const sendLightState = async () => {
    await dispatch(updateLight({ on: onTime, off: offTime, mode: invertMode(mode), name: light.name }))
    if (status === Status.Succeeded) {

      setMode(invertMode(mode))
      setTimeout(() => {
        dispatch(getCurrentInfo())
      }, 200);
    }
  }
  const selectMode = async (mode: number) => {
    setMode(mode);
    await dispatch(updateLight({ on: onTime, off: offTime, mode: mode, name: light.name }))
  }
  return (
    <WidgetWrapper color='red' onClickEdit={openModal} className={cls.lightWidget} state={lightCurrent}>
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

      <Modal isOpen={showModal} onClose={closeModal} iconColor='green' bgWrapper='none' modalStyle='none'>
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