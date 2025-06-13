import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { Status } from "../models/Status"
import { INote } from "../models/Note"
import IFolder from "../models/Folder"
import PlannerAPIService from "../services/PlannerAPIService"
import { RootState } from "./store"
import { IWidget } from "./WidgetsSlice"

export interface IWeekend {
  highlight: boolean
}

export interface IWorking {
  id: number
  day: string
}

export interface IVacation {
  id: number
  start: string
  end: string
}

export interface IHoliday {
  id: number
  day: string
}

export interface IDate {
  holidays: IHoliday[]
  vacations: IVacation[]
  workings: IWorking[]
  weekend: IWeekend
}



interface ISettings {
  date: IDate
  status: Status
  settingStatus: Status
  position: { x: number, y: number }
  removing: number[]
  addStatus: Status
  statusSavePost: Status
  contextMenu: boolean
  contextMenuPosition: { x: number, y: number }
  iconsMenu: boolean
  iconsMenuPosition: { x: number, y: number }
  selectItem: INote | IFolder | undefined
}

const initialState: ISettings = {
  date: {
    holidays: [],
    vacations: [],
    workings: [],
    weekend: {
      highlight: false
    }
  },
  position: { x: 0, y: 0 },
  status: Status.Idle,
  settingStatus: Status.Idle,
  removing: [],
  addStatus: Status.Idle,
  statusSavePost: Status.Idle,
  contextMenu: false,
  contextMenuPosition: { x: 0, y: 0 },
  iconsMenu: false,
  iconsMenuPosition: { x: 0, y: 0 },
  selectItem: undefined
}

const SettingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setSettingStatusIdle(state) {
      console.log("setIdle")
      state.settingStatus = Status.Idle
    }
  },
  extraReducers(builder) {
    builder

      .addCase(getSettings.pending, (state: ISettings) => {
        state.status = Status.Loading
      })
      .addCase(getSettings.fulfilled, (state: ISettings, action) => {
        state.status = Status.Succeeded
        state.date = action.payload.date

      })
      .addCase(getSettings.rejected, (state: ISettings, action) => {
        state.status = Status.Failed
      })


      .addCase(addWorking.pending, (state: ISettings) => {
        state.settingStatus = Status.Loading
      })
      .addCase(addWorking.fulfilled, (state: ISettings, action) => {
        state.settingStatus = Status.Succeeded
        state.date.workings.push(action.payload)
      })
      .addCase(addWorking.rejected, (state: ISettings, action) => {
        state.settingStatus = Status.Failed
      })

      .addCase(removeWorking.pending, (state: ISettings) => {
        state.settingStatus = Status.Loading
      })
      .addCase(removeWorking.fulfilled, (state: ISettings, action) => {
        state.settingStatus = Status.Succeeded
        state.date.workings = action.payload
      })
      .addCase(removeWorking.rejected, (state: ISettings, action) => {
        state.settingStatus = Status.Failed
      })


      .addCase(addHoliday.pending, (state: ISettings) => {
        state.settingStatus = Status.Loading
      })
      .addCase(addHoliday.fulfilled, (state: ISettings, action) => {
        state.settingStatus = Status.Succeeded
        state.date.holidays.push(action.payload)
      })
      .addCase(addHoliday.rejected, (state: ISettings, action) => {
        state.settingStatus = Status.Failed
      })

      .addCase(removeHoliday.pending, (state: ISettings) => {
        state.settingStatus = Status.Loading
      })
      .addCase(removeHoliday.fulfilled, (state: ISettings, action) => {
        state.settingStatus = Status.Succeeded
        state.date.holidays = action.payload
      })
      .addCase(removeHoliday.rejected, (state: ISettings, action) => {
        state.settingStatus = Status.Failed
      })


      .addCase(addVacation.pending, (state: ISettings) => {
        state.settingStatus = Status.Loading
        console.log("addVacation.pending")
      })
      .addCase(addVacation.fulfilled, (state: ISettings, action) => {
        state.settingStatus = Status.Succeeded
        state.date.vacations.push(action.payload)
        console.log("addVacation.fulfilled")
      })
      .addCase(addVacation.rejected, (state: ISettings, action) => {
        state.settingStatus = Status.Failed
        console.log("addVacation.rejected")
      })

      .addCase(removeVacation.pending, (state: ISettings) => {
        state.settingStatus = Status.Loading
      })
      .addCase(removeVacation.fulfilled, (state: ISettings, action) => {
        state.settingStatus = Status.Succeeded
        state.date.vacations = action.payload
      })
      .addCase(removeVacation.rejected, (state: ISettings, action) => {
        state.settingStatus = Status.Failed
      })


      .addCase(changeWeekend.pending, (state: ISettings) => {
        state.settingStatus = Status.Loading
      })
      .addCase(changeWeekend.fulfilled, (state: ISettings, action) => {
        state.settingStatus = Status.Succeeded

        state.date.weekend = action.payload
      })
      .addCase(changeWeekend.rejected, (state: ISettings, action) => {
        state.settingStatus = Status.Failed
      })
  }
})

