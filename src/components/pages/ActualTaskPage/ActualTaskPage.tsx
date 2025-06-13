import React, { useState } from "react"
import "./ActualTaskPage.sass"
import Search from "../../Search/Search"
import { PlusLg } from "react-bootstrap-icons"
import Modal from "../../Modal/Modal"
import TaskAddForm from "../../TaskAddForm/TaskAddForm"
import TaskList from "../../TaskList/TaskList"

const ActualTaskPage = () => {

  const [showModal, setShowModal] = useState(false)

  return (
    <div className="app-container">
      <div className="search-containter">
        <Search />
        <button
          type="button"
          className="add-button btn btn-primary outline"
          onClick={() => setShowModal(true)}
        ><PlusLg size={22} /></button>
      </div>
      <TaskList isNew={true} />
      <Modal title='Add new task' show={showModal} setShow={setShowModal}>
        <TaskAddForm closeModal={() => setShowModal(false)} />
      </Modal >
    </div >
  )
}
export default ActualTaskPage