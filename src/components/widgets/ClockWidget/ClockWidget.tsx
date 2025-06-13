import React, { ChangeEvent, useEffect, useState } from "react"
import "./ClockWidget.sass"
import { useAppDispatch, useAppSelector } from "../../../models/Hook"
import { CheckLg, GearFill } from "react-bootstrap-icons"
import { IWidget, updateClockWidget } from "../../../redux/WidgetsSlice"

interface TextType {
  number: number
  x: number
  y: number
}

interface ITime {
  hours: number
  minutes: number
  seconds: number
}

interface ClockWidgetProps {
  widget: IWidget | undefined
}

const getTimeZoneString = (timeZone: number): string => {

  return timeZone >= 0 ? `GMT+${timeZone}` : `GMT${timeZone}`

}

const ClockWidget = React.memo(({ widget }: ClockWidgetProps) => {
  console.log(new Date().getTimezoneOffset())
  const dispatch = useAppDispatch()
  const [settings, setSettings] = useState(false)
  const [offset, setOffset] = useState(widget?.offset)
  // const dateSettings = useAppSelector(state => state.settings.date)
  const edit = useAppSelector(state => state.widgets.edit)
  const [hours, setHours] = useState(offset! ? new Date().getHours() + offset : new Date().getHours())

  const startX = 150;
  const startY = 150;
  const [timer, setTimer] = useState(0)
  // const [hourPosition, setHourPosition] = useState({ x: startX, y: startY })
  // const [minutePosition, setMinutePosition] = useState({ x: startX, y: startY })
  // const [secondPosition, setSecondPosition] = useState({ x: startX, y: startY })
  let hourPosition = { x: startX, y: startY }
  let minutePosition = { x: startX, y: startY }
  let secondPosition = { x: startX, y: startY }

  const timeZone = offset! ? -new Date().getTimezoneOffset() / 60 + offset : -new Date().getTimezoneOffset() / 60

  const x = 80;
  const y = 80;

  const lenHour = 90;
  const lenMin = 130;
  const lenSec = 150;
  const texts: TextType[] = []
  let ang = (-135 / 180) * Math.PI;
  for (let i = 1; i <= 12; i++) {
    ang += (30 / 180) * Math.PI;
    let newX = 0
    let newY = 0
    if (i < 10) {
      newX = x * Math.cos(ang) - y * Math.sin(ang) + startX - 7
      newY = x * Math.sin(ang) + y * Math.cos(ang) + startY + 7
    } else {
      newX = x * Math.cos(ang) - y * Math.sin(ang) + startX - 14
      newY = x * Math.sin(ang) + y * Math.cos(ang) + startY + 14
    }
    texts.push({ number: i, x: newX, y: newY })
  }

  useEffect(() => {
    setTimeout(() => {
      setTimer(timer + 1)
    }, 1000)
  }, [timer])

  // useEffect(() => {
  const time = new Date()
  let sah = 0;
  // const time = new Date();
  if (hours > 12) {
    sah =
      ((-90 +
        (hours - 12) * 30 +
        (time.getMinutes() * 30) / 60 +
        (time.getSeconds() * 30) / 3600) /
        180) *
      Math.PI;
  } else {
    sah =
      ((-90 +
        hours * 30 +
        (time.getMinutes() * 30) / 60 +
        (time.getSeconds() * 30) / 3600) /
        180) *
      Math.PI;
  }
  let sam =
    ((-90 + time.getMinutes() * 6 + (time.getSeconds() * 6) / 60) / 180) *
    Math.PI;
  let sas = ((-90 + time.getSeconds() * 6) / 180) * Math.PI;
  const xh = startX + lenHour - 5 - startX;
  const yh = startY - startY;
  const xm = startX + lenMin - 5 - startX;
  const ym = startY - startY;
  const xs = startX + lenSec - 10 - startX;
  const ys = startY - startY;

  const dxh = (6 / 3600 / 180) * Math.PI;
  const dxm = (6 / 60 / 180) * Math.PI;
  const dxs = (6 / 180) * Math.PI;

  sah += dxh;
  sam += dxm;
  sas += dxs;

  hourPosition = {
    x: xh * Math.cos(sah) - yh * Math.sin(sah) + startX,
    y: xh * Math.sin(sah) + yh * Math.cos(sah) + startY
  }
  minutePosition = {
    x: xm * Math.cos(sam) - ym * Math.sin(sam) + startX,
    y: xm * Math.sin(sam) + ym * Math.cos(sam) + startY
  }
  secondPosition = {
    x: xs * Math.cos(sas) - ys * Math.sin(sas) + startX,
    y: xs * Math.sin(sas) + ys * Math.cos(sas) + startY
  }




  const editHandler = () => {
    setSettings(true)
  }
  const saveHandler = () => {
    dispatch(updateClockWidget({ widgetId: widget!.id, offset: Number(offset) }))
    setHours(new Date().getHours() + offset!)
    console.log(hours)
    setSettings(false)

  }

  const changeOffsetHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setOffset(Number(e.target.value))
  }

  return (
    <div className="clockWidget">
      {settings ? (
        <>
          <div>
            <label className="form-label">
              City name
            </label>
            <input
              type="number"
              name="link"
              className="form-control add-form-date"
              value={offset}
              onChange={changeOffsetHandler}
            />
          </div>
          {edit && <button className="widget__settings" onClick={saveHandler}><CheckLg /></button>}
        </>
      ) : (
        <>
          <svg width={300} height={300}>
            {texts.map(text => <text fill="white" key={text.number} x={text.x} y={text.y} >{text.number}</text>)}
            <text x={125} y={210} style={{ fontSize: "16px" }} fill="gray">{getTimeZoneString(timeZone)}</text>
            <line x1={startX} y1={startY} x2={hourPosition.x} y2={hourPosition.y} stroke="white" strokeWidth={4}></line>
            <line x1={startX} y1={startY} x2={minutePosition.x} y2={minutePosition.y} stroke="white" strokeWidth={2}></line>
            <line x1={startX} y1={startY} x2={secondPosition.x} y2={secondPosition.y} stroke="red" strokeWidth={1}></line>
            <circle cx={startX} cy={startY} r="140" stroke="#475569" strokeWidth="5" fill="none"></circle>
            <circle cx={startX} cy={startY} r="2" stroke="white" fill="white" strokeWidth="5" ></circle>
          </svg>
          {edit && <button className="widget__settings" onClick={editHandler}><GearFill /></button>}
        </>
      )
      }
    </div >
  )
})

export default ClockWidget