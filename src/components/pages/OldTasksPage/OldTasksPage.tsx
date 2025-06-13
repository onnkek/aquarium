import React, { Component } from "react"
import "./OldTasksPage.sass"
import Search from "../../Search/Search"
import TaskList from "../../TaskList/TaskList"

const OldTasksPage = () => {

  return (
    <div className="app-container">
      <div className="search-containter">
        <Search />
      </div>
      <TaskList isNew={false} />
    </div>
  )
}
export default OldTasksPage