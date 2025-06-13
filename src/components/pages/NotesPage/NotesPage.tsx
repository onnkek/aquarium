import React, { useEffect } from "react"
import "./NotesPage.sass"
import Note from "../../Note/Note"
import { useAppDispatch, useAppSelector } from "../../../models/Hook"
import { getNotes } from "../../../redux/NotesSlice"
import { Status } from "../../../models/Status"
import IFolder from "../../../models/Folder"
import ContextMenu from "../../ContextMenu/ContextMenu"
import Finder from "../../Finder/Finder"
import ContentDivider from "../../ContentDivider/ContentDivider"

export interface NoteDataType {
  uid: number,
  body: string,
  icon: string
}

const NotesPage = () => {

  const dispatch = useAppDispatch()
  const notes: IFolder = useAppSelector(state => state.notes.notes)
  const status = useAppSelector(state => state.notes.status)
  const select = useAppSelector(state => state.notes.selectItem)
  const contextMenu = useAppSelector(store => store.notes.contextMenu)
  const contextMenuPosition = useAppSelector(store => store.notes.contextMenuPosition)

  document.addEventListener("contextmenu", function (e) {
    e.preventDefault()
  })


  useEffect(() => {
    if (status === Status.Idle) {
      dispatch(getNotes())
    }
  }, [status, dispatch])

  return (
    <div className="notes-page">
      <ContentDivider initSize={400} type="vertical" >
        <Finder data={notes} />
        <>
          {select && <Note />}
          {contextMenu && <ContextMenu position={contextMenuPosition} />}
        </>
      </ContentDivider>
    </div >
  )
}
export default NotesPage