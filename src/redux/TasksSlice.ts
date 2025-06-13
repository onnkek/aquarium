import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import PlannerAPIService from "../services/PlannerAPIService"
import { RootState } from "./store"
import { IBadge } from "../models/Badge"
import { Status } from "../models/Status"
import ITask from "../models/Task"

interface IStore {
  tasks: ITask[]
  saveTasks: ITask[]
  statusFetchTasks: Status
  errorFetchTasks: string | undefined
  statusAddTask: Status
  errorAddTask: string | undefined
  removing: number[],
  statusSaveTask: Status,
  badges: IBadge[]
}

const initialState: IStore = {
  tasks: [],
  saveTasks: [],
  statusFetchTasks: Status.Idle,
  errorFetchTasks: '',
  statusAddTask: Status.Idle,
  errorAddTask: '',
  removing: [],
  statusSaveTask: Status.Idle,
  badges: []
}
const TasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {

    sortTasks: (state, action) => {
      switch (action.payload) {
        case 'Name':
          state.tasks.sort((task1, task2) => task1.body > task2.body ? 1 : -1)
          return
        case 'Time':
          state.tasks.sort((task1, task2) => task1.deadline > task2.deadline ? 1 : -1)
          return
        default:
          return
      }
    },
    filterTasks: (state, action) => {
      state.tasks = state.saveTasks
      state.tasks = state.tasks.filter(task => task.body.toLowerCase().includes(action.payload.toLowerCase()))
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchTasks.pending, (state: IStore) => {
        state.statusFetchTasks = Status.Loading
      })
      .addCase(fetchTasks.fulfilled, (state: IStore, action) => {
        state.statusFetchTasks = Status.Succeeded
        state.tasks = action.payload
        state.saveTasks = action.payload
      })
      .addCase(fetchTasks.rejected, (state: IStore, action) => {
        state.statusFetchTasks = Status.Failed
        state.errorFetchTasks = action.error.message
      })

      .addCase(addNewTask.fulfilled, (state: IStore, action) => {
        state.statusAddTask = Status.Succeeded
        state.tasks.push(action.payload)
      })
      .addCase(addNewTask.pending, (state: IStore, action) => {
        state.statusAddTask = Status.Loading
      })
      .addCase(addNewTask.rejected, (state: IStore, action) => {
        state.statusAddTask = Status.Idle
      })


      .addCase(hideTask.fulfilled, (state: IStore, action) => {
        const index = state.removing.findIndex(id => id === action.meta.arg.id)
        state.removing.splice(index, 1)
        state.tasks = action.payload
      })
      .addCase(hideTask.pending, (state: IStore, action) => {
        state.removing.push(action.meta.arg.id)
      })
      .addCase(hideTask.rejected, (state: IStore, action) => {
        //state.statusRemoveTask = 'failed'
      })


      .addCase(removeTask.fulfilled, (state: IStore, action) => {
        const index = state.removing.findIndex(id => id === action.meta.arg.id)
        state.removing.splice(index, 1)
        state.tasks = action.payload
      })
      .addCase(removeTask.pending, (state: IStore, action) => {
        state.removing.push(action.meta.arg.id)
      })
      .addCase(removeTask.rejected, (state: IStore, action) => {
        //state.statusRemoveTask = 'failed'
      })

      .addCase(saveTask.fulfilled, (state: IStore, action) => {
        state.statusSaveTask = Status.Succeeded
        state.tasks = action.payload
      })
      .addCase(saveTask.pending, (state: IStore, action) => {
        state.statusSaveTask = Status.Loading
      })
      .addCase(saveTask.rejected, (state: IStore, action) => {
        //state.statusSaveTask = Status.Failed
      })
  }
})

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async () => {
    return await new PlannerAPIService().getTasks()
  })


type PayloadType = {
  body: string
  deadline: string
  link: string
  badges: IBadge[]
}

export const addNewTask = createAsyncThunk<ITask, PayloadType, { state: RootState }>(
  'tasks/addNewTask',
  async (payload, { rejectWithValue, getState }) => {
    const state = getState().tasks

    let maxId = 1
    if (state.tasks.length) {
      maxId = state.tasks.reduce((prev, cur) => (prev.id > cur.id ? prev : cur)).id
      maxId++
    }
    const newTask: ITask = {
      id: maxId,
      body: payload.body,
      create: String(Date.now()),
      remove: "",
      timeleft: "",
      deadline: payload.deadline,
      link: payload.link,
      visible: true,
      badges: payload.badges
    }
    const newTasks = [...state.tasks, newTask]
    const response = await new PlannerAPIService().addTask(newTask)
    if (!response.ok) {
      return rejectWithValue('Can\'t delete task! Server error!')
    }
    return newTask
  })

type HidePayloadType = {
  id: number
}
export const hideTask = createAsyncThunk<ITask[], HidePayloadType, { state: RootState, rejectValue: string }>(
  'tasks/hideTask',
  async (payload, { getState, rejectWithValue }) => {

    const state = getState().tasks.tasks
    const index = state.findIndex((task) => task.id === payload.id)
    const newData: ITask[] = [...state]
    newData[index] = { ...state[index] }
    newData[index].visible = false
    const response = await new PlannerAPIService().updateTask(newData[index].id, { "visible": false })
    if (!response.ok) {
      return rejectWithValue('Can\'t delete task! Server error!')
    }
    return newData
  })

export const removeTask = createAsyncThunk<ITask[], HidePayloadType, { state: RootState, rejectValue: string }>(
  'tasks/removeTask',
  async (payload: HidePayloadType, { rejectWithValue, getState }) => {

    const state = getState().tasks.tasks
    const index = state.findIndex((task) => task.id === payload.id)
    const newData = [...state.slice(0, index), ...state.slice(index + 1)]
    const response = await new PlannerAPIService().removeTask(payload.id)
    if (!response.ok) {
      return rejectWithValue('Can\'t delete task! Server error!')
    }
    return newData
  })

type SavePayloadType = {
  id: number
  body: string
  deadline: string
}
export const saveTask = createAsyncThunk<ITask[], SavePayloadType, { state: RootState, rejectValue: string }>(
  'tasks/saveTask',
  async (payload, { rejectWithValue, getState }) => {

    const state = getState().tasks.tasks
    const index = state.findIndex((task) => task.id === payload.id)
    const editedTask = { ...state[index] }
    editedTask.body = payload.body
    editedTask.deadline = payload.deadline
    const newData = [...state.slice(0, index), editedTask, ...state.slice(index + 1)]
    const response = await new PlannerAPIService().updateTask(payload.id, { "body": payload.body, "deadline": payload.deadline })
    if (!response.ok) {
      return rejectWithValue('Can\'t delete task! Server error!')
    }
    return newData
  })

export const { sortTasks, filterTasks } = TasksSlice.actions
export default TasksSlice.reducer