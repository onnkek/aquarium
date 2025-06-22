import { IConfig } from "redux/AquariumSlice"

export default class AquariumService {

  _apiBase: string
  _apiCurrent: string
  _apiConfig: string
  _apiCO2: string
  _apiFilter: string
  _apiO2: string
  _apiLight: string
  _apiTemp: string
  _apiARGB: string

  constructor() {
    this._apiBase = "http://192.168.0.110"
    this._apiConfig = "config"
    this._apiCurrent = "current"
    this._apiCO2 = "co2"
    this._apiFilter = "filter"
    this._apiO2 = "o2"
    this._apiLight = "light"
    this._apiTemp = "temp"
    this._apiARGB = "argb"
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