import React from "react"
import TreeViewItem from "../TreeViewItem/TreeViewItem"
import IFolder from "../../models/Folder"
import { INote } from "../../models/Note"
import "./TreeView.sass"

interface TreeViewProps {
  data: IFolder
}

const TreeView = React.memo(({ data }: TreeViewProps) => {

  const renderItems = (item: IFolder | INote) => (
    <TreeViewItem
      // onSelect={onSelect}
      itemData={item}
      key={item.uid}
    />
  )

  return (
    <>
      {data.children.map(renderItems)}
    </>
  )
})

export default TreeView