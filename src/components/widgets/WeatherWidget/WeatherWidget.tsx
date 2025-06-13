import React, { ChangeEvent, useEffect, useState } from "react"
import "./WeatherWidget.sass"
import { Status } from "../../../models/Status"
import { useAppDispatch, useAppSelector } from "../../../models/Hook"
import { getWeather } from "../../../redux/WeatherSlice"
import Spinner from "../../UI/Spinner/Spinner"
import { CheckLg, GearFill, GeoAltFill } from "react-bootstrap-icons"
import { getWeatherIcon } from "../../../utils/iconsSelectors"
import { getWidgets, IWidget, updateWeatherWidget } from "../../../redux/WidgetsSlice"
import { getSettings } from "../../../redux/SettingsSlice"

interface WeatherWidgetProps {
  widget: IWidget | undefined
}


const WeatherWidget = React.memo(({ widget }: WeatherWidgetProps) => {
  const dispatch = useAppDispatch()
  const status = useAppSelector(state => state.weather.status)
  const weathers = useAppSelector(state => state.weather.weather)
  const edit = useAppSelector(state => state.widgets.edit)
  const [settings, setSettings] = useState(false)
  const [selectCity, setSelectCity] = useState(widget?.city)
  useEffect(() => {
    if (status === Status.Idle) {
      // dispatch(getWidgets())
      dispatch(getWeather(selectCity!))
    }
  }, [status, dispatch])
  const editHandler = () => {
    setSettings(true)
  }
  const saveHandler = () => {
    setSelectCity(selectCity)
    dispatch(updateWeatherWidget({ widgetId: widget!.id, city: selectCity! }))

    dispatch(getWeather(selectCity!))

    setSettings(false)
  }
  const changeCityHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectCity(e.target.value)
  }

  const weather = weathers.find(x => x.name?.toLowerCase() === selectCity?.toLowerCase())

  return (
    <div className="weatherWidget">
      {status === Status.Loading && <Spinner />}
      {status === Status.Succeeded && (
        settings ? (
          <>
            <div>
              <label className="form-label">
                City name
              </label>
              <input
                type="text"
                name="link"
                className="form-control add-form-date"
                value={selectCity}
                onChange={changeCityHandler}
              />
            </div>
            {edit && <button className="widget__settings" onClick={saveHandler}><CheckLg /></button>}
          </>
        ) : (
          <>
            <div className="weatherWidget__header">
              <div className="weatherWidget__header-city">{weather && weather.name && weather.name}</div>
              <GeoAltFill className="weatherWidget__header-icon" />
            </div>
            <div className="weatherWidget__body">
              <div className="weatherWidget__left">
                {weather && weather.weather && weather.weather[0].icon && <img draggable="false" className="weatherWidget__body-icon" src={getWeatherIcon(weather.weather[0].icon)} />}
              </div>
              <div className="weatherWidget__right">
                <div className="weatherWidget__temp-container">
                  <div className="weatherWidget__temp">{weather && weather.main && weather.main.temp && Math.round(weather.main.temp)}</div>
                  <div className="weatherWidget__temp-meas">°C</div>
                </div>
                <div className="weatherWidget__feels">{weather && weather.main && weather.main.feels_like && <div>Feels like: {Math.round(weather.main.feels_like)} ℃</div>}</div>
              </div>
            </div>
            <div className="weatherWidget__footer">
              <div className="weatherWidget__footer-left">
                {weather && weather.wind && <div>Wind speed</div>}
                {weather && weather.clouds && <div>Clouds</div>}
                {weather && weather.rain && <div>Rain</div>}
                {weather && weather.snow && <div>Snow</div>}
              </div>
              <div className="weatherWidget__footer-right">
                {weather && weather.wind && <div>{weather.wind.speed} m/s</div>}
                {weather && weather.clouds && <div>{weather.clouds.all} %</div>}
                {weather && weather.rain && <div>{weather.rain["1h"]} mm</div>}
                {weather && weather.snow && <div>{weather.snow["1h"]} mm</div>}
              </div>
            </div>
            {edit && <button className="widget__settings" onClick={editHandler}><GearFill /></button>}
          </>
        )
      )}
    </div>
  )
})

export default WeatherWidget