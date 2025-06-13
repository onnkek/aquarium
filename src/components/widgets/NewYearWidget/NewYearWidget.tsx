import React from "react"
import "./NewYearWidget.sass"
import { getDaysBeforeNewYear } from "../../../utils/date"

const NewYearWidget = React.memo(() => {

  const beforeNewYear = getDaysBeforeNewYear()
  return (
    <div className="newYearWidget">
      {beforeNewYear < 360 && Number(beforeNewYear) !== 0 ? (
        <>
          <div className="newYearWidget__header">Дней до нового года</div>
          <div className="newYearWidget__number">{beforeNewYear}</div>
        </>
      ) : (
        <>
          <div className="newYearWidget__header newYearWidget__header_2025">Happy New Year</div>
          <div className="newYearWidget__number">{new Date().getFullYear()}</div>
        </>
      )}
    </div>
  )
})

export default NewYearWidget