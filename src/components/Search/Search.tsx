import React, { useState } from 'react'
import './Search.sass'
import { sortTasks, filterTasks } from '../../redux/TasksSlice'
import { useAppDispatch } from '../../models/Hook'

const Search = () => {

  enum ButtonType {
    Name,
    Time
  }
  const [sort, setSort] = useState('Filter')
  const [filter, setFilter] = useState('')
  const dispatch = useAppDispatch()

  const onClickHandler = (type: ButtonType) => {
    switch (type) {
      case ButtonType.Name:
        setSort('Name')
        dispatch(sortTasks('Name'))
        return
      case ButtonType.Time:
        setSort('Time')
        dispatch(sortTasks('Time'))
        return
      default:
        return
    }
  }

  const onChangeHandler = (e: any) => {
    setFilter(e.target.value)
    dispatch(filterTasks(e.target.value))
  }

  return (
    <>
      <div className="search-bar input-group">
        <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">{sort}</button>
        <ul className="dropdown-menu">
          <li><button className="dropdown-item" onClick={() => onClickHandler(ButtonType.Name)}>Name</button></li>
          <li><button className="dropdown-item" onClick={() => onClickHandler(ButtonType.Time)}>Time left</button></li>
        </ul>
        <input type="text" className="form-control" aria-label="Text input with dropdown button" onChange={onChangeHandler} value={filter} />
      </div>
    </>
  )
}

export default Search