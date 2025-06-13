import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { Status } from "../models/Status"
import { INote } from "../models/Note"
import IFolder from "../models/Folder"
import WeatherService from "../services/WeatherService"

interface IRainSnow {
  "1h"?: string
}

interface IWind {
  speed: string
}

interface IClouds {
  all: string
}

interface IWeather {
  name: string
  snow?: IRainSnow
  rain?: IRainSnow
  wind: IWind
  clouds: IClouds
  main: {
    temp: number
    feels_like: number
  }
  weather: {
    icon: string
  }[]
}

interface INotes {
  weather: IWeather[]
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
  weather: [],
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

const WeatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
  },
  extraReducers(builder) {
    builder

      .addCase(getWeather.pending, (state: INotes) => {
        state.status = Status.Loading
      })
      .addCase(getWeather.fulfilled, (state: INotes, action) => {
        state.status = Status.Succeeded
        state.weather.push(action.payload)
      })
      .addCase(getWeather.rejected, (state: INotes, action) => {
        state.status = Status.Failed
      })
  }
})


export const getWeather = createAsyncThunk(
  'notes/getWeather',
  async (payload: string) => {
    return await new WeatherService().getWeather(payload)
  })

export default WeatherSlice.reducer