import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { LogEntry, parseLogs } from "shared/lib/logs"
import { Status } from "../models/Status"
import AquariumService from "../services/AquariumService"
import { RootState } from "./store"
import {
  IAquariumConfig,
  IARGB,
  IARGBStatusInfo,
  IConfig,
  ICurrentInfo,
  IDoserConfig,
  IDoserStateItem,
  IPumpConfig,
  IPumpPeriod,
  IPumpStatus,
  IPunpInfo,
  IRelay,
  IRelaysConfig,
  IRGB,
  ISafetyInfo,
  IStatusInfo,
  ISystem,
  ISystemInfo,
  ITemp,
  ITempStatusInfo,
  ITimeInfo,
  RelaySubtype,
} from "./aquariumTypes"

export type {
  IAquariumConfig,
  IARGB,
  IARGBStatusInfo,
  IConfig,
  ICurrentInfo,
  IDoserConfig,
  IDoserStateItem,
  IPumpConfig,
  IPumpPeriod,
  IPumpStatus,
  IPunpInfo,
  IRelay,
  IRelaysConfig,
  IRGB,
  ISafetyInfo,
  IStatusInfo,
  ISystem,
  ISystemInfo,
  ITemp,
  ITempStatusInfo,
  ITimeInfo,
  RelaySubtype,
}

type RelayUpdatePayload = { subtype: RelaySubtype, relay: IRelay }
type DoserUpdatePayload = { number: number, config: IPumpConfig }

interface ILogs {
  system: LogEntry[]
  relay: LogEntry[]
  doser: LogEntry[]
}

interface IAquarium {
  currentInfo: ICurrentInfo
  config: IAquariumConfig
  doserState: IDoserStateItem[]
  safety: ISafetyInfo
  logs: ILogs
  status: Status
  logStatus: Status
  updateStatus: Status
  modal: boolean
  lastSuccess: number
}

const emptyPeriod = (): IPumpPeriod => ({
  su: false,
  mo: false,
  tu: false,
  we: false,
  th: false,
  fr: false,
  sa: false,
})

const emptyDoserConfig = (name: string): IDoserConfig => ({
  name,
  period: emptyPeriod(),
  time: "",
  currentVolume: 0,
  maxVolume: 0,
  mode: 0,
  dosage: 0,
  rate: 0,
})

const emptyRelay = (name: string): IRelay => ({
  name,
  on: "null",
  off: "null",
  mode: 0,
})

const initialState: IAquarium = {
  currentInfo: {
    system: {
      time: {
        year: 0,
        month: 0,
        day: 0,
        dayOfWeek: "",
        hour: 0,
        minute: 0,
        second: 0,
      },
      chipTemp: 0,
      fan: 0,
      uptime: 0,
      totalSpace: 0,
      usedSpace: 0,
      freeSpace: 0,
      outside: {
        temp: 0,
        hum: 0,
      },
      freeHeap: 0,
      heapSize: 0,
      frequency: 0,
    },
    doser: [
      { status: false, introduced: 0 },
      { status: false, introduced: 0 },
      { status: false, introduced: 0 },
      { status: false, introduced: 0 },
    ],
    co2: { status: false },
    o2: { status: false },
    light: { status: false },
    argb: { status: false },
    temp: {
      status: 3,
      current: 0,
      cool: false,
      heat: false,
    },
    filter: { status: false },
    safety: {
      emergencyMode: false,
      emergencyOverride: false,
      rtcValid: false,
      restoreAvailable: false,
      activeReasons: [],
    },
  },
  config: {
    system: {
      name: "System",
      update: 1,
      pwm: 30,
    },
    doser: [
      emptyDoserConfig("Pump 1"),
      emptyDoserConfig("Pump 2"),
      emptyDoserConfig("Pump 3"),
      emptyDoserConfig("Pump 4"),
    ],
    relays: {
      co2: emptyRelay("CO2 System"),
      o2: emptyRelay("O2 System"),
      light: emptyRelay("Light Cooling"),
      filter: emptyRelay("Filtering"),
    },
    argb: {
      name: "Backlighting",
      mode: 0,
      style: 0,
      brightness: 0,
      static: { r: 0, g: 0, b: 0 },
      gradient: {
        start: { r: 0, g: 0, b: 0 },
        end: { r: 0, g: 0, b: 0 },
      },
      custom: [],
      cycle: { speed: 0 },
      on: "null",
      off: "null",
    },
    temp: {
      name: "Termostat",
      setting: 0,
      hysteresis: 0,
      k: 0,
      timeout: 0,
      mode: 0,
    },
  },
  doserState: [
    { id: 0, lastRunYmd: "" },
    { id: 1, lastRunYmd: "" },
    { id: 2, lastRunYmd: "" },
    { id: 3, lastRunYmd: "" },
  ],
  safety: {
    emergencyMode: false,
    emergencyOverride: false,
    rtcValid: false,
    restoreAvailable: false,
    activeReasons: [],
  },
  logs: {
    system: [],
    relay: [],
    doser: [],
  },
  status: Status.Idle,
  logStatus: Status.Idle,
  updateStatus: Status.Idle,
  modal: false,
  lastSuccess: Date.now(),
}

