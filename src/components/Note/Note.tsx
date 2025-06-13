import React, { MouseEvent, useEffect, useState } from "react"
import "./Note.sass"
import { useAppDispatch, useAppSelector } from "../../models/Hook"
import { Status } from "../../models/Status"
import { Spinner } from "reactstrap"
import { CheckLg, Pencil } from "react-bootstrap-icons"
import { isNote } from "../TreeViewItem/TreeViewItem"
import { openIconsMenu, updateNotes } from "../../redux/NotesSlice"
import IconsMenu from "../IconsMenu/IconsMenu"
import Editor from "react-simple-code-editor"
import hljs from "highlight.js"
import ContentDivider from "../ContentDivider/ContentDivider"
import { getNotesIcon } from "../../utils/iconsSelectors"



const Note = () => {
  const dispatch = useAppDispatch()
  const select = useAppSelector(state => state.notes.selectItem)
  const [edit, setEdit] = useState(false)

  const [body, setBody] = useState("")
  const [label, setLabel] = useState("")
  const [icon, setIcon] = useState("")

  const status = useAppSelector(state => state.notes.status)
  const showIcons = useAppSelector(state => state.notes.iconsMenu)
  
  const [editorHeight, setEditorHeight] = useState(300)

  const editHandler = async () => {
    if (select) {
      setLabel(select.label)
      setIcon(select.icon)
      if (isNote(select)) {
        setBody(select?.body)
      }
      setEdit(!edit)
    }

  }
  const saveHandler = async () => {
    if (isNote(select)) {
      setBody(select.body)
      setLabel(select.label)
      setIcon(select.icon)
    }
    await dispatch(updateNotes({ body: body, label: label, icon: icon }))
    setEdit(!edit)
  }

  const changeIconHandler = async (e: MouseEvent<HTMLDivElement>) => {
    if (!showIcons) {
      e.stopPropagation()
      dispatch(openIconsMenu({ x: e.clientX, y: e.clientY }))
    }

  }

  const editButton = edit ? (
    status === Status.Loading ? (
      <Spinner className='spinner-small p-spinner' />
    ) : (
      <CheckLg size={20} type="button" className="p-icon icon-trash-3"
        onClick={saveHandler}
      />
    )
  ) : (
    <Pencil type="button" className="p-icon icon-trash-3"
      onClick={editHandler} />
  )
  useEffect(() => {
    hljs.configure({ 'languages': ['xml'] })
  }, [])
  return (
    <div className="note-container">

      {select && <>
        <div className="note-header">
          <div className="note-header__left">
            {showIcons && <IconsMenu icon={icon} setIcon={setIcon} />}
            {edit ? <div className="note-header__icon-input" onClick={changeIconHandler}>
              <img src={getNotesIcon(icon)} className="note-header__icon note-header__icon_edit" />
            </div> :
              <img src={getNotesIcon(select.icon)} className="note-header__icon" />
            }
            <div className="note-header__title">
              {edit ? (
                <input
                  className="note-header__label-input"
                  onChange={e => { setLabel(e.target.value) }}
                  value={label}
                />
              ) : (
                <div className="note-header__label">{select.label}</div>
              )}
            </div>
          </div>
          <div className="note-header__right">
            <div className="note-header__time">
              {new Date(Number(select.create)).toLocaleDateString("ru-RU", { day: 'numeric', year: 'numeric', month: 'numeric' })}
            </div>
            {editButton}
          </div>
        </div>
        {isNote(select) && !edit && <div className="note-body" dangerouslySetInnerHTML={{ __html: select.body }}></div>}
        {
          isNote(select) && edit &&
          <ContentDivider type="horizontal" initSize={editorHeight} hitZoneSize={10} callback={setEditorHeight}>
            <div className="note-body" dangerouslySetInnerHTML={{ __html: select.body }}></div>
            {edit && isNote(select) && <div className="note-editor">
              <Editor
                value={body}
                onValueChange={code => setBody(code)}
                highlight={code => hljs.highlightAuto(code).value}
                className="html-editor"
                padding={10}
                style={{
                  fontFamily: 'Consolas',
                  fontSize: 16,
                }}
              />
            </div>}
          </ContentDivider>
        }


      </>}
    </div>
  )
}
export default Note