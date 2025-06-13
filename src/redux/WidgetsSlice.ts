import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { Status } from "../models/Status"
import PlannerAPIService from "../services/PlannerAPIService"
import { RootState } from "./store"

export interface IWidget {
  id: number
  type: string
  position: { x: number, y: number }
  month?: number
  year?: number
  city?: string
  offset?: number
}

interface IWidgets {
  widgets: IWidget[]
  status: Status
  select: IWidget | undefined
  edit: boolean
  add: boolean
}

const initialState: IWidgets = {
  widgets: [],
  status: Status.Idle,
  select: undefined,
  edit: false,
  add: false
}


const WidgetsSlice = createSlice({
  name: 'widgets',
  initialState,
  reducers: {
    toggleEdit(state) {
      state.edit = !state.edit
    },
    toggleAdd(state) {
      state.add = !state.add
    },
    addWidget(state, action) {
      switch (action.payload) {
        case "CalendarWidget":
          state.widgets.push(
            {
              id: Math.random(),
              type: action.payload,
              month: new Date().getMonth() + 1,
              year: new Date().getFullYear(),
              position: { x: 0, y: 0 }
            })
          break
        case "ClockWidget":
          state.widgets.push(
            {
              id: Math.random(),
              type: action.payload,
              offset: 0,
              position: { x: 0, y: 0 }
            })
          break
        case "WeatherWidget":
          state.widgets.push({
            id: Math.random(),
            type: action.payload,
            city: "Ekaterinburg",
            position: { x: 0, y: 0 }
          })
          break
        default:
          state.widgets.push({
            id: Math.random(),
            type: action.payload,
            position: { x: 0, y: 0 }
          })
          break
      }
    },
    removeWidget(state, action) {
      const index = state.widgets.findIndex((widget) => widget.id === action.payload.id)
      state.widgets = [...state.widgets.slice(0, index), ...state.widgets.slice(index + 1)]
    },
    setSelect(state, action) {
      state.select = action.payload
    },
    setWidgetPosition(state, action) {
      const widget = state.widgets.find(x => x.id === state.select!.id)
      if (widget) {
        widget.position = action.payload
      }
    },
    updateCalendarWidget(state, action) {
      const widget = state.widgets.find(x => x.id === action.payload.widgetId)
      widget!.month = action.payload.month
      widget!.year = action.payload.year
    },
    updateWeatherWidget(state, action: { payload: { city: string, widgetId: number } }) {
      const widget = state.widgets.find(x => x.id === action.payload.widgetId)
      widget!.city = action.payload.city
    },
    updateClockWidget(state, action: { payload: { offset: number, widgetId: number } }) {
      const widget = state.widgets.find(x => x.id === action.payload.widgetId)
      widget!.offset = action.payload.offset
    }
  },
  extraReducers(builder) {
    builder

      .addCase(getWidgets.pending, (state: IWidgets) => {
        state.status = Status.Loading
      })
      .addCase(getWidgets.fulfilled, (state: IWidgets, action) => {
        state.status = Status.Succeeded
        state.widgets = action.payload

      })
      .addCase(getWidgets.rejected, (state: IWidgets, action) => {
        state.status = Status.Failed
      })


      .addCase(updateWidgets.pending, (state: IWidgets) => {
        state.status = Status.Loading
      })
      .addCase(updateWidgets.fulfilled, (state: IWidgets, action) => {
        state.status = Status.Succeeded
        state.widgets = action.payload
      })
      .addCase(updateWidgets.rejected, (state: IWidgets, action) => {
        state.status = Status.Failed
      })

  }
})

export const getWidgets = createAsyncThunk(
  'widgets/getWidgets',

  async () => {
    return await new PlannerAPIService().getWidgets()
  })

export const updateWidgets = createAsyncThunk<any, any, { state: RootState }>(

  'widgets/updateWidgets',
  async (_, { rejectWithValue, getState, dispatch }) => {

    const state = getState()
    // console.log(state.widgets)
    const response = await new PlannerAPIService().updateWidgets(state.widgets.widgets)
    if (!response.ok) {
      return rejectWithValue('Can\'t delete post! Server error!')
    }
    return state.widgets.widgets
  }
)



export const {
  toggleEdit,
  toggleAdd,
  addWidget,
  removeWidget,
  setSelect,
  setWidgetPosition,
  updateCalendarWidget,
  updateWeatherWidget,
  updateClockWidget
} = WidgetsSlice.actions
export default WidgetsSlice.reducer