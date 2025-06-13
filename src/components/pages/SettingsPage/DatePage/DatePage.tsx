import React, { ChangeEvent, useEffect, useState } from "react"
import "./DatePage.sass"
import SettingsHeader from "../SettingsHeader/SettingsHeader"
import { Plus, PlusLg, Trash } from "react-bootstrap-icons"
import { useAppDispatch, useAppSelector } from "../../../../models/Hook"
import { addHoliday, addVacation, addWorking, changeWeekend, getSettings, removeHoliday, removeVacation, removeWorking } from "../../../../redux/SettingsSlice"
import { Status } from "../../../../models/Status"

const DatePage = () => {
  const dispatch = useAppDispatch()
  const status = useAppSelector(state => state.settings.status)
  const holidays = useAppSelector(state => state.settings.date.holidays)
  const vacations = useAppSelector(state => state.settings.date.vacations)
  const workings = useAppSelector(state => state.settings.date.workings)
  const weekend = useAppSelector(state => state.settings.date.weekend)
  const [vacationStart, setVacationStart] = useState("")
  const [vacationEnd, setVacationEnd] = useState("")
  const [holiday, setHoliday] = useState("")
  const [working, setWorking] = useState("")

  const hlWeekendChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(changeWeekend({ highlight: !weekend.highlight }))
  }

  const addHolidayHandler = () => {
    dispatch(addHoliday(holiday))
  }
  const removeHolidayHandler = (id: number) => {
    dispatch(removeHoliday({ day: holiday, id: id }))
  }

  const holidayChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setHoliday(e.target.value)
  }

  const addWorkingHandler = () => {
    dispatch(addWorking(working))
  }
  const removeWorkingHandler = (id: number) => {
    dispatch(removeWorking({ day: holiday, id: id }))
  }

  const workingChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setWorking(e.target.value)
  }

  const addVacationHandler = () => {
    dispatch(addVacation({ start: vacationStart, end: vacationEnd }))
  }
  const removeVacationHandler = (id: number) => {
    dispatch(removeVacation({ id: id, start: vacationStart, end: vacationEnd }))
  }

  const vacationStartChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setVacationStart(e.target.value)
  }
  const vacationEndChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setVacationEnd(e.target.value)
  }


  const holidayContent = holidays.map(day =>
    <div className="input-group mt-2" key={day.id}>
      <input
        type="date"
        name="deadline"
        className="add-form-date"
        value={day.day}
        readOnly
        disabled
      />
      <button type="submit" className="btn btn-primary"
        onClick={() => removeHolidayHandler(day.id)}
      >
        <Trash />
      </button>
    </div>
  )

  const workingContent = workings.map(day =>
    <div className="input-group mt-2" key={day.id}>
      <input
        type="date"
        name="deadline"
        className="add-form-date"
        value={day.day}
        readOnly
        disabled
      />
      <button type="submit" className="btn btn-primary"
        onClick={() => removeWorkingHandler(day.id)}
      >
        <Trash />
      </button>
    </div>
  )

  const vacationContent = vacations.map(vacation =>
    <div className="input-group mt-2" key={vacation.id}>
      <span className="noti-options-label input-group-text">From</span>
      <input
        type="date"
        name="deadline"
        className="add-form-date"
        value={vacation.start}
        readOnly
        disabled
      />
      <span className="noti-options-label input-group-text">To</span>
      <input
        type="date"
        name="deadline"
        className="add-form-date"
        value={vacation.end}
        readOnly
        disabled
      />
      <button type="submit" className="btn btn-primary"
        onClick={() => removeVacationHandler(vacation.id)}
      >
        <Trash />
      </button>
    </div>
  )

  useEffect(() => {
    if (status === Status.Idle) {
      dispatch(getSettings())
    }
  }, [status, dispatch])

  return (
    <div className="settings-item">
      <SettingsHeader title='Date preferences' />
      <div className="noti-wrapper">


        <div className="settings-data-item">
          <h3 className="settings-date-header">Weekend</h3>
          <div className="settings-date-body">

            <div className="settings-date-prop">
              <input
                className="checkbox form-check-input mt-0 settings-date-checkbox"
                type="checkbox"
                checked={weekend.highlight}
                value=""
                aria-label="Checkbox for following text input"
                onChange={hlWeekendChangeHandler}
              />
              <span className="noti-options-label">Highlight weekends</span>
            </div>
          </div>


        </div>

        <div className="settings-data-item">
          <h3 className="settings-date-header">Exceptional working days</h3>
          <div className="settings-date-body">
            <div className="noti-options">
              <label className="profile-form-group-label form-label">
                Create new exceptional working day
              </label>
              <div className="input-group">
                <input
                  type="date"
                  name="deadline"
                  className="form-control add-form-date"
                  value={working}
                  onChange={workingChangeHandler}
                />

                <button type="submit" className="btn btn-primary"
                  onClick={addWorkingHandler}
                >
                  <PlusLg />
                </button>
              </div>
            </div>
            <div className="noti-options">
              <label className="profile-form-group-label form-label m-0 mt-3">
                Available exceptional working days
              </label>
              {workingContent.length ? workingContent : <div className="profile-from-group-descr">There are no work on rest days</div>}
            </div>
          </div>


        </div>


        <div className="settings-data-item">
          <h3 className="settings-date-header">Vacation periods</h3>
          <div className="settings-date-body">
            <div className="noti-options">
              <label className="profile-form-group-label form-label">
                Create new vacation period
              </label>
              <div className="input-group">
                <span className="noti-options-label input-group-text">From</span>
                <input
                  type="date"
                  name="deadline"
                  className="form-control add-form-date"
                  value={vacationStart}
                  onChange={vacationStartChangeHandler}
                />
                <span className="noti-options-label input-group-text">To</span>
                <input
                  type="date"
                  name="deadline"
                  className="form-control add-form-date"
                  value={vacationEnd}
                  onChange={vacationEndChangeHandler}
                />
                <button type="submit" className="btn btn-primary"
                  onClick={addVacationHandler}
                >
                  <PlusLg />
                </button>
              </div>
            </div>
            <div className="noti-options">
              <label className="profile-form-group-label mt-3">
                Available vacation periods
              </label>
              {vacationContent.length ? vacationContent : <div className="profile-from-group-descr">There are no vacation periods</div>}
            </div>
          </div>

        </div>
        <div className="settings-data-item">
          <h3 className="settings-date-header">Holidays</h3>
          <div className="settings-date-body">
            <div className="noti-options">
              <label className="profile-form-group-label form-label">
                Create new holiday day
              </label>
              <div className="input-group">
                <input
                  type="date"
                  name="deadline"
                  className="form-control add-form-date"
                  value={holiday}
                  onChange={holidayChangeHandler}
                />

                <button type="submit" className="btn btn-primary"
                  onClick={addHolidayHandler}
                >
                  <PlusLg />
                </button>
              </div>
            </div>
            <div className="noti-options">
              <label className="profile-form-group-label form-label m-0 mt-3">
                Available holiday days
              </label>
              {holidayContent.length ? holidayContent : <div className="profile-from-group-descr">There are no holidays</div>}
            </div>
          </div>


        </div>
      </div>
    </div>
  )
}

export default DatePage