export const getSettings = createAsyncThunk(
  'settings/getSettings',

  async () => {
    return await new PlannerAPIService().getSettings()
  })

export const changeWeekend = createAsyncThunk<IWeekend, IWeekend, { state: RootState }>(

  'settings/changeWeekend',
  async (payload: IWeekend, { rejectWithValue, getState, dispatch }) => {

    const newWeekend: IWeekend = {
      highlight: payload.highlight
    }
    const response = await new PlannerAPIService().updateWeekend(newWeekend)
    if (!response.ok) {
      return rejectWithValue('Can\'t delete post! Server error!')
    }
    setTimeout(() => {
      dispatch(setSettingStatusIdle())
    }, 1000)
    return newWeekend

  }
)

export const addHoliday = createAsyncThunk<IHoliday, string, { state: RootState }>(

  'settings/addHoliday',
  async (payload: string, { rejectWithValue, getState, dispatch }) => {

    const newHoliday: IHoliday = {
      id: Math.random(),
      day: payload
    }
    const response = await new PlannerAPIService().addHoliday(newHoliday)
    if (!response.ok) {
      return rejectWithValue('Can\'t delete post! Server error!')
    }
    setTimeout(() => {
      dispatch(setSettingStatusIdle())
    }, 1000)
    return newHoliday

  }
)

export const removeHoliday = createAsyncThunk<IHoliday[], IHoliday, { state: RootState }>(

  'settings/removeHoliday',
  async (payload: IHoliday, { rejectWithValue, getState, dispatch }) => {

    const state = getState().settings.date.holidays
    const index = state.findIndex((holiday) => holiday.id === payload.id)
    const newHolidays = [...state.slice(0, index), ...state.slice(index + 1)]

    const response = await new PlannerAPIService().removeHoliday(payload.id)
    if (!response.ok) {
      return rejectWithValue('Can\'t delete post! Server error!')
    }
    setTimeout(() => {
      dispatch(setSettingStatusIdle())
    }, 1000)
    return newHolidays
  }
)

export const addWorking = createAsyncThunk<IWorking, string, { state: RootState }>(

  'settings/addWorking',
  async (payload: string, { rejectWithValue, getState, dispatch }) => {

    const newWorking: IWorking = {
      id: Math.random(),
      day: payload
    }
    const response = await new PlannerAPIService().addWorking(newWorking)
    if (!response.ok) {
      return rejectWithValue('Can\'t delete post! Server error!')
    }
    setTimeout(() => {
      dispatch(setSettingStatusIdle())
    }, 1000)
    return newWorking

  }
)

export const removeWorking = createAsyncThunk<IWorking[], IWorking, { state: RootState }>(

  'settings/removeWorking',
  async (payload: IWorking, { rejectWithValue, getState, dispatch }) => {

    const state = getState().settings.date.workings
    const index = state.findIndex((working) => working.id === payload.id)
    const newWorkings = [...state.slice(0, index), ...state.slice(index + 1)]

    const response = await new PlannerAPIService().removeWorking(payload.id)
    if (!response.ok) {
      return rejectWithValue('Can\'t delete post! Server error!')
    }
    setTimeout(() => {
      dispatch(setSettingStatusIdle())
    }, 1000)
    return newWorkings
  }
)

type PayloadType = {
  start: string
  end: string
}

export const addVacation = createAsyncThunk<IVacation, PayloadType, { state: RootState }>(

  'settings/addVacation',
  async (payload: PayloadType, { rejectWithValue, getState, dispatch }) => {

    const newVacation: IVacation = {
      id: Math.random(),
      start: payload.start,
      end: payload.end
    }

    const response = await new PlannerAPIService().addVacation(newVacation)
    if (!response.ok) {
      return rejectWithValue('Can\'t delete post! Server error!')
    }
    setTimeout(() => {
      dispatch(setSettingStatusIdle())
    }, 1000)
    return newVacation

  }
)

export const removeVacation = createAsyncThunk<IVacation[], IVacation, { state: RootState }>(

  'settings/removeVacation',
  async (payload: IVacation, { rejectWithValue, getState, dispatch }) => {

    const state = getState().settings.date.vacations
    const index = state.findIndex((vacation) => vacation.id === payload.id)
    const newVacations = [...state.slice(0, index), ...state.slice(index + 1)]

    const response = await new PlannerAPIService().removeVacation(payload.id)
    if (!response.ok) {
      return rejectWithValue('Can\'t delete post! Server error!')
    }
    setTimeout(() => {
      dispatch(setSettingStatusIdle())
    }, 1000)
    return newVacations
  }
)


export const {
  setSettingStatusIdle
} = SettingsSlice.actions
export default SettingsSlice.reducer