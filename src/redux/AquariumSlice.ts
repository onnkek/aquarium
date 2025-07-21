import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { Status } from "../models/Status"
import AquariumService from "../services/AquariumService"
import { RootState } from "./store"

interface ISystemInfo {
  chipTemp: number,
  uptime: number,
  totalSpace: number,
  usedSpace: number,
  freeSpace: number,
  temp: number,
  humidity: number
}

interface IStatusInfo {
  status: boolean
}


interface ICurrentInfo {
  system: ISystemInfo,
  doser: {
    status: boolean,
    current: number
  }[],
  co2: IStatusInfo,
  o2: IStatusInfo,
  light: IStatusInfo,
  argb: IStatusInfo,
  temp: {
    status: boolean,
    current: number,
    cool: boolean,
    heat: boolean
  },
  filter: IStatusInfo
}

export interface IPumpPeriod {
  su: boolean
  mo: boolean
  tu: boolean
  we: boolean
  th: boolean
  fr: boolean
  sa: boolean
}

export interface IPumpConfig {
  name: string,
  dose: number,
  period: IPumpPeriod,
  time: string,
  currentVolume: number,
  maxVolume: number
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

export interface IRGB {
  r: number
  g: number
  b: number
}

interface IARGBGradient {
  start: IRGB
  end: IRGB
}

interface IARGBCycle {
  speed: number
}

interface IARGB {
  mode: string,
  static: IRGB,
  gradient: IARGBGradient,
  custom: IRGB[],
  cycle: IARGBCycle,
  on: string,
  off: string
}

interface ITemp {
  setting: number,
  hysteresis: number,
  k: number,
  timeout: number
}

export interface IConfig {
  system: {
    update: number
  },
  doser: IPumpConfig[],
  co2: ICO2,
  o2: IO2,
  light: ILight,
  argb: IARGB,
  temp: ITemp
}

interface IAquarium {
  currentInfo: ICurrentInfo,
  config: IConfig,
  logs: string,
  status: Status,
  logStatus: Status,
  updateStatus: Status
}

const initialState: IAquarium = {
  currentInfo: {
    system: {
      chipTemp: 0,
      uptime: 0,
      totalSpace: 0,
      usedSpace: 0,
      freeSpace: 0,
      temp: 0,
      humidity: 0
    },
    doser: [
      {
        status: false,
        current: 0
      },
      {
        status: false,
        current: 0
      },
      {
        status: false,
        current: 0
      },
      {
        status: false,
        current: 0
      }
    ],
    co2: {
      status: false
    },
    o2: {
      status: false
    },
    light: {
      status: false
    },
    argb: {
      status: false
    },
    temp: {
      status: false,
      current: 0,
      cool: false,
      heat: false
    },
    filter: {
      status: false
    }
  },
  config: {
    system: {
      update: 0
    },
    doser: [
      {
        name: "",
        dose: 0,
        period: {
          su: false,
          mo: false,
          tu: false,
          we: false,
          th: false,
          fr: false,
          sa: false
        },
        time: "",
        currentVolume: 0,
        maxVolume: 0
      },
      {
        name: "",
        dose: 0,
        period: {
          su: false,
          mo: false,
          tu: false,
          we: false,
          th: false,
          fr: false,
          sa: false
        },
        time: "",
        currentVolume: 0,
        maxVolume: 0
      },
      {
        name: "",
        dose: 0,
        period: {
          su: false,
          mo: false,
          tu: false,
          we: false,
          th: false,
          fr: false,
          sa: false
        },
        time: "",
        currentVolume: 0,
        maxVolume: 0
      },
      {
        name: "",
        dose: 0,
        period: {
          su: false,
          mo: false,
          tu: false,
          we: false,
          th: false,
          fr: false,
          sa: false
        },
        time: "",
        currentVolume: 0,
        maxVolume: 0
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
    argb: {
      mode: "static",
      static: {
        r: 0,
        g: 0,
        b: 0
      },
      gradient: {
        start: {
          r: 0,
          g: 0,
          b: 0
        },
        end: {
          r: 0,
          g: 0,
          b: 0
        }
      },
      custom: [

      ],
      cycle: {
        speed: 0
      },
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
  logs: "",
  status: Status.Idle,
  logStatus: Status.Idle,
  updateStatus: Status.Idle
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
        state.updateStatus = Status.Loading
      })
      .addCase(getCurrentInfo.fulfilled, (state: IAquarium, action) => {
        state.updateStatus = Status.Succeeded
        state.currentInfo = action.payload
      })

      .addCase(getLogs.pending, (state: IAquarium) => {
        state.logStatus = Status.Loading
      })
      .addCase(getLogs.fulfilled, (state: IAquarium, action) => {
        state.logStatus = Status.Succeeded
        state.logs = action.payload
      })

      .addCase(updateSystem.pending, (state: IAquarium) => {
        state.status = Status.Loading
      })
      .addCase(updateSystem.fulfilled, (state: IAquarium, action) => {
        state.config = action.payload
        state.status = Status.Succeeded
      })

      .addCase(updateCO2.pending, (state: IAquarium) => {
        state.status = Status.Loading
      })
      .addCase(updateCO2.fulfilled, (state: IAquarium, action) => {
        state.config = action.payload
        state.status = Status.Succeeded
      })

      .addCase(updateO2.pending, (state: IAquarium) => {
        state.status = Status.Loading
      })
      .addCase(updateO2.fulfilled, (state: IAquarium, action) => {
        state.config = action.payload
        state.status = Status.Succeeded
      })

      .addCase(updateLight.pending, (state: IAquarium) => {
        state.status = Status.Loading
      })
      .addCase(updateLight.fulfilled, (state: IAquarium, action) => {
        state.config = action.payload
        state.status = Status.Succeeded
      })

      .addCase(updateTemp.pending, (state: IAquarium) => {
        state.status = Status.Loading
      })
      .addCase(updateTemp.fulfilled, (state: IAquarium, action) => {
        state.config = action.payload
        state.status = Status.Succeeded
      })

      .addCase(updateARGB.pending, (state: IAquarium) => {
        state.status = Status.Loading
      })
      .addCase(updateARGB.fulfilled, (state: IAquarium, action) => {
        state.config = action.payload
        state.status = Status.Succeeded
      })

      .addCase(updateDoser.pending, (state: IAquarium) => {
        state.status = Status.Loading
      })
      .addCase(updateDoser.fulfilled, (state: IAquarium, action) => {
        state.config = action.payload
        state.status = Status.Succeeded
      })





      .addCase(updateCO2State.pending, (state: IAquarium) => {
        state.status = Status.Loading
      })
      .addCase(updateCO2State.fulfilled, (state: IAquarium, action) => {
        state.currentInfo.co2.status = action.payload.status
        state.status = Status.Succeeded
      })

      .addCase(updateFilterState.pending, (state: IAquarium) => {
        state.status = Status.Loading
      })
      .addCase(updateFilterState.fulfilled, (state: IAquarium, action) => {
        state.currentInfo.filter.status = action.payload.status
        state.status = Status.Succeeded
      })

      .addCase(updateO2State.pending, (state: IAquarium) => {
        state.status = Status.Loading
      })
      .addCase(updateO2State.fulfilled, (state: IAquarium, action) => {
        state.currentInfo.o2.status = action.payload.status
        state.status = Status.Succeeded
      })

      .addCase(updateLightState.pending, (state: IAquarium) => {
        state.status = Status.Loading
      })
      .addCase(updateLightState.fulfilled, (state: IAquarium, action) => {
        state.currentInfo.light.status = action.payload.status
        state.status = Status.Succeeded
      })

      .addCase(updateTempState.pending, (state: IAquarium) => {
        state.status = Status.Loading
      })
      .addCase(updateTempState.fulfilled, (state: IAquarium, action) => {
        state.currentInfo.temp.status = action.payload.status
        state.status = Status.Succeeded
      })

      .addCase(updateARGBState.pending, (state: IAquarium) => {
        state.status = Status.Loading
      })
      .addCase(updateARGBState.fulfilled, (state: IAquarium, action) => {
        state.currentInfo.argb.status = action.payload.status
        state.status = Status.Succeeded
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

export const getLogs = createAsyncThunk(
  'aquarium/getLogs',

  async () => {
    return await new AquariumService().getLogs()
  })

export const updateSystem = createAsyncThunk<IConfig, { update: number }, { state: RootState }>(

  'aquarium/updateSystem',
  async (payload: { update: number }, { rejectWithValue, getState, dispatch }) => {
    const state = getState()

    const newConfig: IConfig = { ...state.aquarium.config }
    newConfig.system = { ...state.aquarium.config.system }
    newConfig.system.update = payload.update
    const response = await new AquariumService().updateConfig(newConfig)

    if (!response.ok) {
      return rejectWithValue('Can\'t delete post! Server error!')
    }
    return newConfig

  }
)

export const updateCO2 = createAsyncThunk<IConfig, { on: string, off: string }, { state: RootState }>(

  'aquarium/updateCO2',
  async (payload: { on: string, off: string }, { rejectWithValue, getState, dispatch }) => {
    const state = getState()

    const newConfig: IConfig = { ...state.aquarium.config }
    newConfig.co2 = { ...state.aquarium.config.co2 }
    newConfig.co2.on = payload.on
    newConfig.co2.off = payload.off
    const response = await new AquariumService().updateConfig(newConfig)

    if (!response.ok) {
      return rejectWithValue('Can\'t delete post! Server error!')
    }
    return newConfig

  }
)

export const updateO2 = createAsyncThunk<IConfig, { on: string, off: string }, { state: RootState }>(

  'aquarium/updateO2',
  async (payload: { on: string, off: string }, { rejectWithValue, getState, dispatch }) => {
    const state = getState()

    const newConfig: IConfig = { ...state.aquarium.config }
    newConfig.o2 = { ...state.aquarium.config.o2 }
    newConfig.o2.on = payload.on
    newConfig.o2.off = payload.off
    const response = await new AquariumService().updateConfig(newConfig)

    if (!response.ok) {
      return rejectWithValue('Can\'t delete post! Server error!')
    }
    return newConfig

  }
)

export const updateLight = createAsyncThunk<IConfig, { on: string, off: string }, { state: RootState }>(

  'aquarium/updateLight',
  async (payload: { on: string, off: string }, { rejectWithValue, getState, dispatch }) => {
    const state = getState()

    const newConfig: IConfig = { ...state.aquarium.config }
    newConfig.light = { ...state.aquarium.config.light }
    newConfig.light.on = payload.on
    newConfig.light.off = payload.off
    const response = await new AquariumService().updateConfig(newConfig)

    if (!response.ok) {
      return rejectWithValue('Can\'t delete post! Server error!')
    }
    return newConfig

  }
)

export const updateTemp = createAsyncThunk<IConfig, ITemp, { state: RootState }>(

  'aquarium/updateTemp',
  async (payload: ITemp, { rejectWithValue, getState, dispatch }) => {
    const state = getState()

    const newConfig: IConfig = { ...state.aquarium.config }
    newConfig.temp = { ...state.aquarium.config.temp }
    newConfig.temp.setting = payload.setting
    newConfig.temp.k = payload.k
    newConfig.temp.hysteresis = payload.hysteresis
    newConfig.temp.timeout = payload.timeout
    const response = await new AquariumService().updateConfig(newConfig)

    if (!response.ok) {
      return rejectWithValue('Can\'t delete post! Server error!')
    }
    return newConfig

  }
)

export const updateARGB = createAsyncThunk<IConfig, IARGB, { state: RootState }>(

  'aquarium/updateARGB',
  async (payload: IARGB, { rejectWithValue, getState, dispatch }) => {
    const state = getState()

    const newConfig: IConfig = { ...state.aquarium.config }
    newConfig.argb = { ...state.aquarium.config.argb }
    newConfig.argb.mode = payload.mode
    newConfig.argb.on = payload.on
    newConfig.argb.off = payload.off
    newConfig.argb.static = payload.static
    newConfig.argb.gradient = payload.gradient
    newConfig.argb.custom = payload.custom
    newConfig.argb.cycle = { ...state.aquarium.config.argb.cycle }
    newConfig.argb.cycle.speed = payload.cycle.speed
    const response = await new AquariumService().updateConfig(newConfig)

    if (!response.ok) {
      return rejectWithValue('Can\'t delete post! Server error!')
    }
    return newConfig

  }
)

export const updateDoser = createAsyncThunk<IConfig, { number: number, config: IPumpConfig }, { state: RootState }>(

  'aquarium/updateDoser',
  async (payload: { number: number, config: IPumpConfig }, { rejectWithValue, getState, dispatch }) => {
    const state = getState()

    const newConfig: IConfig = { ...state.aquarium.config }
    newConfig.doser = { ...state.aquarium.config.doser }
    newConfig.doser[payload.number] = { ...state.aquarium.config.doser[payload.number] }
    newConfig.doser[payload.number].name = payload.config.name
    newConfig.doser[payload.number].dose = payload.config.dose
    newConfig.doser[payload.number].time = payload.config.time
    newConfig.doser[payload.number].currentVolume = payload.config.currentVolume
    newConfig.doser[payload.number].maxVolume = payload.config.maxVolume
    newConfig.doser[payload.number].period = payload.config.period

    const response = await new AquariumService().updateConfig(newConfig)

    if (!response.ok) {
      return rejectWithValue('Can\'t delete post! Server error!')
    }
    return newConfig

  }
)

export const updateCO2State = createAsyncThunk<{ status: boolean }, boolean, { state: RootState }>(

  'aquarium/updateCO2State',
  async (payload: boolean, { rejectWithValue, getState, dispatch }) => {

    const newCO2State = { status: payload };
    const response = await new AquariumService().updateCO2(newCO2State)

    if (!response.ok) {
      return rejectWithValue('Can\'t delete post! Server error!')
    }
    return newCO2State

  }
)

export const updateFilterState = createAsyncThunk<{ status: boolean }, boolean, { state: RootState }>(

  'aquarium/updateFilterState',
  async (payload: boolean, { rejectWithValue, getState, dispatch }) => {

    const newFilterState = { status: payload };
    const response = await new AquariumService().updateFilter(newFilterState)

    if (!response.ok) {
      return rejectWithValue('Can\'t delete post! Server error!')
    }
    return newFilterState

  }
)

export const updateO2State = createAsyncThunk<{ status: boolean }, boolean, { state: RootState }>(

  'aquarium/updateO2State',
  async (payload: boolean, { rejectWithValue, getState, dispatch }) => {

    const newO2State = { status: payload };
    const response = await new AquariumService().updateO2(newO2State)

    if (!response.ok) {
      return rejectWithValue('Can\'t delete post! Server error!')
    }
    return newO2State

  }
)

export const updateLightState = createAsyncThunk<{ status: boolean }, boolean, { state: RootState }>(

  'aquarium/updateLightState',
  async (payload: boolean, { rejectWithValue, getState, dispatch }) => {

    const newLightState = { status: payload };
    const response = await new AquariumService().updateLight(newLightState)

    if (!response.ok) {
      return rejectWithValue('Can\'t delete post! Server error!')
    }
    return newLightState

  }
)

export const updateTempState = createAsyncThunk<{ status: boolean }, boolean, { state: RootState }>(

  'aquarium/updateTempState',
  async (payload: boolean, { rejectWithValue, getState, dispatch }) => {

    const newTempState = { status: payload };
    const response = await new AquariumService().updateTemp(newTempState)

    if (!response.ok) {
      return rejectWithValue('Can\'t delete post! Server error!')
    }
    return newTempState

  }
)

export const updateARGBState = createAsyncThunk<{ status: boolean }, boolean, { state: RootState }>(

  'aquarium/updateARGBState',
  async (payload: boolean, { rejectWithValue, getState, dispatch }) => {

    const newARGBState = { status: payload };
    const response = await new AquariumService().updateARGB(newARGBState)

    if (!response.ok) {
      return rejectWithValue('Can\'t delete post! Server error!')
    }
    return newARGBState

  }
)

export default AquariumSlice.reducer