import React, { MouseEvent, ReactNode, useState } from "react"
import cls from "./CO2Widget.module.sass"
import { useAppDispatch, useAppSelector } from "../../../models/Hook"
import { Toggle } from "components/Toggle"
import { Modal } from "components/Modal"
import { Button } from "components/Button"
import { Input } from "components/Input"
import { getCurrentInfo, updateCO2, updateCO2State } from "../../../redux/AquariumSlice"
import { Status } from "models/Status"
import { ReactComponent as CO2Icon } from 'assets/icons/aquarium/co2.svg';
import { ReactComponent as Spinner } from 'assets/icons/spinner.svg';
import { WidgetWrapper } from "../WidgetWrapper"
import { Dropdown } from "components/Dropdown"
import { getStringMode, invertMode } from "helpers/period"

interface CO2WidgetProps {
  prop?: string
}

const CO2Widget = ({ prop }: CO2WidgetProps) => {
  const dispatch = useAppDispatch()
  const [showModal, setShowModal] = useState(false)
  const co2 = useAppSelector(state => state.aquarium.config.co2)
  const co2current = useAppSelector(state => state.aquarium.currentInfo.co2.status)
  const status = useAppSelector(state => state.aquarium.status)

  const [onTime, setOnTime] = useState(co2.on)
  const [offTime, setOffTime] = useState(co2.off)
  const [mode, setMode] = useState(co2.mode)

  const openModal = () => {
    setOnTime(co2.on)
    setOffTime(co2.off)
    setMode(co2.mode)
    setShowModal(true);
  }
  const closeModal = () => {
    setShowModal(false);
  }
  const sendConfig = async () => {
    await dispatch(updateCO2({ on: onTime, off: offTime, mode: mode }))
    if (status === Status.Succeeded) {
      setOnTime(co2.on)
      setOffTime(co2.off)
      closeModal()
    }
  }
  const sendCO2State = async () => {
    await dispatch(updateCO2({ on: onTime, off: offTime, mode: invertMode(mode) }))
    if (status === Status.Succeeded) {

      setMode(invertMode(mode))
      dispatch(getCurrentInfo())
    }
  }
  const selectMode = async (mode: number) => {
    setMode(mode);
    await dispatch(updateCO2({ on: onTime, off: offTime, mode: mode }))
  }
  return (
    <WidgetWrapper color='yellow' onClickEdit={openModal} className={cls.widget_wrapper} state={co2current}>
      <div className={cls.left}>
        <div className={cls.icon_wrapper}>
          <CO2Icon className={cls.icon} />
        </div>
        {/* <Toggle className={cls.toggle} size="XL" checked={co2current} onClick={openApprove} /> */}
      </div>
      <div className={cls.right}>
        <div>
          <div className={cls.text_wrapper}>
            <p className={cls.text_header}>Mode</p>
            <p className={cls.text}>{getStringMode(co2.mode)}</p>
          </div>
          {co2.mode === 2 && <div className={cls.text_wrapper}>
            <p className={cls.text_header}>On Time</p>
            <p className={cls.text}>{co2.on}</p>
          </div>}
          {co2.mode === 2 && <div className={cls.text_wrapper}>
            <p className={cls.text_header}>Off Time</p>
            <p className={cls.text}>{co2.off}</p>
          </div>}
        </div>
      </div>

      <Modal isOpen={showModal} onClose={closeModal} iconColor='green' bgWrapper='none' style='none'>
        <WidgetWrapper color='yellow' type='write' onClickEdit={closeModal} className={cls.wrapper} state={co2current}>
          <div className={cls.edit}>
            <div className={cls.edit_right}>
              <CO2Icon className={cls.edit_icon} />
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
                      onClick: () => selectMode(Number(co2current))
                    }]
                  ]} />
                </div>
                {mode === 2 && <div className={cls.text_wrapper}>
                  <p className={cls.edit_text_header}>On Time</p>
                  <Input type="time" value={onTime} onChange={(e) => setOnTime(e.target.value)} />
                </div>}
                {mode === 2 && <div className={cls.text_wrapper}>
                  <p className={cls.edit_text_header}>Off Time</p>
                  <Input type="time" value={offTime} onChange={(e) => setOffTime(e.target.value)} />
                </div>}
                {mode !== 2 && <div className={cls.text_wrapper}>
                  <p className={cls.edit_text_header}>State</p>
                  <Toggle className={cls.toggle} size="XL" checked={co2current} onClick={sendCO2State} />
                </div>}
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

export default CO2Widget