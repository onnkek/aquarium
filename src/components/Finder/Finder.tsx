import React, { MouseEvent, MouseEventHandler, ReactNode, useState } from "react"
import IFolder from "../../models/Folder"
import "./Finder.sass"
import TreeView from "../TreeView/TreeView"

interface FinderProps {
  data: IFolder
}

const Finder = React.memo(({ data }: FinderProps) => {

  return (
    <div className="finder">
      <TreeView data={data} />
    </div>
  )
})

export default Finder