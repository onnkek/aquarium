import React, { useState } from "react"
import "./CalendarWidget.sass"
import { getCalendarClasses, getDaysInMonth, getMonthName, getNumberOfEmpty } from "../../../utils/date"
import { useAppDispatch, useAppSelector } from "../../../models/Hook"
import { updateCalendarWidget } from "../../../redux/WidgetsSlice"
import { CaretLeftFill, CaretRightFill, CheckLg, GearFill } from "react-bootstrap-icons"

interface CalendarWidgetProps {
  date: string
  id: number
}

const CalendarWidget = React.memo(({ date, id }: CalendarWidgetProps) => {
  const dispatch = useAppDispatch()
  const [settings, setSettings] = useState(false)
  const [selectMonth, setSelectMonth] = useState(new Date(date).getMonth() + 1)
  const [selectYear, setSelectYear] = useState(new Date(date).getFullYear())
  const dateSettings = useAppSelector(state => state.settings.date)
  const edit = useAppSelector(state => state.widgets.edit)

  const editHandler = () => {
    setSettings(true)
  }
  const saveHandler = () => {
    dispatch(updateCalendarWidget({ widgetId: id, month: selectMonth, year: selectYear }))
    setSettings(false)
  }

  return (
    <div className="calendarWidget">
      {settings ? (
        <>

          <div className="calendarWidget__settings-header">
            <button onClick={() => setSelectYear(selectYear - 1)}><CaretLeftFill /></button>
            <div>{selectYear}</div>
            <button onClick={() => setSelectYear(selectYear + 1)}><CaretRightFill /></button>
          </div>
          <div className="calendarWidget__settings-body">
            <button
              className={`calendarWidget__settings-month ${selectMonth === 1 && "calendarWidget__settings-month_active"}`}
              onClick={() => setSelectMonth(1)}
            >Jan</button>
            <button
              className={`calendarWidget__settings-month ${selectMonth === 2 && "calendarWidget__settings-month_active"}`}
              onClick={() => setSelectMonth(2)}
            >Feb</button>
            <button
              className={`calendarWidget__settings-month ${selectMonth === 3 && "calendarWidget__settings-month_active"}`}
              onClick={() => setSelectMonth(3)}
            >Mar</button>
            <button
              className={`calendarWidget__settings-month ${selectMonth === 4 && "calendarWidget__settings-month_active"}`}
              onClick={() => setSelectMonth(4)}
            >Apr</button>
            <button
              className={`calendarWidget__settings-month ${selectMonth === 5 && "calendarWidget__settings-month_active"}`}
              onClick={() => setSelectMonth(5)}
            >May</button>
            <button
              className={`calendarWidget__settings-month ${selectMonth === 6 && "calendarWidget__settings-month_active"}`}
              onClick={() => setSelectMonth(6)}
            >Jun</button>
            <button
              className={`calendarWidget__settings-month ${selectMonth === 7 && "calendarWidget__settings-month_active"}`}
              onClick={() => setSelectMonth(7)}
            >Jul</button>
            <button
              className={`calendarWidget__settings-month ${selectMonth === 8 && "calendarWidget__settings-month_active"}`}
              onClick={() => setSelectMonth(8)}
            >Aug</button>
            <button
              className={`calendarWidget__settings-month ${selectMonth === 9 && "calendarWidget__settings-month_active"}`}
              onClick={() => setSelectMonth(9)}
            >Sep</button>
            <button
              className={`calendarWidget__settings-month ${selectMonth === 10 && "calendarWidget__settings-month_active"}`}
              onClick={() => setSelectMonth(10)

              }>Oct</button>
            <button
              className={`calendarWidget__settings-month ${selectMonth === 11 && "calendarWidget__settings-month_active"}`}
              onClick={() => setSelectMonth(11)

              }>Nov</button>
            <button
              className={`calendarWidget__settings-month ${selectMonth === 12 && "calendarWidget__settings-month_active"}`}
              onClick={() => setSelectMonth(12)

              }>Dec</button>
          </div>
          {edit && <button className="widget__settings" onClick={saveHandler}><CheckLg /></button>}
        </>
      ) : (
        <>
          <div className="calendarWidget__header">{getMonthName(selectMonth)}</div>
          <div className="calendarWidget__grid">
            {getNumberOfEmpty(selectMonth, selectYear)! > 0 ? (new Array(getNumberOfEmpty(selectMonth, selectYear))).fill(1).map(x => <div key={Math.random()} />) : <></>}
            {new Array(getDaysInMonth(selectYear, selectMonth)).fill(1).map((e, i) => i + 1).map(day => <div className={`${getCalendarClasses(dateSettings, `${selectYear}-${selectMonth}-${day}`)}`} key={Math.random()}><div>{day}</div></div>)}
          </div>
          {edit && <button className="widget__settings" onClick={editHandler}><GearFill /></button>}
        </>
      )}
    </div>
  )
})

export default CalendarWidget