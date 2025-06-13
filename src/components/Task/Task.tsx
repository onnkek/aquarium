import React, { useEffect, useState } from "react"
import "./Task.sass"
import { CheckLg, Link45deg, Pencil, Trash3 } from "react-bootstrap-icons"
import { hideTask, removeTask, saveTask } from "../../redux/TasksSlice"
import Spinner from "../UI/Spinner/Spinner"
import { useAppDispatch, useAppSelector } from "../../models/Hook"
import { getDate, getDeadline, getProgress } from "../../utils/date"
import IPost from "../../models/Task"
import Badge from "../UI/Badge/Badge"
import { Status } from "../../models/Status"

const Task: React.FC<IPost> = (props) => {

  const dispatch = useAppDispatch()
  const status = useAppSelector(state => state.tasks.removing)
  const statusSave = useAppSelector(state => state.tasks.statusSaveTask)
  const [edit, setEdit] = useState(false)
  const [body, setBody] = useState(props.body)
  const [deadline, setDeadline] = useState(props.deadline)
  const [timer, setTimer] = useState(0)

  const { id, create, link, badges } = props


  const updateTimer = () => {
    setTimer(timer + 1)
  }

  useEffect(() => {
    const timeout = setTimeout(updateTimer, 1000)
    return () => clearTimeout(timeout)
  }, [timer])


  const deleteHandler = () => {
    if (props.visible) {
      dispatch(hideTask({ id }))
    } else {
      dispatch(removeTask({ id }))
    }
  }

  const editHandler = async () => {

    await dispatch(saveTask({ id, body, deadline }))
    setEdit(!edit) 
  }

  const deleteButton = status.some(taskId => taskId === props.id) ? (
    <Spinner className='spinner-small p-spinner' />
  ) : (
    <Trash3 onClick={deleteHandler} className="p-icon icon-trash-3" />
  )
  const editButton = edit ? (
    statusSave === Status.Loading ? (
      <Spinner className='spinner-small p-spinner' />
    ) : (
      <CheckLg size={20} type="button" className="p-icon icon-trash-3"
        onClick={editHandler} />
    )
  ) : (
    <Pencil type="button" className="p-icon icon-trash-3"
      onClick={() => setEdit(!edit)} />
  )

  const linkButton = link && (
    <a href={link} target="_blank" rel="noopener noreferrer">
      <Link45deg size={20} className="p-icon icon-trash-3" />
      </a>
  )

  const deadlineContent = edit ? (
    <input type="datetime-local" name="deadline"
      className="form-control input-date edit-deadline" value={deadline}
      onChange={e => { setDeadline(e.target.value) }}
    />
  ) : (getDeadline(deadline))


  const bodyContent = edit ? (
    <textarea
      autoFocus className="form-control"
      name="body" rows={body.length / 20}
      placeholder="What should be done?" value={body}
      onChange={e => { setBody(e.target.value) }}
    ></textarea>
  ) : (<p>{body}</p>)


  const badgesContent = badges.map(badge => {
    return (
      <li key={badge.id} className="badge-item">
        <Badge badge={badge} onClick={() => { }} />
      </li>
    )
  })

  return (
    <>
      <div className="item-wrapper">
        <div className="row">
          <div className="col-7">
            <div className="row ms-0">
              <ul className="p-badges badge-list m-0 p-0">
                {badges && badgesContent}
              </ul>
            </div>
            <div className="row item-title">
              <div className="col-12">
                {bodyContent}
              </div>
            </div>
          </div>
          <div className="col-5">
            <div className="row item-flex">
              <div className="col">
                <div className="">
                  <div className="p-min">
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
                    <div className="mb-1">
                      Deadline: {deadlineContent}
                    </div>
                    <div className="">
                      Time left: {getDate(deadline)}
                    </div>
                  </div>
                </div>
              </div>
              <div className="fix">
                <div className="item-flex-btns">
                  {linkButton}
                  {editButton}
                  {deleteButton}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )

}

export default Task
