import React, { useEffect } from "react"
import "./CalendarPage.sass"
import { useAppDispatch, useAppSelector } from "../../../models/Hook"
import { getSettings, IDate } from "../../../redux/SettingsSlice"
import { Status } from "../../../models/Status"
import CalendarWidget from "../../widgets/CalendarWidget/CalendarWidget"

const CalendarPage = () => {

  const dispatch = useAppDispatch()
  const status = useAppSelector(state => state.settings.status)

  const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  const currentMonth = new Date().getMonth() + 1
  const currentYear = new Date().getFullYear()

  const calendarContent = <>
    <CalendarWidget date={`${currentYear}-${currentMonth}-${1}`} id={Math.random()}/>
    {months.map(month =>
      <CalendarWidget
        date={`${currentYear + 1}-${month}-${1}`}
        key={Math.random()}
        id={Math.random()}
      />
    )}
  </>

  useEffect(() => {
    if (status === Status.Idle) {
      dispatch(getSettings())
    }
  }, [status, dispatch])
  return (
    <div className="app-container">
      <div className="container">
        <div className="grid-container">
          {calendarContent}
        </div>
      </div>
    </div >
  )
}
export default CalendarPage