function todayYmd(state: IAquarium): string {
  const { year, month, day } = state.currentInfo.system.time
  if (!year || !month || !day) return ""
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
}

function isPumpMarkedToday(state: IAquarium, index: number): boolean {
  const today = todayYmd(state)
  if (!today) return false
  return state.doserState[index]?.lastRunYmd === today
}

const AquariumSlice = createSlice({
  name: "aquarium",
  initialState,
  reducers: {
    switchModal(state, action: PayloadAction<boolean>) {
      state.modal = action.payload
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getConfig.pending, (state) => {
        state.status = Status.Loading
      })
      .addCase(getConfig.fulfilled, (state, action) => {
        state.status = Status.Succeeded
        state.config = action.payload.config
        state.doserState = action.payload.doserState
      })
      .addCase(getConfig.rejected, (state) => {
        state.status = Status.Failed
      })

      .addCase(getCurrentInfo.pending, (state) => {
        state.updateStatus = Status.Loading
      })
      .addCase(getCurrentInfo.fulfilled, (state, action) => {
        state.updateStatus = Status.Succeeded
        state.currentInfo = action.payload
        state.safety = action.payload.safety ?? state.safety
        state.lastSuccess = Date.now()
      })
      .addCase(getCurrentInfo.rejected, (state) => {
        state.updateStatus = Status.Failed
      })

      .addCase(getSystemLogs.pending, (state) => {
        state.logStatus = Status.Loading
      })
      .addCase(getSystemLogs.fulfilled, (state, action) => {
        state.logs.system = parseLogs(action.payload, "system")
        state.logStatus = Status.Succeeded
      })
      .addCase(getRelayLogs.pending, (state) => {
        state.logStatus = Status.Loading
      })
      .addCase(getRelayLogs.fulfilled, (state, action) => {
        state.logs.relay = parseLogs(action.payload, "relay")
        state.logStatus = Status.Succeeded
      })
      .addCase(getDoserLogs.pending, (state) => {
        state.logStatus = Status.Loading
      })
      .addCase(getDoserLogs.fulfilled, (state, action) => {
        state.logs.doser = parseLogs(action.payload, "doser")
        state.logStatus = Status.Succeeded
      })

      .addCase(clearSystemLogs.pending, (state) => {
        state.logStatus = Status.Loading
      })
      .addCase(clearSystemLogs.fulfilled, (state) => {
        state.logStatus = Status.Succeeded
        state.logs.system = []
      })
      .addCase(clearRelayLogs.pending, (state) => {
        state.logStatus = Status.Loading
      })
      .addCase(clearRelayLogs.fulfilled, (state) => {
        state.logStatus = Status.Succeeded
        state.logs.relay = []
      })
      .addCase(clearDoserLogs.pending, (state) => {
        state.logStatus = Status.Loading
      })
      .addCase(clearDoserLogs.fulfilled, (state) => {
        state.logStatus = Status.Succeeded
        state.logs.doser = []
      })

      .addCase(updateSystem.pending, (state) => {
        state.status = Status.Loading
      })
      .addCase(updateSystem.fulfilled, (state, action) => {
        state.config.system = action.payload
        state.status = Status.Succeeded
      })

      .addCase(updateDateTime.fulfilled, (state, action) => {
        state.currentInfo.system.time = action.payload.system.time
      })

      .addCase(updateFanSpeed.pending, (state) => {
        state.status = Status.Loading
      })
      .addCase(updateFanSpeed.fulfilled, (state, action) => {
        state.config.system = action.payload
        state.status = Status.Succeeded
      })

      .addCase(updateRelay.pending, (state) => {
        state.status = Status.Loading
      })
      .addCase(updateRelay.fulfilled, (state, action) => {
        state.config.relays[action.payload.subtype] = action.payload.relay
        state.status = Status.Succeeded
      })

      .addCase(updateCO2.fulfilled, (state, action) => {
        state.config.relays.co2 = action.payload
        state.status = Status.Succeeded
      })
      .addCase(updateFilter.fulfilled, (state, action) => {
        state.config.relays.filter = action.payload
        state.status = Status.Succeeded
      })
      .addCase(updateO2.fulfilled, (state, action) => {
        state.config.relays.o2 = action.payload
        state.status = Status.Succeeded
      })
      .addCase(updateLight.fulfilled, (state, action) => {
        state.config.relays.light = action.payload
        state.status = Status.Succeeded
      })

      .addCase(updateTemp.pending, (state) => {
        state.status = Status.Loading
      })
      .addCase(updateTemp.fulfilled, (state, action) => {
        state.config.temp = action.payload
        state.status = Status.Succeeded
      })

      .addCase(updateARGB.pending, (state) => {
        state.status = Status.Loading
      })
      .addCase(updateARGB.fulfilled, (state, action) => {
        state.config.argb = action.payload
        state.status = Status.Succeeded
      })

      .addCase(updateDoser.pending, (state) => {
        state.status = Status.Loading
      })
      .addCase(updateDoser.fulfilled, (state, action) => {
        state.config.doser[action.payload.number] = action.payload.config
        state.status = Status.Succeeded
      })

      .addCase(resetPump.pending, (state) => {
        state.status = Status.Loading
      })
      .addCase(resetPump.fulfilled, (state, action) => {
        const item = action.payload
        const index = state.doserState.findIndex((stateItem) => stateItem.id === item.id)

        if (index >= 0) {
          state.doserState[index] = item
        } else {
          state.doserState.push(item)
        }

        state.status = Status.Succeeded
      })

      .addCase(getSafety.fulfilled, (state, action) => {
        state.safety = action.payload
        state.currentInfo.safety = action.payload
      })
      .addCase(enterEmergencyMode.pending, (state) => {
        state.status = Status.Loading
      })
      .addCase(enterEmergencyMode.fulfilled, (state, action) => {
        state.safety = action.payload
        state.currentInfo.safety = action.payload
        state.status = Status.Succeeded
      })
      .addCase(clearEmergencyMode.pending, (state) => {
        state.status = Status.Loading
      })
      .addCase(clearEmergencyMode.fulfilled, (state, action) => {
        state.safety = action.payload
        state.currentInfo.safety = action.payload
        state.status = Status.Succeeded
      })
      .addCase(clearEmergencyOverride.pending, (state) => {
        state.status = Status.Loading
      })
      .addCase(clearEmergencyOverride.fulfilled, (state, action) => {
        state.safety = action.payload
        state.currentInfo.safety = action.payload
        state.status = Status.Succeeded
      })
  },
})

