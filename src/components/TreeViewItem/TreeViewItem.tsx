import React, { MouseEvent, MouseEventHandler, useState } from "react"
import './TreeViewItem.sass'
import { INote } from "../../models/Note"
import IFolder from "../../models/Folder"
import TreeView from "../TreeView/TreeView"
import { useAppDispatch, useAppSelector } from "../../models/Hook"
import { openContextMenu, setSelectItem } from "../../redux/NotesSlice"
import { getNotesIcon } from "../../utils/iconsSelectors"

interface TreeViewItemProps {
  itemData: IFolder | INote
}

export const isFolder = (object: any): object is IFolder => {
  return 'children' in object
}
export const isNote = (object: any): object is INote => {
  return 'body' in object
}

const TreeViewItem = React.memo(({ itemData }: TreeViewItemProps) => {

  const [showChildren, setShowChildren] = useState(true)

  const handleClick = () => setShowChildren(!showChildren)
  const select = useAppSelector(state => state.notes.selectItem)
  const dispatch = useAppDispatch()

  const onSelect = () => {
    dispatch(setSelectItem(itemData))
    // console.log(itemData)
  }

  const contextMenuHandler = (event: MouseEvent<HTMLDivElement>) => {
    dispatch(openContextMenu({ position: { x: event.clientX, y: event.clientY }, item: itemData }))
  }

  document.addEventListener("contextmenu", function (e) {
    e.preventDefault()
  })

  return (
    <>
      <ul style={{ paddingLeft: "0px" }}>
        <div className="tree-view-item" onContextMenu={contextMenuHandler}>
          {isFolder(itemData) ? (
            <>
              {itemData.children.length > 0 && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                onClick={handleClick}
                className={`tree-view-item__control ${itemData.children.length > 0 && "tree-view-item__control_show"} ${showChildren && "tree-view-item__control_open"}`}
                viewBox="0 0 16 16">
                <path fill="white"
                  d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708" />
              </svg>}
              <img
                className="tree-view-item__icon"
                src={getNotesIcon(itemData.icon)}
                alt=""
              />
            </>
          ) : (
            <>
              <img
                className="tree-view-item__icon"
                src={getNotesIcon(itemData.icon)}
                alt=""
              />
            </>
          )
          }
          <span
            className={`tree-view-item__label ${select?.uid === itemData.uid && "tree-view-item__label_select"}`}
            onClick={onSelect}
          >{itemData.label}</span>
        </div>
        {showChildren && isFolder(itemData) &&
          <ul style={{ paddingLeft: "22px" }}>
            <TreeView data={itemData} />
          </ul>
        }
      </ul>
    </>

  )
})

export default TreeViewItem