import { createAction, createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IBadge } from "../models/Badge"
import { RootState } from "./store"
import PlannerAPIService from "../services/PlannerAPIService"
import { Status } from "../models/Status"
import { INote } from "../models/Note"
import IFolder from "../models/Folder"
import { isFolder, isNote } from "../components/TreeViewItem/TreeViewItem"


interface INotes {
  notes: IFolder
  status: Status
  removing: number[]
  addStatus: Status
  statusSavePost: Status
  contextMenu: boolean
  contextMenuPosition: { x: number, y: number }
  iconsMenu: boolean
  iconsMenuPosition: { x: number, y: number }
  selectItem: INote | IFolder | undefined
}

const initialState: INotes = {
  notes: {
    uid: 1,
    create: "01.01.2024",
    label: "root",
    icon: "folder",
    children: []
  },
  status: Status.Idle,
  removing: [],
  addStatus: Status.Idle,
  statusSavePost: Status.Idle,
  contextMenu: false,
  contextMenuPosition: { x: 0, y: 0 },
  iconsMenu: false,
  iconsMenuPosition: { x: 0, y: 0 },
  selectItem: undefined
}

const getFolder = (folder: IFolder, select: IFolder | INote): IFolder | undefined => {
  let result = undefined
  if (select && select.uid === folder.uid) {
    result = folder
  } else {
    for (let i = 0; i < folder.children.length; i++) {
      const child = folder.children[i]
      if (isFolder(child)) {
        result = getFolder(child, select)
        if (result) {
          break
        }
      }
      if (child.uid === select.uid) {
        result = folder
        break
      }
    }
  }
  return result
}

const getParentFolder = (folder: IFolder, select: IFolder | INote): IFolder | undefined => {
  let result = undefined
  for (let i = 0; i < folder.children.length; i++) {
    const child = folder.children[i]
    if (isFolder(child)) {
      if (child.uid === select.uid) {
        result = folder
        break
      }
      result = getParentFolder(child, select)
      if (result) {
        break
      }
    }

  }
  return result
}

const NotesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    openIconsMenu(state, action: PayloadAction<{ x: number, y: number }>) {
      state.iconsMenu = true
      state.iconsMenuPosition = action.payload
    },
    closeIconsMenu(state) {
      state.iconsMenu = false
      state.iconsMenuPosition = { x: 0, y: 0 }
    },
    openContextMenu(state, action: PayloadAction<{ position: { x: number, y: number }, item: INote | IFolder }>) {
      state.contextMenu = true
      state.contextMenuPosition = action.payload.position
      state.selectItem = action.payload.item
    },
    closeContextMenu(state) {
      state.contextMenu = false
      state.contextMenuPosition = { x: 0, y: 0 }
    },
    setSelectItem(state, action: PayloadAction<INote | IFolder | undefined>) {
      state.selectItem = action.payload
    }
  },
  extraReducers(builder) {
    builder

      .addCase(getNotes.pending, (state: INotes) => {
        state.status = Status.Loading
      })
      .addCase(getNotes.fulfilled, (state: INotes, action) => {
        state.status = Status.Succeeded
        state.notes = action.payload
      })
      .addCase(getNotes.rejected, (state: INotes, action) => {
        state.status = Status.Failed
      })



      .addCase(addItem.fulfilled, (state: INotes, action) => {
        console.log("fulfilled")
        state.status = Status.Succeeded
        state.notes = action.payload
      })
      .addCase(addItem.pending, (state: INotes, action) => {
        console.log("pending")
        state.status = Status.Loading
      })
      .addCase(addItem.rejected, (state: INotes, action) => {
        console.log("rejected")
        state.status = Status.Failed
      })


      .addCase(removeItem.fulfilled, (state: INotes, action) => {
        console.log("fulfilled")
        state.status = Status.Succeeded
        state.notes = action.payload
      })
      .addCase(removeItem.pending, (state: INotes, action) => {
        console.log("pending")
        state.status = Status.Loading
      })
      .addCase(removeItem.rejected, (state: INotes, action) => {
        console.log("rejected")
        state.status = Status.Failed
      })



      .addCase(updateNotes.fulfilled, (state: INotes, action) => {
        console.log("fulfilled")
        state.status = Status.Succeeded
        state.notes = action.payload.notes
        state.selectItem = action.payload.select
      })
      .addCase(updateNotes.pending, (state: INotes, action) => {
        console.log("pending")
        state.status = Status.Loading
      })
      .addCase(updateNotes.rejected, (state: INotes, action) => {
        console.log("rejected")
        state.status = Status.Failed
      })
  }
})
type PayloadType = {
  body: string
  create: string
  name: string
  icon: string
}

