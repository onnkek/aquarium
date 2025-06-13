import React from "react"
import "./IconsMenu.sass"
import { useAppSelector } from "../../models/Hook"
import { getNotesIcon } from "../../utils/iconsSelectors"

interface IconsMenuProps {
  // position: { x: number, y: number }
  icon: string
  setIcon: (arg0: string) => void
}



const IconsMenu = ({ icon, setIcon }: IconsMenuProps) => {
  const iconsMenuPosition = useAppSelector(store => store.notes.iconsMenuPosition)

  return (
    <div className="icons-editor" style={{ top: iconsMenuPosition.y, left: iconsMenuPosition.x }}>
      <div className="icons-editor__row">
        <img src={getNotesIcon("folder")} onClick={() => setIcon("folder")} />
        <img src={getNotesIcon("lp")} onClick={() => setIcon("lp")} />
        <img src={getNotesIcon("test")} onClick={() => setIcon("test")} />
        <img src={getNotesIcon("icon1")} onClick={() => setIcon("icon1")} />
        <img src={getNotesIcon("icon2")} onClick={() => setIcon("icon2")} />
      </div>
      <div className="icons-editor__row">
        <img src={getNotesIcon("icon3")} onClick={() => setIcon("icon3")} />
        <img src={getNotesIcon("icon4")} onClick={() => setIcon("icon4")} />
        <img src={getNotesIcon("icon5")} onClick={() => setIcon("icon5")} />
        <img src={getNotesIcon("icon6")} onClick={() => setIcon("icon6")} />
        <img src={getNotesIcon("icon7")} onClick={() => setIcon("icon7")} />
      </div>
      <div className="icons-editor__row">
        <img src={getNotesIcon("icon8")} onClick={() => setIcon("icon8")} />
        <img src={getNotesIcon("icon9")} onClick={() => setIcon("icon9")} />
        <img src={getNotesIcon("icon10")} onClick={() => setIcon("icon10")} />
        <img src={getNotesIcon("coffee")} onClick={() => setIcon("coffee")} />
      </div>


    </div>
  )
}
export default IconsMenu