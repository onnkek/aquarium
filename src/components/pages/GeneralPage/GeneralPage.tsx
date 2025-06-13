import React, { MouseEvent, useEffect, useState } from "react"
import "./GeneralPage.sass"
import CalendarWidget from "../../widgets/CalendarWidget/CalendarWidget"
import ClockWidget from "../../widgets/ClockWidget/ClockWidget"
import NewYearWidget from "../../widgets/NewYearWidget/NewYearWidget"
import TasksWidget from "../../widgets/TasksWidget/TasksWidget"
import WeatherWidget from "../../widgets/WeatherWidget/WeatherWidget"
import { useAppDispatch, useAppSelector } from "../../../models/Hook"
import { Status } from "../../../models/Status"
import { getSettings } from "../../../redux/SettingsSlice"
import { getWeather } from "../../../redux/WeatherSlice"
import VacationWidget from "../../widgets/VacationWidget/VacationWidget"
import WidgetWrapper from "../../widgets/WidgetWrapper/WidgetWrapper"
import { addWidget, getWidgets, IWidget, setSelect, setWidgetPosition, toggleAdd, toggleEdit, updateWidgets } from "../../../redux/WidgetsSlice"

const GeneralPage = () => {

  const dispatch = useAppDispatch()
  const widgets = useAppSelector(state => state.widgets)
  const status = useAppSelector(state => state.settings.status)
  const select = useAppSelector(state => state.widgets.select)
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (status === Status.Idle) {
      dispatch(getSettings())
      // dispatch(getWeather())
      dispatch(getWidgets())
    }
    // for (let i = 0; i < 1000; i++) {

    //   fetch('http://gutindm.oduur.so:8080/elementState/changeState?id=vshb4', { credentials: 'include', method: "POST", body: "ПРИВЕТ ДИМОЧКА!" })
    //     .then(response => response.json())
    //     .then(response => console.log(response))
    //   console.log("SEND")
    // }
  }, [status, dispatch])

  const mouseUpHandler = (e: MouseEvent<HTMLDivElement>) => {
    dispatch(setSelect(undefined))
  }
  const mouseMoveHandler = (e: MouseEvent<HTMLDivElement>) => {
    const cursor = { x: e.clientX, y: e.clientY }

    if (select) {

      const step = 10
      const gridCursor = { x: Math.round(cursor.x / step) * step, y: Math.round(cursor.y / step) * step }
      const gridLastCursor = { x: Math.round(lastPosition.x / step) * step, y: Math.round(lastPosition.y / step) * step }
      const delta = { x: gridLastCursor.x - gridCursor.x, y: gridLastCursor.y - gridCursor.y }
      const widget = widgets.widgets.find(x => x.id === select.id)
      const newPosition = { x: widget!.position.x - delta.x, y: widget!.position.y - delta.y }
      // console.log(`DISPATCH ${newPosition.x}:${newPosition.y}`)
      dispatch(setWidgetPosition(newPosition))

    }
    setLastPosition(cursor)
  }

  const saveHandler = () => {
    dispatch(updateWidgets(1))
    dispatch(toggleEdit())

  }
  const editHandler = () => {
    dispatch(toggleEdit())
  }
  const showAddHandler = () => {
    dispatch(toggleAdd())
  }

  const addWidgetHandler = (type: string) => {
    dispatch(addWidget(type))
  }

  const renderWidget = (widget: IWidget) => {
    switch (widget.type) {
      case "CalendarWidget":
        return <CalendarWidget date={`${widget.year}-${widget.month}-${1}`} id={widget.id} />
      case "ClockWidget":
        return <ClockWidget widget={widget} />
      case "NewYearWidget":
        return <NewYearWidget />
      case "VacationWidget":
        return <VacationWidget />
      case "TasksWidget":
        return <TasksWidget />
      case "WeatherWidget":
        return <WeatherWidget widget={widget} />
      default:
        return <></>

    }
  }

  const widgetsContent = widgets.widgets.map(widget =>
    <WidgetWrapper widget={widget} key={widget.id} >
      {renderWidget(widget)}
    </WidgetWrapper>
  )
  // console.log(widgets)
  return (
    <div
      className="general-page"
      onMouseUp={mouseUpHandler}
      onMouseMove={mouseMoveHandler}
    >
      {widgetsContent}
      {widgets.add && widgets.edit &&
        <div className="general-page__widgets">
          <div className="general-page__widgets-item" onClick={() => addWidgetHandler("CalendarWidget")}>
            <CalendarWidget date={new Date().toDateString()} id={Math.random()} />
          </div>
          <div className="general-page__widgets-item" onClick={() => addWidgetHandler("ClockWidget")}>
            <ClockWidget widget={undefined} />
          </div>
          <div className="general-page__widgets-item" onClick={() => addWidgetHandler("NewYearWidget")}>
            <NewYearWidget />
          </div>
          <div className="general-page__widgets-item" onClick={() => addWidgetHandler("VacationWidget")}>
            <VacationWidget />
          </div>
          <div className="general-page__widgets-item" onClick={() => addWidgetHandler("TasksWidget")}>
            <TasksWidget />
          </div>
          <div className="general-page__widgets-item" onClick={() => addWidgetHandler("WeatherWidget")}>
            <WeatherWidget widget={undefined} />
          </div>
        </div>
      }
      <div className="general-page__edit">

        {widgets.edit ? (
          <div>
            <button className="general-page__edit-btn" onClick={saveHandler}>Save</button>
            {widgets.add ? (
              <button className="general-page__add-btn" onClick={showAddHandler}>x</button>
            ) : (
              <button className="general-page__add-btn" onClick={showAddHandler}>+</button>
            )}
          </div>
        ) : (
          <div>
            <button className="general-page__edit-btn" onClick={editHandler}>Edit mode</button>
          </div>
        )}
      </div>

    </div >
  )
}
export default GeneralPage