export const getMetrics = createAsyncThunk(
  "metrics/getMetrics",
  async (params: { metric: string, year: number, month: number, day: number }, thunkAPI) => {
    try {
      const service = new AquariumService()
      const csv = await service.getMetrics(params)
      return { metric: params.metric, points: service.parseMetricsCSV(csv) }
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e?.message ?? "Failed to fetch metrics")
    }
  }
)

export const getCurrentInfo = createAsyncThunk("aquarium/getCurrentInfo", async () => {
  return await new AquariumService().getCurrentInfo()
})

export const getConfig = createAsyncThunk("aquarium/getConfig", async () => {
  const service = new AquariumService()
  const [config, doserState] = await Promise.all([
    service.getConfig(),
    service.getDoserState(),
  ])

  return { config, doserState }
})

export const getSystemLogs = createAsyncThunk("aquarium/getSystemLogs", async () => {
  return await new AquariumService().getSystemLogs()
})
export const getRelayLogs = createAsyncThunk("aquarium/getRelayLogs", async () => {
  return await new AquariumService().getRelayLogs()
})
export const getDoserLogs = createAsyncThunk("aquarium/getDoserLogs", async () => {
  return await new AquariumService().getDoserLogs()
})
export const clearSystemLogs = createAsyncThunk("aquarium/clearSystemLogs", async () => {
  return await new AquariumService().clearSystemLogs()
})
export const clearRelayLogs = createAsyncThunk("aquarium/clearRelayLogs", async () => {
  return await new AquariumService().clearRelayLogs()
})
export const clearDoserLogs = createAsyncThunk("aquarium/clearDoserLogs", async () => {
  return await new AquariumService().clearDoserLogs()
})

