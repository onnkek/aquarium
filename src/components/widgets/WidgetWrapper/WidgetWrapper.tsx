import React, { MouseEvent, ReactNode } from "react"
import "./WidgetWrapper.sass"
import { useAppDispatch, useAppSelector } from "../../../models/Hook"
import { IWidget, removeWidget, setSelect } from "../../../redux/WidgetsSlice"
import { GearFill } from "react-bootstrap-icons"

interface WidgetWrapperProps {
  widget: IWidget
  children: ReactNode
}

const WidgetWrapper = React.memo(({ children, widget }: WidgetWrapperProps) => {
  const dispatch = useAppDispatch()
  const edit = useAppSelector(state => state.widgets.edit)

  const mouseDownHandler = (e: MouseEvent<HTMLDivElement>) => {
    if (edit) {
      // console.log(`DISPATCH ${widget.type}`)
      dispatch(setSelect(widget))
    }
  }
  const removeHandler = () => {
    dispatch(removeWidget(widget))
  }

  // console.log(`RENDER WRAPPER ${widget.id}`)
  return (
    <div className={`widget ${edit && "widget_edit"}`}
      onMouseDown={mouseDownHandler}
      style={{ top: widget.position.y, left: widget.position.x }}
    >
      {edit && <button className="widget__remove" onClick={removeHandler}>X</button>}

      {children}
    </div>
  )
})

export default WidgetWrapper