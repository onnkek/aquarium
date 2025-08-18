import { IConfig, ITimeInfo } from "redux/AquariumSlice"

export default class AquariumService {

  _apiBase: string
  _apiCurrent: string
  _apiConfig: string
  _apiLogs: string
  _apiSystemLogs: string
  _apiRelayLogs: string
  _apiDoserLogs: string
  _apiClearLogs: string
  _apiCO2: string
  _apiFilter: string
  _apiO2: string
  _apiLight: string
  _apiTemp: string
  _apiARGB: string
  _apiDoser: string
  _apiDateTime: string


  constructor() {
    this._apiBase = "http://192.168.1.110"
    this._apiConfig = "config"
    this._apiCurrent = "current"
    this._apiLogs = "logs"
    this._apiCO2 = "co2"
    this._apiFilter = "filter"
    this._apiO2 = "o2"
    this._apiLight = "light"
    this._apiTemp = "temp"
    this._apiARGB = "argb"
    this._apiDoser = "doser"
    this._apiDateTime = "time"
    this._apiSystemLogs = "system"
    this._apiRelayLogs = "relay"
    this._apiDoserLogs = "doser"
    this._apiClearLogs = "clear"
  }

  getCurrentInfo = async () => {
    const response = await fetch(`${this._apiBase}/${this._apiCurrent}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
    })
    return await response.json()
  }
  getConfig = async () => {
    const response = await fetch(`${this._apiBase}/${this._apiConfig}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
    })
    return await response.json()
  }
  getSystemLogs = async () => {
    const response = await fetch(`${this._apiBase}/${this._apiLogs}/${this._apiSystemLogs}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
    })
    return await response.text()
  }
  getRelayLogs = async () => {
    const response = await fetch(`${this._apiBase}/${this._apiLogs}/${this._apiRelayLogs}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
    })
    return await response.text()
  }
  getDoserLogs = async () => {
    const response = await fetch(`${this._apiBase}/${this._apiLogs}/${this._apiDoserLogs}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
    })
    return await response.text()
  }
  clearSystemLogs = async () => {
    const response = await fetch(`${this._apiBase}/${this._apiLogs}/${this._apiSystemLogs}/${this._apiClearLogs}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
    })
    return await response.text()
  }
  clearRelayLogs = async () => {
    const response = await fetch(`${this._apiBase}/${this._apiLogs}/${this._apiRelayLogs}/${this._apiClearLogs}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
    })
    return await response.text()
  }
  clearDoserLogs = async () => {
    const response = await fetch(`${this._apiBase}/${this._apiLogs}/${this._apiDoserLogs}/${this._apiClearLogs}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
    })
    return await response.text()
  }
  updateDateTime = async (dateTime: ITimeInfo) => {
    const response = await fetch(`${this._apiBase}/${this._apiDateTime}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(dateTime)
    })
    return await response
  }
  updateConfig = async (data: IConfig) => {
    const response = await fetch(`${this._apiBase}/${this._apiConfig}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
    return await response
  }
  updateCO2 = async (data: { status: boolean }) => {
    const response = await fetch(`${this._apiBase}/${this._apiCurrent}/${this._apiCO2}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
    return await response
  }

  updateFilter = async (data: { status: boolean }) => {
    const response = await fetch(`${this._apiBase}/${this._apiCurrent}/${this._apiFilter}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
    return await response
  }

  updateO2 = async (data: { status: boolean }) => {
    const response = await fetch(`${this._apiBase}/${this._apiCurrent}/${this._apiO2}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
    return await response
  }

  updateLight = async (data: { status: boolean }) => {
    const response = await fetch(`${this._apiBase}/${this._apiCurrent}/${this._apiLight}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
    return await response
  }

  updateTemp = async (data: { status: boolean }) => {
    const response = await fetch(`${this._apiBase}/${this._apiCurrent}/${this._apiTemp}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
    return await response
  }

  updateARGB = async (data: { status: boolean }) => {
    const response = await fetch(`${this._apiBase}/${this._apiCurrent}/${this._apiARGB}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
    return await response
  }
}