export const updateSystem = createAsyncThunk<ISystem, { update: number }, { state: RootState }>(
  "aquarium/updateSystem",
  async (payload, { rejectWithValue, getState }) => {
    try {
      const current = getState().aquarium.config.system
      return await new AquariumService().updateSystemConfig({ ...current, update: payload.update })
    } catch (e: any) {
      return rejectWithValue(e?.message || "System update failed")
    }
  }
)

export const updateDateTime = createAsyncThunk<ICurrentInfo, { dateTime: ITimeInfo }, { state: RootState }>(
  "aquarium/updateDateTime",
  async (payload, { rejectWithValue }) => {
    try {
      const service = new AquariumService()
      const response = await service.updateDateTime(payload.dateTime)
      if (!response.ok) return rejectWithValue("Date/time update failed")
      return await service.getCurrentInfo()
    } catch (e: any) {
      return rejectWithValue(e?.message || "Date/time update failed")
    }
  }
)

export const updateFanSpeed = createAsyncThunk<ISystem, number, { state: RootState }>(
  "aquarium/updateFanSpeed",
  async (payload, { rejectWithValue, getState }) => {
    try {
      const current = getState().aquarium.config.system
      return await new AquariumService().updateSystemConfig({ ...current, pwm: payload })
    } catch (e: any) {
      return rejectWithValue(e?.message || "Fan update failed")
    }
  }
)

export const updateRelay = createAsyncThunk<{ subtype: RelaySubtype, relay: IRelay }, RelayUpdatePayload, { state: RootState }>(
  "aquarium/updateRelay",
  async (payload, { rejectWithValue }) => {
    try {
      const relay = await new AquariumService().updateRelayConfig(payload.subtype, payload.relay)
      return { subtype: payload.subtype, relay }
    } catch (e: any) {
      return rejectWithValue(e?.message || "Relay update failed")
    }
  }
)

export const updateCO2 = createAsyncThunk<IRelay, IRelay, { state: RootState }>(
  "aquarium/updateCO2",
  async (payload, { rejectWithValue }) => {
    try {
      return await new AquariumService().updateRelayConfig("co2", payload)
    } catch (e: any) {
      return rejectWithValue(e?.message || "CO2 update failed")
    }
  }
)

export const updateFilter = createAsyncThunk<IRelay, IRelay, { state: RootState }>(
  "aquarium/updateFilter",
  async (payload, { rejectWithValue }) => {
    try {
      return await new AquariumService().updateRelayConfig("filter", payload)
    } catch (e: any) {
      return rejectWithValue(e?.message || "Filter update failed")
    }
  }
)

