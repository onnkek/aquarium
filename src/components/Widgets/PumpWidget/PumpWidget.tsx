import React, { useState } from "react"
import './PumpWidget.sass'
import { IPumpPeriod, updateDoser } from "../../../redux/AquariumSlice"
import { useAppDispatch, useAppSelector } from "models/Hook"
import gearIcon from '../../../assets/icons/gear.svg'
import pumpIcon from '../../../assets/icons/aquarium/pump.svg'
import { Modal } from "components/Modal"
import { Input } from "components/Input"
import { Status } from "models/Status"
import { Button } from "components/Button"
import { ReactComponent as Spinner } from 'assets/icons/spinner.svg';
import { ButtonGroup } from "components/ButtonGroup"
import { getPeriodString } from "helpers/period"
import { Progress } from "components/Progress"

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


  const openModal = () => {
    setName(pump.name)
    setTime(pump.time)
    setCurrentVolume(pump.currentVolume)
    setMaxVolume(pump.maxVolume)
    setDose(pump.dose)
    setPeriod(pump.period)
    setShowModal(true);
  }
  const closeModal = () => {
    setShowModal(false);
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
        period: period
      }
    }))
    if (status === Status.Succeeded) {
      setName(pump.name)
      setTime(pump.time)
      setCurrentVolume(pump.currentVolume)
      setMaxVolume(pump.maxVolume)
      setDose(pump.dose)
      setPeriod(pump.period)
      closeModal()
    }
  }
  return (
    <div className="pump">
      <div className="pump__blur" />
      <div className="pump__rect" />
      <div className="pump__body">
        <div className="pump__left">
          <img className="pump__icon" src={pumpIcon} />
        </div>
        <div className="pump__right">
          <div className="pump__text-container">
            <p className="pump__text">{pump.name}</p>
          </div>
          <div className="pump__text-container pump__remainder-container">
            {/* <img className="pump__icon" src={harddriveIcon}></img> */}

            <div className="pump__remainder">
              <p className="pump__text-tag">Remainder</p>
              <div className="pump__values">
                <p className="pump__text">{pump.currentVolume / pump.dose} days</p>
                <p className="pump__text">{pump.currentVolume} ml</p>
              </div>
              <Progress className="pump__progress" text="none" value={pump.currentVolume / pump.maxVolume * 100} />

            </div>
          </div>


        </div>
      </div>
      <div className="pump__dose-container">
        <div className="pump__dose">
          <p className="pump__text-tag">Dose</p>
          <p className="pump__text">{getPeriodString(pump.period)}</p>
          <div className="pump__values">
            <p className="pump__text">{pump.dose} ml</p>

            <p className="pump__text">{pump.time}</p>
          </div>
          <Progress className="pump__progress-dose" text="none" value={pumpCurrent.current / pump.dose * 100} />

        </div>
      </div>
      <button
        type="button"
        className="pump__edit-btn"
        onClick={openModal}
      >
        <img className="pump__edit-btn-icon" src={gearIcon}></img>
      </button>
      <Modal isOpen={showModal} onClose={closeModal} iconColor='green' bgWrapper='none'>
        <div className="pump__form">
          <div>
            <div className="pump__input">
              <label className="pump__label">
                Set pump name
              </label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="pump__input">
              <label className="pump__label">
                Set time the pump will work
              </label>
              <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
            <div className="pump__input">
              <label className="pump__label">
                Set what days the pump will work
              </label>
              <ButtonGroup>
                <Button theme={period.su ? 'primary' : 'color-outline'} onClick={(e) => setPeriod({ ...period, su: !period.su })}>Su</Button>
                <Button theme={period.mo ? 'primary' : 'color-outline'} onClick={(e) => setPeriod({ ...period, mo: !period.mo })}>Mo</Button>
                <Button theme={period.tu ? 'primary' : 'color-outline'} onClick={(e) => setPeriod({ ...period, tu: !period.tu })}>Tu</Button>
                <Button theme={period.we ? 'primary' : 'color-outline'} onClick={(e) => setPeriod({ ...period, we: !period.we })}>We</Button>
                <Button theme={period.th ? 'primary' : 'color-outline'} onClick={(e) => setPeriod({ ...period, th: !period.th })}>Th</Button>
                <Button theme={period.fr ? 'primary' : 'color-outline'} onClick={(e) => setPeriod({ ...period, fr: !period.fr })}>Fr</Button>
                <Button theme={period.sa ? 'primary' : 'color-outline'} onClick={(e) => setPeriod({ ...period, sa: !period.sa })}>Sa</Button>
              </ButtonGroup>
            </div>

            <div className="pump__input">
              <label className="pump__label">
                Set the fertilizer dosage
              </label>
              <Input type="number" value={dose} onChange={(e) => setDose(Number(e.target.value))} />
            </div>


            <div className="pump__input">
              <label className="pump__label">
                Set the current volume in the container
              </label>
              <Input type="number" value={currentVolume} onChange={(e) => setCurrentVolume(Number(e.target.value))} />
            </div>
            <div className="pump__input">
              <label className="pump__label">
                Set the container volume
              </label>
              <Input type="number" value={maxVolume} onChange={(e) => setMaxVolume(Number(e.target.value))} />
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
    </div>
  );
};