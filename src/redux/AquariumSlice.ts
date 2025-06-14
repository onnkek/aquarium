import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { Status } from "../models/Status"
import { INote } from "../models/Note"
import IFolder from "../models/Folder"
import AquariumService from "../services/AquariumService"

interface ISystem {
  chipTemp: number,
  totalSpace: number,
  usedSpace: number,
  freeSpace: number
}

export interface IPump {
  name: string,
  dose: number,
  period: string,
  time: string,
  currentVolume: number,
  maxVolume: number,
  status: number
}

interface ICO2 {
  on: string,
  off: string,
  status: boolean
}

interface IO2 {
  on: string,
  off: string,
  status: boolean
}

interface ILight {
  on: string,
  off: string,
  status: boolean
}

interface IRGB {
  r: number,
  g: number,
  b: number,
  on: string,
  off: string,
  status: boolean
}

interface ITemp {
  setting: number,
  hysteresis: number,
  k: number,
  timeout: number,
  status: number // 0 - off, 1 - cool, 2 - heat
}


interface IAquarium {
  settings: {
    system: ISystem,
    doser: {
      pump1: IPump,
      pump2: IPump,
      pump3: IPump,
      pump4: IPump
    },
    co2: ICO2,
    o2: IO2,
    light: ILight,
    rgb: IRGB,
    temp: ITemp
  }
  status: Status
}

const initialState: IAquarium = {
  settings: {
    system: {
      chipTemp: 0,
      totalSpace: 0,
      usedSpace: 0,
      freeSpace: 0
    },
    doser: {
      pump1: {
        name: "",
        dose: 0,
        period: "",
        time: "",
        currentVolume: 0,
        maxVolume: 0,
        status: 0
      },
      pump2: {
        name: "",
        dose: 0,
        period: "",
        time: "",
        currentVolume: 0,
        maxVolume: 0,
        status: 0
      },
      pump3: {
        name: "",
        dose: 0,
        period: "",
        time: "",
        currentVolume: 0,
        maxVolume: 0,
        status: 0
      },
      pump4: {
        name: "",
        dose: 0,
        period: "",
        time: "",
        currentVolume: 0,
        maxVolume: 0,
        status: 0
      }
    },
    co2: {
      on: "null",
      off: "null",
      status: false
    },
    o2: {
      on: "null",
      off: "null",
      status: false
    },
    light: {
      on: "null",
      off: "null",
      status: false
    },
    rgb: {
      r: 0,
      g: 0,
      b: 0,
      on: "null",
      off: "null",
      status: false
    },
    temp: {
      setting: 0,
      hysteresis: 0,
      k: 0,
      timeout: 0,
      status: 0
    }
  },
  status: Status.Idle
}

const AquariumSlice = createSlice({
  name: 'aquarium',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder

      .addCase(getSettings.pending, (state: IAquarium) => {
        state.status = Status.Loading
      })
      .addCase(getSettings.fulfilled, (state: IAquarium, action) => {
        state.status = Status.Succeeded
        state.settings = action.payload
      })
  }
})


export const getSettings = createAsyncThunk(
  'aquarium/getSettings',

  async () => {
    return await new AquariumService().getSettings()
  })

export default AquariumSlice.reducer