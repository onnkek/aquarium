import React, { useEffect, useState } from "react"
import "./TasksWidget.sass"
import { useAppDispatch, useAppSelector } from "../../../models/Hook"
import { Status } from "../../../models/Status"
import { fetchTasks } from "../../../redux/TasksSlice"
import { getBadges } from "../../../redux/BadgesSlice"
import { getProgress } from "../../../utils/date"
import ITask from "../../../models/Task"


const TasksWidget = React.memo(() => {

  const dispatch = useAppDispatch()
  const tasks: ITask[] = useAppSelector(state => state.tasks.tasks)
  const status = useAppSelector(state => state.tasks.statusFetchTasks)
  const [timer, setTimer] = useState(0)

  useEffect(() => {
    if (status === Status.Idle) {
      dispatch(fetchTasks())
      dispatch(getBadges())
    }
  }, [status, dispatch])

  const updateTimer = () => {
    setTimer(timer + 1)
  }

  useEffect(() => {
    const timeout = setTimeout(updateTimer, 1000)
    return () => clearTimeout(timeout)
  }, [timer])

  const currentTasksFilter = (task: ITask) => {
    return new Date(task.deadline).toLocaleDateString().toString() === new Date().toLocaleDateString().toString() && task.visible
  }

  const renderItems = (data: ITask[]) => {
    const currentTasks = data.filter(currentTasksFilter)
    currentTasks.sort((task1, task2) => task1.deadline > task2.deadline ? 1 : -1)
    if (currentTasks.length) {

      return currentTasks.map((item: ITask) => {
        const { id, visible, deadline, create, body } = item
        if (visible) {
          return (
            <li key={id} className="tasksWidget__list">
              <div className="tasksWidget__item">
                <div className="tasksWidget__header">{body}</div>
                <div
                  className="progress mb-2"
                  aria-valuenow={25}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className="progress-bar"
                    style={{ width: `${getProgress(deadline, create)}%` }}
                  ></div>
                </div>
              </div>
            </li>
          )
        }
      })

    } else {
      return <div className="tasksWidget__zero">Дедлайнов на сегодня нет</div>
    }

  }

  return (
    <div className="tasksWidget">
      <ul className="tasksWidget__wrapper">
        {renderItems(tasks)}
      </ul>
    </div>
  )
})

export default TasksWidget