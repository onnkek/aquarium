import React from "react"
import "./VacationWidget.sass"
import { useAppSelector } from "../../../models/Hook"
import { Status } from "../../../models/Status"
import Spinner from "../../UI/Spinner/Spinner"
import { getDaysBeforeVacation } from "../../../utils/date"

const VacationWidget = React.memo(() => {

  const vacations = useAppSelector(state => state.settings.date.vacations)
  const status = useAppSelector(state => state.settings.status)
  const beforeVacation = getDaysBeforeVacation(vacations)

  const vacationContent = beforeVacation > 0 ? (
    <>
      <div className="vacationWidget__header">Дней до отпуска</div>
      <div className="vacationWidget__number">{beforeVacation}</div>
    </>
  ) : beforeVacation === 0 ? (
    <div className="vacationWidget__header vacationWidget__header_2025">Сейчас отпуск</div>
  ) : (
    <div className="vacationWidget__header vacationWidget__header_2025">Отпуск не запланирован</div>
  )


  return (
    <div className="vacationWidget">
      {status === Status.Loading ? <Spinner /> : vacationContent}
    </div>
  )
})

export default VacationWidget