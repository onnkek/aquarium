import React, { ChangeEvent, ChangeEventHandler, FormEvent, InputEvent, MouseEvent, ReactNode, useState } from "react"
import cls from "./ARGBWidget.module.sass"
import { useAppDispatch, useAppSelector } from "../../../models/Hook"
import { Toggle } from "components/Toggle"
import { Modal } from "components/Modal"
import { Button } from "components/Button"
import { ReactComponent as Spinner } from 'assets/icons/spinner.svg';
import { ReactComponent as ARGBIcon } from 'assets/icons/aquarium/argb.svg';
import { Status } from "models/Status"
import { Input } from "components/Input"
import { updateARGB, updateARGBState } from "../../../redux/AquariumSlice"
import { Dropdown } from "components/Dropdown"
import { hexToRgb, rgbToHex } from "helpers/colors"
import { WidgetWrapper } from "../WidgetWrapper"

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
    <WidgetWrapper color='rgb' onClickEdit={openModal}>
      <div className={cls.left}>
        <div className={cls.icon_wrapper}>
          <ARGBIcon className={cls.icon} />
        </div>

        <Toggle className={cls.toggle} size="XL" checked={argbCurrent.status} onClick={openApprove} />
      </div>
      <div className={cls.right}>
        <div>
          <div className={cls.text_wrapper}>
            <p className={cls.text_header}>On Time</p>
            <p className={cls.text}>{argb.on}</p>
          </div>
          <div className={cls.text_wrapper}>
            <p className={cls.text_header}>Off Time</p>
            <p className={cls.text}>{argb.off}</p>
          </div>
          <div className={cls.text_wrapper}>
            <p className={cls.text_header}>Mode</p>
            <p className={cls.text}>{argb.mode}</p>
          </div>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={closeModal} iconColor='green' bgWrapper='none' style='none'>
        <WidgetWrapper color='rgb' type='write' onClickEdit={closeModal} className={cls.wrapper}>
          <div className={cls.edit}>
            <div className={cls.right}>
              <ARGBIcon className={cls.edit_icon} />
              <div>
                <div className={cls.text_wrapper}>
                  <p className={cls.edit_text_header}>On Time</p>
                  <Input type="time" value={onTime} onChange={(e) => setOnTime(e.target.value)} />
                </div>
                <div className={cls.text_wrapper}>
                  <p className={cls.edit_text_header}>Off Time</p>
                  <Input type="time" value={offTime} onChange={(e) => setOffTime(e.target.value)} />
                </div>
                <div className={cls.text_wrapper}>
                  <p className={cls.edit_text_header}>
                    Mode
                  </p>
                  <Dropdown className={cls.dropdown} select={ARGBMode} items={[
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
              </div>
            </div>

            <div className={cls.text_wrapper}>
              <p className={cls.edit_text_header}>{ARGBMode} color settings</p>
              {ARGBMode === "Cycle" &&
                <div className={cls.grad_item}>
                  <p className={cls.grad_text}>
                    Set cycle speed
                  </p>
                  <Input type="number"
                    value={cycleSpeed}
                    onChange={(e) => setCycleSpeed(Number(e.target.value))}
                  />
                </div>}
              {ARGBMode === "Static" &&
                <div className={cls.custom}>
                  <p className={cls.grad_text}>
                    Color
                  </p>
                  <Input
                    type="color"
                    value={rgbToHex(staticColor.r, staticColor.g, staticColor.b)}
                    onChange={(e) => setStaticColor({ r: hexToRgb(e.target.value).r, g: hexToRgb(e.target.value).g, b: hexToRgb(e.target.value).b })}
                  />
                </div>}
              {ARGBMode === "Gradient" &&
                <div className={cls.custom}>
                  <div className={cls.grad_item}>
                    <p className={cls.grad_text}>
                      Start color
                    </p>
                    <Input
                      type="color"
                      value={rgbToHex(gradientStartColor.r, gradientStartColor.g, gradientStartColor.b)}
                      onChange={(e) => setGradientStartColor({ r: hexToRgb(e.target.value).r, g: hexToRgb(e.target.value).g, b: hexToRgb(e.target.value).b })}
                    />
                  </div>
                  <div className={cls.grad_item}>
                    <p className={cls.grad_text}>
                      End color
                    </p>
                    <Input
                      type="color"
                      value={rgbToHex(gradientEndColor.r, gradientEndColor.g, gradientEndColor.b)}
                      onChange={(e) => setGradientEndColor({ r: hexToRgb(e.target.value).r, g: hexToRgb(e.target.value).g, b: hexToRgb(e.target.value).b })}
                    />
                  </div>
                </div>
              }

              {ARGBMode === "Custom" &&
                <div className={cls.custom}>
                  {argb.custom.map((item, index) =>
                    <div className={cls.custom_color_item} key={index}>
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
                    <Spinner className={cls.spinner} />
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
              ARGB lighting will be {argbCurrent.status ? 'switched off' : 'switched on'}.
            </p>
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
                <Spinner className={cls.spinner} />
                Loading...
              </Button>
            </>
          )}
        </div>
      </Modal>
    </WidgetWrapper>
  )
}

export default ARGBWidget