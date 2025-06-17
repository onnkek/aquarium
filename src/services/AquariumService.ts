export default class AquariumService {

  _apiBase: string
  _apiCurrentInfo: string
  _apiConfig: string

  constructor() {
    this._apiBase = "http://192.168.0.110"
    this._apiConfig = "config"
    this._apiCurrentInfo = "current"
  }

  getCurrentInfo = async () => {
    const response = await fetch(`${this._apiBase}/${this._apiCurrentInfo}`, {
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
}