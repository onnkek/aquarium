import React, { ChangeEvent, ChangeEventHandler, FormEvent, InputEvent, MouseEvent, ReactNode, useState } from "react"
import "./ARGBWidget.sass"
import { useAppDispatch, useAppSelector } from "../../../models/Hook"
import argbIcon from '../../../assets/icons/aquarium/argb.svg'
import gearIcon from '../../../assets/icons/gear.svg'
import { Toggle } from "components/Toggle"
import { Modal } from "components/Modal"
import { Button } from "components/Button"
import { ReactComponent as Spinner } from 'assets/icons/spinner.svg';
import { Status } from "models/Status"
import { Input } from "components/Input"
import { updateARGB, updateARGBState } from "../../../redux/AquariumSlice"
import { Dropdown } from "components/Dropdown"
import { hexToRgb, rgbToHex } from "helpers/colors"

interface ARGBWidgetProps {
  prop?: string
}

const ARGBWidget = ({ prop }: ARGBWidgetProps) => {
  const dispatch = useAppDispatch()
  const [showModal, setShowModal] = useState(false)
  const [showApprove, setShowApprove] = useState(false)
  const argb = useAppSelector(state => state.aquarium.config.argb)
  const argbCurrent = useAppSelector(state => state.aquarium.currentInfo.argb)
  const status = useAppSelector(state => state.aquarium.status)
  const [onTime, setOnTime] = useState(argb.on)
  const [offTime, setOffTime] = useState(argb.off)
  const [ARGBMode, setARGBMode] = useState(argb.mode)

  const [cycleSpeed, setCycleSpeed] = useState(argb.cycle.speed)
  const [staticColor, setStaticColor] = useState(argb.static)
  const [gradientStartColor, setGradientStartColor] = useState(argb.gradient.start)
  const [gradientEndColor, setGradientEndColor] = useState(argb.gradient.end)
  const [customColor, setCustomColor] = useState(argb.custom)

  const changeCustomColorHandler = (event: ChangeEvent<HTMLInputElement>, index: number) => {
    const newColor = hexToRgb(event.target.value)
    const newColors = [...customColor]
    newColors[index] = { ...customColor[index] }
    newColors[index] = {
      r: newColor.r,
      g: newColor.g,
      b: newColor.b
    }
    setCustomColor(newColors)
  }
  const openModal = () => {
    setARGBMode(argb.mode)
    setStaticColor(argb.static)
    setGradientStartColor(argb.gradient.start)
    setGradientEndColor(argb.gradient.end)
    setCustomColor(argb.custom)
    setCycleSpeed(argb.cycle.speed)
    setOnTime(argb.on)
    setOffTime(argb.off)

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
    await dispatch(updateARGB({
      on: onTime,
      off: offTime,
      mode: ARGBMode,
      static: staticColor,
      gradient: {
        start: gradientStartColor,
        end: gradientEndColor
      },
      custom: customColor,
      cycle: {
        speed: cycleSpeed
      }
    }))
    if (status === Status.Succeeded) {
      setARGBMode(argb.mode)
      setOnTime(argb.on)
      setOffTime(argb.off)
      setStaticColor(argb.static)
      setGradientStartColor(argb.gradient.start)
      setGradientEndColor(argb.gradient.end)
      setCustomColor(argb.custom)
      setCycleSpeed(argb.cycle.speed)

      closeModal()
    }
  }
  const sendARGBState = async () => {
    await dispatch(updateARGBState(!argbCurrent.status))
    if (status === Status.Succeeded) {
      closeApprove()
    }
  }
  return (
    <div className="argb">
      <div className="argb__blur" />
      <div className="argb__rect" />
      <div className="argb__left">
        <img className="argb__icon" src={argbIcon} />
        <Toggle size="XL" checked={argbCurrent.status} onClick={openApprove} />
      </div>
      <div className="argb__right">
        <div className="argb__body-right">
          <div className="argb__text-container">
            <p className="argb__text-tag">On Time</p>
            <p className="argb__text">{argb.on}</p>
          </div>
          <div className="argb__text-container">
            <p className="argb__text-tag">Off Time</p>
            <p className="argb__text">{argb.off}</p>
          </div>
          <div className="argb__text-container">
            <p className="argb__text-tag">Mode</p>
            <p className="argb__text">{argb.mode}</p>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="argb__edit-btn"
        onClick={openModal}
      >
        <img className="argb__edit-btn-icon" src={gearIcon}></img>
      </button>
      <Modal isOpen={showApprove} onClose={closeApprove} iconColor='green' bgWrapper='none'>
        <div className="argb__form">
          <div className="argb__input">
            <label className="argb__label">
              This will lead to ARGB shutdown. Do you agree?
            </label>
          </div>
        </div>
        <div style={{ display: 'flex', marginTop: '32px', justifyContent: 'space-between' }}>
          {status !== Status.Loading ? (
            <>
              <Button width='170px' size='L' theme='outline' onClick={closeApprove}>Cancel</Button>
              <Button width='170px' size='L' onClick={sendARGBState}>Agree</Button>
            </>
          ) : (
            <>
              <Button width='170px' size='L' theme='outline' onClick={closeApprove} disabled>Cancel</Button>
              <Button width='170px' size='L' onClick={sendARGBState} disabled>
                <Spinner />
                Loading...
              </Button>
            </>
          )}
        </div>
      </Modal>
      <Modal isOpen={showModal} onClose={closeModal} iconColor='green' bgWrapper='none'>
        <div className="argb__form">
          <div className="argb__input">
            <label className="argb__label">
              Set on time
            </label>
            <Input type="time" value={onTime} onChange={(e) => setOnTime(e.target.value)} />
          </div>
          <div className="argb__input">
            <label className="argb__label">
              Set off time
            </label>
            <Input type="time" value={offTime} onChange={(e) => setOffTime(e.target.value)} />
          </div>
        </div>
        <div className="argb__form argb__form_color">
          <div>

            <div className="argb__input_color">
              <label className="argb__label">
                Mode
              </label>
              <Dropdown select={ARGBMode} items={[
                [{
                  content: 'Static',
                  onClick: () => setARGBMode("Static")
                },
                {
                  content: 'Gradient',
                  onClick: () => setARGBMode("Gradient")
                },
                {
                  content: 'Cycle',
                  onClick: () => setARGBMode("Cycle")
                },
                {
                  content: 'Custom',
                  onClick: () => setARGBMode("Custom")
                }]
              ]} />
            </div>

            {ARGBMode === "Cycle" &&
              <div className="argb__input ">
                <label className="argb__label argb__custom-color-item">
                  Set cycle speed
                </label>
                <Input type="number"
                  value={cycleSpeed}
                  onChange={(e) => setCycleSpeed(Number(e.target.value))}
                />
              </div>}
            {ARGBMode === "Static" &&
              <div className="argb__input argb__custom-color-item">
                <label className="argb__label">
                  Color
                </label>
                <Input
                  type="color"
                  value={rgbToHex(staticColor.r, staticColor.g, staticColor.b)}
                  onChange={(e) => setStaticColor({ r: hexToRgb(e.target.value).r, g: hexToRgb(e.target.value).g, b: hexToRgb(e.target.value).b })}
                />
              </div>}
            {ARGBMode === "Gradient" &&
              <div className="argb__form argb__custom-color-item">
                <div className="argb__input">
                  <label className="argb__label">
                    Start color
                  </label>
                  <Input
                    type="color"
                    value={rgbToHex(gradientStartColor.r, gradientStartColor.g, gradientStartColor.b)}
                    onChange={(e) => setGradientStartColor({ r: hexToRgb(e.target.value).r, g: hexToRgb(e.target.value).g, b: hexToRgb(e.target.value).b })}
                  />
                </div>
                <div className="argb__input">
                  <label className="argb__label">
                    End color
                  </label>
                  <Input
                    type="color"
                    value={rgbToHex(gradientEndColor.r, gradientEndColor.g, gradientEndColor.b)}
                    onChange={(e) => setGradientEndColor({ r: hexToRgb(e.target.value).r, g: hexToRgb(e.target.value).g, b: hexToRgb(e.target.value).b })}
                  />
                </div>
              </div>
            }

            {ARGBMode === "Custom" &&

              <div className="argb__custom-color">
                {argb.custom.map((item, index) =>
                  <div className="argb__custom-color-item" key={index}>
                    <Input
                      type="color"
                      value={rgbToHex(customColor[index].r, customColor[index].g, customColor[index].b)}
                      onChange={(e) => changeCustomColorHandler(e, index)}
                    />
                  </div>

                )}
              </div>

            }


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
  )
}

export default ARGBWidget