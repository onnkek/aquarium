import React, { useState } from "react"
import cls from './TempWidget.module.sass'
import { Toggle } from "shared/ui/Toggle"
import { Modal } from "shared/ui/Modal"
import { Status } from "models/Status"
import { Button } from "shared/ui/Button"
import { Input } from "shared/ui/Input"
import { getCurrentInfo, switchModal, updateTemp } from "../../../redux/AquariumSlice"
import { ReactComponent as Spinner } from 'shared/assets/icons/spinner.svg';
import { ReactComponent as TempIcon } from 'shared/assets/icons/aquarium/temp.svg';
import { ReactComponent as CoolIcon } from 'shared/assets/icons/fan.svg';
import { ReactComponent as HeatIcon } from 'shared/assets/icons/heat.svg';
import { classNames } from "shared/lib/classNames"
import { Dropdown } from "shared/ui/Dropdown"
import { getStringTempMode, invertCoolMode, invertHeatMode } from "shared/lib/period"
import { useAppDispatch, useAppSelector } from "models/Hook"
import { WidgetWrapper } from "widgets/WidgetWrapper"

interface TempWidgetProps {
  prop?: string
}

export const TempWidget = ({ prop }: TempWidgetProps) => {
  const dispatch = useAppDispatch()
  const [showModal, setShowModal] = useState(false)
  const temp = useAppSelector(state => state.aquarium.config.temp)
  const tempCurrent = useAppSelector(state => state.aquarium.currentInfo.temp)
  const status = useAppSelector(state => state.aquarium.status)

  const [setting, setSetting] = useState(temp.setting)
  const [k, setK] = useState(temp.k)
  const [hysteresis, setHysteresis] = useState(temp.hysteresis)
  const [PIDTimeout, setPIDTimeout] = useState(temp.timeout)
  const [mode, setMode] = useState(0)

  const openModal = () => {
    dispatch(switchModal(true));
    setSetting(temp.setting)
    setK(temp.k)
    setHysteresis(temp.hysteresis)
    setPIDTimeout(temp.timeout)
    setMode(temp.mode)
    setShowModal(true);
  }
  const closeModal = () => {
    dispatch(switchModal(false));
    setShowModal(false);
  }
  const sendConfig = async () => {
    console.log(mode)
    await dispatch(updateTemp({
      setting: setting,
      k: k,
      hysteresis: hysteresis,
      timeout: PIDTimeout,
      mode: mode
    }))
    if (status === Status.Succeeded) {
      setSetting(temp.setting)
      setK(temp.k)
      setHysteresis(temp.hysteresis)
      setPIDTimeout(temp.timeout)
      setMode(temp.mode)
      closeModal()
    }
  }
  const sendCoolState = async () => {
    await dispatch(updateTemp({ setting: setting, timeout: PIDTimeout, k: k, hysteresis: hysteresis, mode: invertCoolMode(mode) }))
    if (status === Status.Succeeded) {
      setMode(invertCoolMode(mode))
      setTimeout(() => {
        dispatch(getCurrentInfo())
      }, temp.timeout * 1000 + 200);
    }
  }
  const sendHeatState = async () => {
    await dispatch(updateTemp({ setting: setting, timeout: PIDTimeout, k: k, hysteresis: hysteresis, mode: invertHeatMode(mode) }))
    if (status === Status.Succeeded) {
      setMode(invertHeatMode(mode))
      setTimeout(() => {
        dispatch(getCurrentInfo())
      }, temp.timeout * 1000 + 200);
    }
  }

  const selectMode = async (mode: number) => {
    setMode(mode);
    await dispatch(updateTemp({ setting: setting, timeout: PIDTimeout, k: k, hysteresis: hysteresis, mode: mode }))
  }

  return (
    <WidgetWrapper color='violet' onClickEdit={openModal} className={cls.tempWidget} state={tempCurrent.status !== 0}>
      <div className={cls.left}>
        <div className={cls.icon_wrapper}>
          <TempIcon className={cls.icon} />
        </div>
      </div>
      <div className={cls.right}>
        <div>
          <div className={cls.text_wrapper}>
            <p className={cls.text_header}>Mode</p>
            <p className={cls.text}>{getStringTempMode(temp.mode)}</p>
          </div>
          <div className={cls.text_wrapper}>
            <p className={cls.text_header}>Current</p>
            <p className={cls.text}>{tempCurrent.current.toFixed(2)} ℃</p>
          </div>

          {tempCurrent.status !== 0 &&
            <div className={cls.text_wrapper_status}>
              {(tempCurrent.status === 1 || tempCurrent.status === 3) && <CoolIcon className={classNames(cls.cool, { [cls.cool_animation]: true }, [])} />}
              {(tempCurrent.status === 2 || tempCurrent.status === 3) && <HeatIcon className={classNames(cls.heat, { [cls.heat_animation]: true }, [])} />}
            </div>}
        </div>
      </div>

      <Modal isOpen={showModal} onClose={closeModal} iconColor='green' bgWrapper='none' modalStyle={"none"} >
        <WidgetWrapper color='violet' type='write' onClickEdit={closeModal} className={cls.wrapper} state={tempCurrent.status !== 0}>
          <div className={cls.edit}>
            <div className={cls.edit_right}>
              <div className={cls.edit_header}>
                <TempIcon className={cls.edit_icon} />
                <div className={cls.edit_header_text}>Water control settings</div>
              </div>

              <div className={cls.edit_wrapper}>
                <div className={cls.edit_text_wrapper}>
                  <p className={cls.edit_text_header}>
                    Mode
                  </p>
                  <Dropdown className={cls.dropdown} select={getStringTempMode(mode)} items={[
                    [{
                      content: 'Auto',
                      onClick: () => selectMode(4)
                    },
                    {
                      content: 'Manual',
                      onClick: () => selectMode(Number(tempCurrent.status))
                    }]
                  ]} />
                </div>
                {mode === 4 && <div className={cls.edit_group}>
                  <div className={cls.edit_text_wrapper}>
                    <p className={cls.edit_text_header}>Set setting</p>
                    <Input type="number" value={setting} onChange={(e) => setSetting(Number(e.target.value))} />
                  </div>
                  <div className={cls.edit_text_wrapper}>
                    <p className={cls.edit_text_header}>Set k</p>
                    <Input type="number" value={k} onChange={(e) => setK(Number(e.target.value))} />
                  </div>
                </div>}
                {mode === 4 && <div className={cls.edit_group}>
                  <div className={cls.edit_text_wrapper}>
                    <p className={cls.edit_text_header}>Set hysteresis</p>

                    <Input type="number" value={hysteresis} onChange={(e) => setHysteresis(Number(e.target.value))} />
                  </div>
                  <div className={cls.edit_text_wrapper}>
                    <p className={cls.edit_text_header}>Set timeout</p>
                    <Input type="number" value={PIDTimeout} onChange={(e) => setPIDTimeout(Number(e.target.value))} />
                  </div>
                </div>}


                {mode !== 4 && <div className={cls.edit_group}>
                  <div className={cls.edit_text_wrapper}>
                    <p className={cls.edit_text_header}>Cooling state</p>
                    <Toggle className={cls.toggle} size="XL" checked={(tempCurrent.status === 1 || tempCurrent.status === 3) ? true : false} onClick={sendCoolState} />
                  </div>
                  <div className={cls.edit_text_wrapper}>
                    <p className={cls.edit_text_header}>Heating state</p>
                    <Toggle className={cls.toggle} size="XL" checked={(tempCurrent.status === 2 || tempCurrent.status === 3) ? true : false} onClick={sendHeatState} />
                  </div>
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