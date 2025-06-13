import React, { useState } from "react"
import "./TaskAddForm.sass"
import Spinner from "../UI/Spinner/Spinner"
import { addNewTask } from "../../redux/TasksSlice"
import { useAppDispatch, useAppSelector } from "../../models/Hook"
import Badge, { BadgeType } from "../UI/Badge/Badge"
import { IBadge } from "../../models/Badge"
import { Status } from "../../models/Status"



const TaskAddForm = ({ closeModal }: any) => {

  const dispatch = useAppDispatch()
  const [body, setBody] = useState('')
  const [deadline, setDeadline] = useState('')
  const [link, setLink] = useState('')
  const status = useAppSelector(state => state.tasks.statusAddTask)
  const [badges, setBadges] = useState<IBadge[]>([])
  const [startBadges, setStartBadges] = useState(useAppSelector(state => state.badges.badges))


  const onBodyChange = (e: any) => {
    setBody(e.target.value)
  }
  const onDeadlineChange = (e: any) => {
    setDeadline(e.target.value)
  }
  const onLinkChange = (e: any) => {
    setLink(e.target.value)
  }

  const onSubmit = async (e: any) => {
    e.preventDefault()
    await dispatch(addNewTask({ body, deadline, link, badges }))

    setBody('')
    setDeadline('')
    setLink('')
    closeModal()
  }

  const addBadgeHandler = (badge: IBadge) => {
    setBadges([...badges, badge])
    const index = startBadges.findIndex((b) => b.id === badge.id)
    setStartBadges([...startBadges.slice(0, index), ...startBadges.slice(index + 1)])
  }

  const removeBadgeHandler = (badge: IBadge) => {
    const index = badges.findIndex((b) => b.id === badge.id)
    setBadges([...badges.slice(0, index), ...badges.slice(index + 1)])
    setStartBadges([...startBadges, badge])
  }

  if (status === Status.Loading) {
    return <Spinner small className="mb-4" />
  }


  const badgesContent = badges && badges.map(badge => {
    return (
      <li key={badge.id} className="m-2px">
        <Badge type={BadgeType.Add} badge={badge} onClick={removeBadgeHandler} />
      </li>
    )
  })
  const startBadgesContent = startBadges.map(badge => {
    return (
      <li key={badge.id} className="m-2px">
        <Badge type={BadgeType.Remove} badge={badge} onClick={addBadgeHandler} />
      </li>
    )
  })
  return (

    <form className="form-1">
      <div className="mb-3">
        <label className="form-label">
          Task description
        </label>
        <textarea
          autoFocus
          className="form-control"
          name="body"
          rows={5}
          placeholder="What should be done?"
          value={body}
          onChange={onBodyChange}
        ></textarea>
      </div>
      <div className="mb-3">
        <label className="form-label">
          Link to an external resource
        </label>
        <input
          type="text"
          name="link"
          className="form-control add-form-date"
          value={link}
          onChange={onLinkChange}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">
          Set deadline
        </label>

        <input
          type="datetime-local"
          name="deadline"
          className="form-control add-form-date"
          value={deadline}
          onChange={onDeadlineChange}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">
          Select badges
        </label>
        <ul className="form-control badge-list">
          {badgesContent}
        </ul>
        <ul className="badge-list">
          {startBadgesContent}
        </ul>
      </div>

      <div className="form-footer">
        <button type="submit" className="btn btn-primary" onClick={onSubmit}>
          Add
        </button>
      </div>
    </form>
  )
}
export default TaskAddForm