export type RelaySubtype = "light" | "co2" | "o2" | "filter"

export interface ITimeInfo {
  year: number
  month: number
  day: number
  dayOfWeek: string
  hour: number
  minute: number
  second: number
}

export interface IOutside {
  temp: number
  hum: number
}

export interface ISystemInfo {
  time: ITimeInfo
  fan: number
  chipTemp: number
  uptime: number
  totalSpace: number
  usedSpace: number
  freeSpace: number
  outside: IOutside
  freeHeap: number
  minFreeHeap?: number
  heapSize: number
  largestFreeBlock?: number
  frequency?: number
}

export interface IStatusInfo {
  status: boolean
}

export interface IPunpInfo {
  id?: number
  status: boolean
  running?: boolean
  introduced: number
}

export interface ITempStatusInfo {
  status: number
  current: number
  cool: boolean
  heat: boolean
}

export interface IARGBStatusInfo {
  status: boolean
}

export interface ISafetyInfo {
  emergencyMode: boolean
  emergencyOverride: boolean
  rtcValid: boolean
  restoreAvailable?: boolean
  activeReasons?: string[]
}

export interface ICurrentInfo {
  system: ISystemInfo
  doser: IPunpInfo[]
  co2: IStatusInfo
  o2: IStatusInfo
  light: IStatusInfo
  filter: IStatusInfo
  argb: IARGBStatusInfo
  temp: ITempStatusInfo
  safety?: ISafetyInfo
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

export interface IDoserConfig {
  name: string
  dosage: number
  rate: number
  period: IPumpPeriod
  time: string
  currentVolume: number
  maxVolume: number
  mode: number
}

// UI view-model for existing pump settings/card components.
// Persistent backend config does NOT contain these fields.
export interface IPumpConfig extends IDoserConfig {
  hasRunToday: boolean
  status?: number
}

export interface IDoserStateItem {
  id: number
  lastRunYmd: string
}

export interface IPumpStatus {
  status: number
}

export interface IRelay {
  name: string
  on: string
  off: string
  mode: number
}

export type IRelaysConfig = Record<RelaySubtype, IRelay>

export interface IRGB {
  r: number
  g: number
  b: number
}

export interface IARGBGradient {
  start: IRGB
  end: IRGB
}

export interface IARGBCycle {
  speed: number
}

export interface IARGB {
  name: string
  mode: number
  style: number
  brightness: number
  static: IRGB
  gradient: IARGBGradient
  custom: IRGB[]
  cycle: IARGBCycle
  on: string
  off: string
}

export interface ITemp {
  name: string
  setting: number
  hysteresis: number
  k: number
  timeout: number
  mode: number
}

export interface ISystem {
  name: string
  update: number
  pwm: number
}

export interface IAquariumConfig {
  system: ISystem
  doser: IDoserConfig[]
  relays: IRelaysConfig
  argb: IARGB
  temp: ITemp
}

// Compatibility alias for code that imports IConfig from AquariumSlice.
// The shape is now split: relays live in config.relays, not config.co2/o2/filter/light.
export type IConfig = IAquariumConfig
