import React, { useEffect } from "react"
import "./TaskList.sass"
import { TransitionGroup, CSSTransition } from "react-transition-group"
import { fetchTasks } from "../../redux/TasksSlice"
import { useAppDispatch, useAppSelector } from "../../models/Hook"
import { getBadges } from "../../redux/BadgesSlice"
import { Status } from "../../models/Status"
import ITask from "../../models/Task"
import Task from "../Task/Task"
import TaskPlaceholder from "../UI/TaskPlaceholder/TaskPlaceholder"

interface PropsType {
  isNew: boolean
}

const TaskList: React.FC<PropsType> = ({ isNew }) => {

  const dispatch = useAppDispatch()
  const tasks: ITask[] = useAppSelector(state => state.tasks.tasks)
  const status = useAppSelector(state => state.tasks.statusFetchTasks)

  useEffect(() => {
    if (status === Status.Idle) {
      dispatch(fetchTasks())
      dispatch(getBadges())
    }
  }, [status, dispatch])



  const renderItems = (data: any) => {
    return data.map((item: ITask) => {
      const { id, visible } = item
      if (isNew) {
        if (visible) {
          return (
            <CSSTransition key={id} timeout={200} classNames="item">
              <li key={item.id} className="planner-list">
                <Task {...item} />
              </li>
            </CSSTransition>
          )
        }
      } else {
        if (!visible) {
          return (
            <CSSTransition key={id} timeout={200} classNames="item">
              <li key={item.id} className="planner-list">
                <Task {...item} />
              </li>
            </CSSTransition>
          )
        }
      }
    })
  }

  if (status === Status.Loading && tasks) {
    return (
      <>
        <TaskPlaceholder />
        <TaskPlaceholder />
        <TaskPlaceholder />
      </>
    )
  }

  const items = renderItems(tasks)
  return (
    <div className="planner">
      <ul className="planner-container">
        <TransitionGroup className="todo-list">{items}</TransitionGroup>
      </ul>
    </div>
  )
}
export default TaskList
