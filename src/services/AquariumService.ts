export default class AquariumService {
  _apiBase: string
  _apiSettings: string
  constructor() {
    this._apiBase = "http://192.168.0.110"
    this._apiSettings = "settings"
  }

  getSettings = async () => {
    const response = await fetch(`${this._apiBase}/${this._apiSettings}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    return await response.json()
  }
}