import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { Status } from "../models/Status"
import { INote } from "../models/Note"
import IFolder from "../models/Folder"
import AquariumService from "../services/AquariumService"

interface ISystemInfo {
  chipTemp: number,
  uptime: number,
  totalSpace: number,
  usedSpace: number,
  freeSpace: number
}

interface IStatusInfo {
  status: number
}

interface ICurrentInfo {
  system: ISystemInfo,
  doser: IStatusInfo[],
  co2: IStatusInfo,
  o2: IStatusInfo,
  light: IStatusInfo,
  rgb: IStatusInfo,
  temp: {
    status: number,
    current: number
  }
}

export interface IPumpConfig {
  name: string,
  dose: number,
  period: string,
  time: string,
  currentVolume: number,
  maxVolume: number,
  status: number
}
export interface IPumpStatus {
  status: number
}

interface ICO2 {
  on: string,
  off: string
}

interface IO2 {
  on: string,
  off: string
}

interface ILight {
  on: string,
  off: string
}

interface IRGB {
  r: number,
  g: number,
  b: number,
  on: string,
  off: string
}

interface ITemp {
  setting: number,
  hysteresis: number,
  k: number,
  timeout: number
}

interface IConfig {
  system: {
    test: string
  },
  doser: IPumpConfig[],
  co2: ICO2,
  o2: IO2,
  light: ILight,
  rgb: IRGB,
  temp: ITemp
}

interface IAquarium {
  currentInfo: ICurrentInfo,
  config: IConfig,
  status: Status
}

const initialState: IAquarium = {
  currentInfo: {
    system: {
      chipTemp: 0,
      uptime: 0,
      totalSpace: 0,
      usedSpace: 0,
      freeSpace: 0
    },
    doser: [
      {
        status: 0
      },
      {
        status: 0
      },
      {
        status: 0
      },
      {
        status: 0
      }
    ],
    co2: {
      status: 0
    },
    o2: {
      status: 0
    },
    light: {
      status: 0
    },
    rgb: {
      status: 0
    },
    temp: {
      status: 0,
      current: 0
    }
  },
  config: {
    system: {
      test: ""
    },
    doser: [
      {
        name: "",
        dose: 0,
        period: "",
        time: "",
        currentVolume: 0,
        maxVolume: 0,
        status: 0
      },
      {
        name: "",
        dose: 0,
        period: "",
        time: "",
        currentVolume: 0,
        maxVolume: 0,
        status: 0
      },
      {
        name: "",
        dose: 0,
        period: "",
        time: "",
        currentVolume: 0,
        maxVolume: 0,
        status: 0
      },
      {
        name: "",
        dose: 0,
        period: "",
        time: "",
        currentVolume: 0,
        maxVolume: 0,
        status: 0
      }
    ],
    co2: {
      on: "null",
      off: "null"
    },
    o2: {
      on: "null",
      off: "null"
    },
    light: {
      on: "null",
      off: "null"
    },
    rgb: {
      r: 0,
      g: 0,
      b: 0,
      on: "null",
      off: "null"
    },
    temp: {
      setting: 0,
      hysteresis: 0,
      k: 0,
      timeout: 0
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

      .addCase(getConfig.pending, (state: IAquarium) => {
        state.status = Status.Loading
      })
      .addCase(getConfig.fulfilled, (state: IAquarium, action) => {
        state.status = Status.Succeeded
        state.config = action.payload
      })

      .addCase(getCurrentInfo.pending, (state: IAquarium) => {
        state.status = Status.Loading
      })
      .addCase(getCurrentInfo.fulfilled, (state: IAquarium, action) => {
        state.status = Status.Succeeded
        state.currentInfo = action.payload
      })
  }
})

export const getCurrentInfo = createAsyncThunk(
  'aquarium/getCurrentInfo',

  async () => {
    return await new AquariumService().getCurrentInfo()
  })

export const getConfig = createAsyncThunk(
  'aquarium/getConfig',

  async () => {
    return await new AquariumService().getConfig()
  })

export default AquariumSlice.reducer