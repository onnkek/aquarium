import React, { useState } from "react"
import cls from './O2Widget.module.sass'
import { useAppDispatch, useAppSelector } from "models/Hook"
import { Toggle } from "shared/ui/Toggle"
import { Modal } from "shared/ui/Modal"
import { Status } from "models/Status"
import { Button } from "shared/ui/Button"
import { getCurrentInfo, switchModal, updateO2 } from "../../../redux/AquariumSlice"
import { ReactComponent as O2Icon } from 'shared/assets/icons/aquarium/o2.svg';
import { ReactComponent as Spinner } from 'shared/assets/icons/spinner.svg';
import { Input } from "shared/ui/Input"
import { WidgetWrapper } from "../../WidgetWrapper"
import { Dropdown } from "shared/ui/Dropdown"
import { getStringMode, invertMode } from "shared/lib/period"

interface O2WidgetProps {
  prop?: string
}

export const O2Widget = ({ prop }: O2WidgetProps) => {
  const dispatch = useAppDispatch()
  const [showModal, setShowModal] = useState(false)
  const o2 = useAppSelector(state => state.aquarium.config.o2)
  const o2current = useAppSelector(state => state.aquarium.currentInfo.o2.status)
  const status = useAppSelector(state => state.aquarium.status)

  const [onTime, setOnTime] = useState(o2.on)
  const [offTime, setOffTime] = useState(o2.off)
  const [mode, setMode] = useState(o2.mode)

  const openModal = () => {
    dispatch(switchModal(true));
    setOnTime(o2.on)
    setOffTime(o2.off)
    setMode(o2.mode)
    setShowModal(true);
  }
  const closeModal = () => {
    dispatch(switchModal(false));
    setShowModal(false);
  }

  const sendConfig = async () => {
    await dispatch(updateO2({ on: onTime, off: offTime, mode: mode }))
    if (status === Status.Succeeded) {
      setOnTime(o2.on)
      setOffTime(o2.off)
      setMode(o2.mode)
      closeModal()
    }
  }
  const sendO2State = async () => {
    await dispatch(updateO2({ on: onTime, off: offTime, mode: invertMode(mode) }))
    if (status === Status.Succeeded) {

      setMode(invertMode(mode))
      setTimeout(() => {
        dispatch(getCurrentInfo())
      }, 200);
    }
  }
  const selectMode = async (mode: number) => {
    setMode(mode);
    await dispatch(updateO2({ on: onTime, off: offTime, mode: mode }))
  }

  return (
    <WidgetWrapper color='blue' onClickEdit={openModal} className={cls.o2Widget} state={o2current}>
      <div className={cls.left}>
        <div className={cls.icon_wrapper}>
          <O2Icon className={cls.icon} />
        </div>
      </div>
      <div className={cls.right}>
        <div>
          <div className={cls.text_wrapper}>
            <p className={cls.text_header}>Mode</p>
            <p className={cls.text}>{getStringMode(o2.mode)}</p>
          </div>
          {o2.mode === 2 && <div className={cls.text_wrapper}>
            <p className={cls.text_header}>On Time</p>
            <p className={cls.text}>{o2.on}</p>
          </div>}
          {o2.mode === 2 && <div className={cls.text_wrapper}>
            <p className={cls.text_header}>Off Time</p>
            <p className={cls.text}>{o2.off}</p>
          </div>}
        </div>
      </div>

      <Modal isOpen={showModal} onClose={closeModal} iconColor='green' bgWrapper='none' modalStyle='none'>
        <WidgetWrapper color='blue' type='write' onClickEdit={closeModal} className={cls.wrapper} state={o2current}>
          <div className={cls.edit}>
            <div className={cls.edit_right}>
              <div className={cls.edit_header}>
                <O2Icon className={cls.edit_icon} />
                <div className={cls.edit_header_text}>O2 settings</div>
              </div>
              <div className={cls.edit_wrapper}>
                <div className={cls.text_wrapper}>
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
                      onClick: () => selectMode(Number(o2current))
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
                    <Toggle className={cls.toggle} size="XL" checked={o2current} onClick={sendO2State} />
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
                    <Spinner />
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