export const updateO2 = createAsyncThunk<IRelay, IRelay, { state: RootState }>(
  "aquarium/updateO2",
  async (payload, { rejectWithValue }) => {
    try {
      return await new AquariumService().updateRelayConfig("o2", payload)
    } catch (e: any) {
      return rejectWithValue(e?.message || "O2 update failed")
    }
  }
)

export const updateLight = createAsyncThunk<IRelay, IRelay, { state: RootState }>(
  "aquarium/updateLight",
  async (payload, { rejectWithValue }) => {
    try {
      return await new AquariumService().updateRelayConfig("light", payload)
    } catch (e: any) {
      return rejectWithValue(e?.message || "Light update failed")
    }
  }
)

export const updateTemp = createAsyncThunk<ITemp, ITemp, { state: RootState }>(
  "aquarium/updateTemp",
  async (payload, { rejectWithValue }) => {
    try {
      return await new AquariumService().updateTempConfig(payload)
    } catch (e: any) {
      return rejectWithValue(e?.message || "Temp update failed")
    }
  }
)

export const updateARGB = createAsyncThunk<IARGB, IARGB, { state: RootState }>(
  "aquarium/updateARGB",
  async (payload, { rejectWithValue }) => {
    try {
      return await new AquariumService().updateArgbConfig(payload)
    } catch (e: any) {
      return rejectWithValue(e?.message || "ARGB update failed")
    }
  }
)

export const updateDoser = createAsyncThunk<{ number: number, config: IDoserConfig }, DoserUpdatePayload, { state: RootState }>(
  "aquarium/updateDoser",
  async (payload, { rejectWithValue }) => {
    try {
      const { hasRunToday, status, ...configPatch } = payload.config
      const config = await new AquariumService().updateDoserConfig(payload.number, configPatch)
      return { number: payload.number, config }
    } catch (e: any) {
      return rejectWithValue(e?.message || "Doser update failed")
    }
  }
)

export const resetPump = createAsyncThunk<IDoserStateItem, { number: number }, { state: RootState }>(
  "aquarium/resetPump",
  async (payload, { rejectWithValue, getState }) => {
    try {
      const service = new AquariumService()
      const state = getState().aquarium
      if (isPumpMarkedToday(state, payload.number)) {
        return await service.resetDoserLastRun(payload.number)
      }
      return await service.markDoserRunToday(payload.number)
    } catch (e: any) {
      return rejectWithValue(e?.message || "Doser state update failed")
    }
  }
)

export const getSafety = createAsyncThunk<ISafetyInfo>(
  "aquarium/getSafety",
  async (_, { rejectWithValue }) => {
    try {
      return await new AquariumService().getSafety()
    } catch (e: any) {
      return rejectWithValue(e?.message || "Safety state fetch failed")
    }
  }
)

export const enterEmergencyMode = createAsyncThunk<ISafetyInfo>(
  "aquarium/enterEmergencyMode",
  async (_, { rejectWithValue }) => {
    try {
      return await new AquariumService().enterEmergencyMode()
    } catch (e: any) {
      return rejectWithValue(e?.message || "Emergency mode enable failed")
    }
  }
)

export const clearEmergencyMode = createAsyncThunk<ISafetyInfo>(
  "aquarium/clearEmergencyMode",
  async (_, { rejectWithValue }) => {
    try {
      return await new AquariumService().clearEmergencyMode()
    } catch (e: any) {
      return rejectWithValue(e?.message || "Emergency mode clear failed")
    }
  }
)

export const clearEmergencyOverride = createAsyncThunk<ISafetyInfo>(
  "aquarium/clearEmergencyOverride",
  async (_, { rejectWithValue }) => {
    try {
      return await new AquariumService().clearEmergencyOverride()
    } catch (e: any) {
      return rejectWithValue(e?.message || "Emergency override clear failed")
    }
  }
)

export const { switchModal } = AquariumSlice.actions

export default AquariumSlice.reducer
