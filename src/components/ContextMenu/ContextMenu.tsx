import React, { useState } from "react"
import "./ContextMenu.sass"
import { useAppDispatch, useAppSelector } from "../../models/Hook"
import { addItem, removeItem } from "../../redux/NotesSlice"
import { isFolder } from "../TreeViewItem/TreeViewItem"
import folderIcon from '../../assets/icons/folder.svg'
import noteIcon from '../../assets/icons/note.svg'
import deleteIcon from '../../assets/icons/delete.svg'
import { Status } from "../../models/Status"

interface ContextMenuProps {
  position: { x: number, y: number }
}



const ContextMenu = ({ position }: ContextMenuProps) => {
  const dispatch = useAppDispatch()
  const selectItem = useAppSelector(store => store.notes.selectItem)

  const createNoteHandler = () => {
    dispatch(addItem({ type: "note" }))
  }
  const createFolderHandler = () => {
    dispatch(addItem({ type: "folder" }))
  }

  const removeNoteHandler = () => {
    dispatch(removeItem({ type: "note" }))
  }
  const removeFolderHandler = () => {
    dispatch(removeItem({ type: "folder" }))
  }

  const isRootFolder = () => {
    return selectItem && selectItem.label === "root"
  }
  return (
    <div className="context-menu" style={{ top: position.y, left: position.x }}>
      {isFolder(selectItem) ? (<>
        <div className="context-menu__item" onClick={createFolderHandler}>
          <div className="context-menu__icon-container">
            <img
              className="context-menu__icon"
              src={folderIcon}
              alt=""
            />
          </div>
          <div className="context-menu__text">Create folder</div>
        </div>
        {!isRootFolder() && <div className="context-menu__item" onClick={removeFolderHandler}>
          <div className="context-menu__icon-container">
            <img
              className="context-menu__icon"
              src={deleteIcon}
              alt=""
            />
          </div>
          <div className="context-menu__text">Remove folder</div>
        </div>}
        <div className="context-menu__item" onClick={createNoteHandler}>
          <div className="context-menu__icon-container">
            <img
              className="context-menu__icon"
              src={noteIcon}
              alt=""
            />
          </div>
          <div className="context-menu__text">Create note</div>
        </div>



      </>) : (
        <div className="context-menu__item" onClick={removeNoteHandler}>
          <div className="context-menu__icon-container">
            <img
              className="context-menu__icon"
              src={deleteIcon}
              alt=""
            />
          </div>
          <div className="context-menu__text">Remove note</div>
        </div>

      )}
    </div>
  )
}
export default ContextMenu