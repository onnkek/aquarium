export default class AquariumService {
  _apiBase: string
  _apiChipTemp: string
  _apiFSInfo: string

  constructor() {
    this._apiBase = "http://192.168.0.110"
    this._apiChipTemp = "temp"
    this._apiFSInfo = "fs"
  }

  getChipTemp = async () => {
    const response = await fetch(`${this._apiBase}/${this._apiChipTemp}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    return await response.json()
  }
  getFSInfo = async () => {
    const response = await fetch(`${this._apiBase}/${this._apiFSInfo}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    return await response.json()
  }
}