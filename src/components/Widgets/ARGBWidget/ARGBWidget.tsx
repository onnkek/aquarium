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
import { getCurrentInfo, switchModal, updateARGB } from "../../../redux/AquariumSlice"
import { Dropdown } from "components/Dropdown"
import { hexToRgb, rgbToHex } from "helpers/colors"
import { WidgetWrapper } from "../WidgetWrapper"
import { getStringARGBMode } from "helpers/period"

interface ARGBWidgetProps {
  prop?: string
}

const ARGBWidget = ({ prop }: ARGBWidgetProps) => {
  const dispatch = useAppDispatch()
  const [showModal, setShowModal] = useState(false)
  const argb = useAppSelector(state => state.aquarium.config.argb)
  const argbCurrent = useAppSelector(state => state.aquarium.currentInfo.argb)
  const status = useAppSelector(state => state.aquarium.status)
  const [onTime, setOnTime] = useState(argb.on)
  const [offTime, setOffTime] = useState(argb.off)
  const [ARGBMode, setARGBMode] = useState(argb.mode)

  const [cycleSpeed, setCycleSpeed] = useState(argb.cycle.speed)
  const [brightness, setBrightness] = useState(argb.brightness)
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
    dispatch(switchModal(true));
    setARGBMode(argb.mode)
    setStaticColor(argb.static)
    setGradientStartColor(argb.gradient.start)
    setGradientEndColor(argb.gradient.end)
    setCustomColor(argb.custom)
    setCycleSpeed(argb.cycle.speed)
    setBrightness(argb.brightness)
    setOnTime(argb.on)
    setOffTime(argb.off)

    setShowModal(true);
  }
  const closeModal = () => {
    dispatch(switchModal(false));
    setShowModal(false);
  }

  const sendConfig = async () => {
    await dispatch(updateARGB({
      on: onTime,
      off: offTime,
      mode: ARGBMode,
      brightness: brightness,
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
      setBrightness(argb.brightness)
      dispatch(getCurrentInfo())
      closeModal()
    }
  }
  // const sendARGBState = async () => {
  //   // await dispatch(updateARGBState(!argbCurrent.status))
  //   if (status === Status.Succeeded) {

  //   }
  // }
  return (
    <WidgetWrapper color='rgb' onClickEdit={openModal} className={cls.widget_wrapper} state={argbCurrent.status > 0}>
      <div className={cls.left}>
        <div className={cls.icon_wrapper}>
          <ARGBIcon className={cls.icon} />
        </div>
      </div>
      <div className={cls.right}>
        <div>
          <div className={cls.text_wrapper}>
            <p className={cls.text_header}>Mode</p>
            <p className={cls.text}>{getStringARGBMode(argb.mode)}</p>
          </div>
          {argb.mode !== 0 && <div className={cls.text_wrapper}>
            <p className={cls.text_header}>On Time</p>
            <p className={cls.text}>{argb.on}</p>
          </div>}
          {argb.mode !== 0 && <div className={cls.text_wrapper}>
            <p className={cls.text_header}>Off Time</p>
            <p className={cls.text}>{argb.off}</p>
          </div>}
        </div>
      </div>

      <Modal isOpen={showModal} onClose={closeModal} iconColor='green' bgWrapper='none' style='none'>
        <WidgetWrapper color='rgb' type='write' onClickEdit={closeModal} className={cls.wrapper} state={argbCurrent.status > 0}>
          <div className={cls.edit}>
            <div className={cls.edit_right}>
              <div className={cls.edit_header}>
                <ARGBIcon className={cls.edit_icon} />
                <div className={cls.edit_header_text}>ARGB settings</div>
              </div>
              <div className={cls.edit_wrapper}>
                <div className={cls.edit_group_dropdown}>
                  <div className={cls.edit_text_wrapper}>
                    <p className={cls.edit_text_header}>
                      Mode
                    </p>
                    <Dropdown className={cls.dropdown} select={getStringARGBMode(ARGBMode)} items={[
                      [{
                        content: 'Off',
                        onClick: () => setARGBMode(0)
                      },
                      {
                        content: 'Static',
                        onClick: () => setARGBMode(1)
                      },
                      {
                        content: 'Cycle',
                        onClick: () => setARGBMode(2)
                      },
                      {
                        content: 'Gradient',
                        onClick: () => setARGBMode(3)
                      },
                      {
                        content: 'Custom',
                        onClick: () => setARGBMode(4)
                      }]
                    ]} />
                  </div>
                  {ARGBMode !== 0 &&
                    <div className={cls.edit_text_wrapper}>
                      <p className={cls.edit_text_header}>Brightness</p>
                      <Input type="number" value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} />
                    </div>}
                </div>

                <div className={cls.edit_group}>
                  {ARGBMode != 0 && <div className={cls.edit_text_wrapper}>
                    <p className={cls.edit_text_header}>On Time</p>
                    <Input type="time" value={onTime} onChange={(e) => setOnTime(e.target.value)} />
                  </div>}
                  {ARGBMode != 0 && <div className={cls.edit_text_wrapper}>
                    <p className={cls.edit_text_header}>Off Time</p>
                    <Input type="time" value={offTime} onChange={(e) => setOffTime(e.target.value)} />
                  </div>}
                </div>

                {ARGBMode === 1 &&
                  <div className={cls.edit_text_wrapper_last}>
                    <p className={cls.edit_text_header}>Color</p>
                    <Input
                      type="color"
                      value={rgbToHex(staticColor.r, staticColor.g, staticColor.b)}
                      onChange={(e) => setStaticColor({ r: hexToRgb(e.target.value).r, g: hexToRgb(e.target.value).g, b: hexToRgb(e.target.value).b })}
                    />
                  </div>
                }
                {ARGBMode === 2 &&
                  <div className={cls.edit_text_wrapper_last}>
                    <p className={cls.edit_text_header}>Cycle speed</p>
                    <Input type="number"
                      value={cycleSpeed}
                      onChange={(e) => setCycleSpeed(Number(e.target.value))}
                    />
                  </div>
                }
                {ARGBMode === 3 &&
                  <div className={cls.edit_group}>
                    <div className={cls.edit_text_wrapper}>
                      <p className={cls.edit_text_header}>Start color</p>
                      <Input
                        type="color"
                        value={rgbToHex(gradientStartColor.r, gradientStartColor.g, gradientStartColor.b)}
                        onChange={(e) => setGradientStartColor({ r: hexToRgb(e.target.value).r, g: hexToRgb(e.target.value).g, b: hexToRgb(e.target.value).b })}
                      />
                    </div>
                    <div className={cls.edit_text_wrapper}>
                      <p className={cls.edit_text_header}>End color</p>
                      <Input
                        type="color"
                        value={rgbToHex(gradientEndColor.r, gradientEndColor.g, gradientEndColor.b)}
                        onChange={(e) => setGradientEndColor({ r: hexToRgb(e.target.value).r, g: hexToRgb(e.target.value).g, b: hexToRgb(e.target.value).b })}
                      />
                    </div>
                  </div>
                }

                {ARGBMode === 4 &&
                  <div className={cls.edit_text_wrapper_custom}>
                    <p className={cls.edit_text_header}>Colors</p>
                    <div className={cls.custom_color}>
                      {argb.custom.map((item, index) =>
                        <div className={cls.custom_color_item} key={index}>
                          <Input
                            type="color"
                            value={rgbToHex(argb.custom[index].r, argb.custom[index].g, argb.custom[index].b)}
                            onChange={(e) => changeCustomColorHandler(e, index)}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                }

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
                    <Spinner className={cls.spinner} />
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

export default ARGBWidget