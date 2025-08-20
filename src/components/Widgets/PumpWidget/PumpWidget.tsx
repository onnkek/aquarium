import React, { useState } from "react"
import cls from './PumpWidget.module.sass'
import { getCurrentInfo, IPumpPeriod, switchModal, updateDoser } from "../../../redux/AquariumSlice"
import { useAppDispatch, useAppSelector } from "models/Hook"
import gearIcon from '../../../assets/icons/gear.svg'
import pumpIcon from '../../../assets/icons/aquarium/pump.svg'
import { Modal } from "components/Modal"
import { Input } from "components/Input"
import { Status } from "models/Status"
import { Button } from "components/Button"
import { ReactComponent as Spinner } from 'assets/icons/spinner.svg';
import { ReactComponent as PumpIcon } from 'assets/icons/aquarium/pump.svg';
import { ButtonGroup } from "components/ButtonGroup"
import { getPeriodString, getStringMode, invertMode } from "helpers/period"
import { Progress } from "components/Progress"
import { WidgetWrapper } from "../WidgetWrapper"
import { Dropdown } from "components/Dropdown"
import { Toggle } from "components/Toggle"

interface PumpWidgetProps {
  number: number
}

export const PumpWidget = ({ number }: PumpWidgetProps) => {
  const dispatch = useAppDispatch()
  const [showModal, setShowModal] = useState(false)
  const pump = useAppSelector(state => state.aquarium.config.doser[number])
  const pumpCurrent = useAppSelector(state => state.aquarium.currentInfo.doser[number])
  const status = useAppSelector(state => state.aquarium.status)

  const [name, setName] = useState(pump.name)
  const [time, setTime] = useState(pump.time)
  const [currentVolume, setCurrentVolume] = useState(pump.currentVolume)
  const [maxVolume, setMaxVolume] = useState(pump.maxVolume)
  const [dose, setDose] = useState(pump.dose)
  const [period, setPeriod] = useState<IPumpPeriod>(pump.period)
  const [mode, setMode] = useState(pump.mode)


  const openModal = () => {
    dispatch(switchModal(true));
    setName(pump.name)
    setTime(pump.time)
    setCurrentVolume(pump.currentVolume)
    setMaxVolume(pump.maxVolume)
    setDose(pump.dose)
    setPeriod(pump.period)
    setMode(pump.mode)
    setShowModal(true);
  }
  const closeModal = () => {
    dispatch(switchModal(false));
    setShowModal(false);
  }

  const sendPumpState = async () => {
    await dispatch(updateDoser({
      number: number, config:
      {
        name: name,
        dose: dose,
        time: time,
        currentVolume: currentVolume,
        maxVolume: maxVolume,
        period: period,
        mode: invertMode(mode),
        status: pump.status
      }
    }))
    if (status === Status.Succeeded) {

      setMode(invertMode(mode))
      setTimeout(() => {
        dispatch(getCurrentInfo())
      }, 200);
    }
  }
  const sendConfig = async () => {
    await dispatch(updateDoser({
      number: number, config:
      {
        name: name,
        dose: dose,
        time: time,
        currentVolume: currentVolume,
        maxVolume: maxVolume,
        period: period,
        mode: mode,
        status: pump.status
      }
    }))
    if (status === Status.Succeeded) {
      setName(pump.name)
      setTime(pump.time)
      setCurrentVolume(pump.currentVolume)
      setMaxVolume(pump.maxVolume)
      setDose(pump.dose)
      setPeriod(pump.period)
      setMode(pump.mode)
      closeModal()
    }
  }
  return (
    <WidgetWrapper color='yellow' onClickEdit={openModal} className={cls.widget_wrapper} state={pumpCurrent.status}>

      <div className={cls.body}>

        <div className={cls.left}>
          <div className={cls.icon_wrapper}>
            <PumpIcon className={cls.icon} />
          </div>
        </div>
        <div className={cls.right}>
          <div className={cls.right_wrapper}>

            <div className={cls.text_name_wrapper}>
              {/* {pumpCurrent.status ? <span className={cls.work} /> : <></>} */}
              <p className={cls.text_name}>{pump.name}</p>
            </div>
            <div className={cls.text_wrapper}>

              <div className={cls.remainder}>
                <p className={cls.text_header}>Remainder</p>
                <div className={cls.values}>
                  <p className={cls.value}>{(pump.currentVolume / pump.dose).toFixed(0)} days</p>
                  <p className={cls.value}>{pump.currentVolume.toFixed(0)} ml</p>
                </div>
                <Progress className={cls.progress} text="none" value={pump.currentVolume / pump.maxVolume * 100} />

              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={cls.footer}>
        <div className={cls.text_wrapper}>
          <p className={cls.text_header}>Dose</p>
          <p className={cls.value}>{getPeriodString(pump.period)}</p>
          <div className={cls.values}>
            <p className={cls.value}>{pump.status} / {pump.dose} ml</p>
            <p className={cls.value}>{pump.time}</p>
          </div>
          <Progress className={cls.progress_dose} text="none" value={pump.status / pump.dose * 100} />
        </div>
      </div>



      <Modal isOpen={showModal} onClose={closeModal} iconColor='green' bgWrapper='none' style='none'>
        <WidgetWrapper color='yellow' type='write' onClickEdit={closeModal} className={cls.wrapper} state={pumpCurrent.status}>
          <div className={cls.edit}>
            <div className={cls.edit_right}>
              <div className={cls.edit_header}>
                <PumpIcon className={cls.edit_icon} />
                <div className={cls.edit_header_text}>Pump {number + 1} settings</div>
              </div>
              <div className={cls.edit_wrapper}>
                <div className={cls.edit_group}>
                  <div className={cls.edit_text_wrapper}>
                    <p className={cls.edit_text_header}>
                      Mode
                    </p>
                    <Dropdown className={cls.dropdown} select={getStringMode(mode)} items={[
                      [{
                        content: 'Auto',
                        onClick: () => setMode(2)
                      },
                      {
                        content: 'Manual',
                        onClick: () => setMode(Number(pumpCurrent.status))
                      }]
                    ]} />
                  </div>
                  {mode === 2 && <div className={cls.edit_text_wrapper}>
                    <p className={cls.edit_text_header}>Name</p>
                    <Input value={name} onChange={(e) => setName(e.target.value)} />
                  </div>}
                </div>

                <div className={cls.edit_group}>
                  {mode === 2 && <div className={cls.edit_text_wrapper}>
                    <p className={cls.edit_text_header}>Dosage</p>
                    <Input type="number" value={dose} onChange={(e) => setDose(Number(e.target.value))} />
                  </div>}

                  {mode === 2 && <div className={cls.edit_text_wrapper}>
                    <p className={cls.edit_text_header}>Pump will work</p>
                    <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
                  </div>}

                  {mode !== 2 && <div className={cls.edit_text_wrapper}>
                    <p className={cls.edit_text_header}>State</p>
                    <Toggle className={cls.toggle} size="XL" checked={pumpCurrent.status} onClick={sendPumpState} />
                  </div>}
                </div>

              </div>

            </div>
            <div className={cls.edit_group}>

              {mode === 2 && <div className={cls.edit_text_wrapper}>
                <p className={cls.edit_text_header}>Current volume</p>
                <Input type="number" value={currentVolume} onChange={(e) => setCurrentVolume(Number(e.target.value))} />
              </div>}
              {mode === 2 && <div className={cls.edit_text_wrapper}>
                <p className={cls.edit_text_header}>Max volume</p>
                <Input type="number" value={maxVolume} onChange={(e) => setMaxVolume(Number(e.target.value))} />
              </div>}

            </div>

            {mode === 2 && <div className={cls.edit_text_wrapper_week}>
              <p className={cls.edit_text_header}>Set what days the pump will work</p>
              <ButtonGroup className={cls.button_group}>
                <Button theme={period.su ? 'primary' : 'color-outline'} onClick={(e) => setPeriod({ ...period, su: !period.su })}>Su</Button>
                <Button theme={period.mo ? 'primary' : 'color-outline'} onClick={(e) => setPeriod({ ...period, mo: !period.mo })}>Mo</Button>
                <Button theme={period.tu ? 'primary' : 'color-outline'} onClick={(e) => setPeriod({ ...period, tu: !period.tu })}>Tu</Button>
                <Button theme={period.we ? 'primary' : 'color-outline'} onClick={(e) => setPeriod({ ...period, we: !period.we })}>We</Button>
                <Button theme={period.th ? 'primary' : 'color-outline'} onClick={(e) => setPeriod({ ...period, th: !period.th })}>Th</Button>
                <Button theme={period.fr ? 'primary' : 'color-outline'} onClick={(e) => setPeriod({ ...period, fr: !period.fr })}>Fr</Button>
                <Button theme={period.sa ? 'primary' : 'color-outline'} onClick={(e) => setPeriod({ ...period, sa: !period.sa })}>Sa</Button>
              </ButtonGroup>
            </div>}
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
  );
};