export const getNotes = createAsyncThunk(
  'notes/getNotes',
  async () => {
    return await new PlannerAPIService().getNotes()
  })

type AddPayloadType = {
  type: "note" | "folder"
}
export const addItem = createAsyncThunk<IFolder, AddPayloadType, { state: RootState, rejectValue: string }>(
  'posts/addItem',
  async (payload, { rejectWithValue, getState }) => {

    const notes = getState().notes.notes
    const select = getState().notes.selectItem
    const newNotes = JSON.parse(JSON.stringify(notes))

    if (isFolder(select)) {
      if (payload.type === "note") {
        const uid = Math.random()
        const newNote: INote = {
          uid: uid,
          body: "123",
          create: Date.now().toString(),
          icon: "test",
          label: "New note " + uid.toString().substring(0, 7)
        }
        const item = getFolder(newNotes, select)
        console.log(item)
        if (item) {
          item.children.push(newNote)
        }

      } else {
        const uid = Math.random()
        const newFolder: IFolder = {
          uid: uid,
          label: "New folder " + uid.toString().substring(0, 7),
          create: Date.now().toString(),
          icon: "folder",
          children: []
        }
        const item = getFolder(newNotes, select)
        console.log(item)
        if (item) {
          item.children.push(newFolder)
        }

      }
      const response = await new PlannerAPIService().updateNote(newNotes)
      if (!response.ok) {
        return rejectWithValue('Can\'t delete post! Server error!')
      }
    }
    return newNotes
  })

export const removeItem = createAsyncThunk<IFolder, AddPayloadType, { state: RootState, rejectValue: string }>(
  'posts/removeItem',
  async (payload, { rejectWithValue, getState }) => {

    const notes = getState().notes.notes
    const select = getState().notes.selectItem
    const newNotes = JSON.parse(JSON.stringify(notes))

    if (isNote(select)) {
      const folder = getFolder(newNotes, select)
      if (folder) {
        const index = folder.children.findIndex(note => note.uid === select.uid)
        folder.children = [...folder.children.slice(0, index), ...folder.children.slice(index + 1)]
      }
    }
    if (isFolder(select)) {
      const folder = getParentFolder(newNotes, select)
      if (folder) {
        const index = folder.children.findIndex(folder => folder.uid === select.uid)
        folder.children = [...folder.children.slice(0, index), ...folder.children.slice(index + 1)]
      }
    }
    const response = await new PlannerAPIService().updateNote(newNotes)
    if (!response.ok) {
      return rejectWithValue('Can\'t delete post! Server error!')
    }

    return newNotes
  })


type UpdateItemType = {
  label: string | undefined
  body: string | undefined
  icon: string
}
export const updateNotes = createAsyncThunk<{ notes: IFolder, select: IFolder | INote | undefined }, UpdateItemType, { state: RootState, rejectValue: string }>(
  'posts/updateNotes',
  async (payload, { rejectWithValue, getState }) => {
    const notes = getState().notes.notes
    const select = getState().notes.selectItem
    const newNotes = JSON.parse(JSON.stringify(notes))
    let newSelected = undefined
    if (isFolder(select) && payload.label) {
      const folder = getFolder(newNotes, select)
      if (folder) {
        folder.label = payload.label
        folder.icon = payload.icon
        newSelected = folder
      }
    }
    if (isNote(select) && payload.label && payload.body) {
      const folder = getFolder(newNotes, select)
      if (folder) {
        const note = folder.children.find(note => note.uid === select.uid)
        if (isNote(note)) {
          note.label = payload.label
          note.body = payload.body
          note.icon = payload.icon
          newSelected = note
        }
      }
    }


    const response = await new PlannerAPIService().updateNote(newNotes)
    if (!response.ok) {
      return rejectWithValue('Can\'t delete post! Server error!')
    }

    return { notes: newNotes, select: newSelected }
  })

export const {
  openContextMenu,
  closeContextMenu,
  setSelectItem,
  openIconsMenu,
  closeIconsMenu
} = NotesSlice.actions
export default NotesSlice.reducer