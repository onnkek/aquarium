
export default class WeatherService {
  constructor () {
    this._apiBase = "https://api.openweathermap.org/data/2.5/weather"
    this._appid = "ecc751a2b1db7db3abe055ebfbabbc26"
    this._units = "metric"
    this._q = "yekaterinburg"
  }

  getWeather = async (city) => {
    const response = await fetch(`${this._apiBase}?appid=${this._appid}&q=${city}&units=${this._units}`, {
      method: "GET",
      headers: {
      },
    })
    return await response.json()
  }
}