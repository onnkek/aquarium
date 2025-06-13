import React, { MouseEvent, ReactNode, useState, Children, useEffect } from "react"
import "./ContentDivider.sass"

interface ContentDividerProps {
  children: ReactNode
  initSize: number
  initHeight?: number
  hitZoneSize?: number
  type: "vertical" | "horizontal"
  callback?: (arg0: number) => void
}

const ContentDivider = React.memo(({ initSize, children, hitZoneSize = 5, type, callback }: ContentDividerProps) => {
  const [size, setSize] = useState(initSize)
  const [widthEdit, setWidthEdit] = useState(false)
  const [lastCursor, setLastCursor] = useState({ x: 0, y: 0 })



  const mouseDownHandler = (e: MouseEvent<HTMLDivElement>) => {
    const clientY = document.documentElement.clientHeight - e.clientY
    if ((type === "vertical" && e.clientX > size - hitZoneSize && e.clientX < size + hitZoneSize) ||
      (type === "horizontal" && clientY > size - hitZoneSize && clientY < size + hitZoneSize)
    ) {
      setWidthEdit(true)
    }
  }

  const mouseMoveHandler = (e: MouseEvent<HTMLDivElement>) => {

    const cursor = { x: e.clientX, y: e.clientY }
    const clientY = document.documentElement.clientHeight - e.clientY
    if ((type === "vertical" && e.clientX > size - hitZoneSize && e.clientX < size + hitZoneSize)) {
      document.body.style.cursor = 'ew-resize'
    } else if ((type === "horizontal" && clientY > size - hitZoneSize && clientY < size + hitZoneSize)) {
      document.body.style.cursor = 'ns-resize'
    } else {
      document.body.style.cursor = 'default'
    }

    const delta = { x: lastCursor.x - cursor.x, y: lastCursor.y - cursor.y }
    if (widthEdit && type === "vertical") {
      setSize(size - delta.x)
    } else if (widthEdit && type === "horizontal") {
      setSize(size + delta.y)

    }


    setLastCursor(cursor)
  }
  const svgMouseUpHandler = () => {
    setWidthEdit(false)
    if (callback) {
      callback(size)
    }
  }
  useEffect(() => {
    window.addEventListener("mouseup", svgMouseUpHandler);
    return () => {
      window.removeEventListener("mouseup", svgMouseUpHandler);
    };
  }, [svgMouseUpHandler]);

  return (
    <div
      onMouseDownCapture={mouseDownHandler}
      onMouseMoveCapture={mouseMoveHandler}
      className={`content-divider ${type === "vertical" ? "content-divider__ver" : "content-divider__hor"} ${widthEdit && "not-user-select"}`}
    >
      {type === "vertical" ? (
        <>
          <div style={{ width: size }}>
            {Children.toArray(children)[0]}
          </div>
          <div style={{ width: document.documentElement.clientWidth - size }} >
            {Children.toArray(children)[1]}
          </div>
        </>
      ) : (
        <>
          <div style={{ height: "100%" }}>
            {Children.toArray(children)[0]}
          </div>
          <div style={{ height: size, width: "inherit" }} className={"hor__fixed"}>
            {Children.toArray(children)[1]}
          </div>
        </>
      )}
    </div>
  )
})

export default ContentDivider