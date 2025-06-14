import React, { MouseEvent, useEffect } from "react"
import "./App.sass"
import Header from "../Header/Header"
import { Route, Routes } from "react-router-dom"
import SettingsPage from "../pages/SettingsPage/SettingsPage"
import NotesPage from "../pages/NotesPage/NotesPage"
import CalendarPage from "../pages/CalendarPage/CalendarPage"
import { useAppDispatch, useAppSelector } from "../../models/Hook"
import { closeContextMenu, closeIconsMenu } from "../../redux/NotesSlice"
import GeneralPage from "../pages/GeneralPage/GeneralPage"
import ActualTaskPage from "../pages/ActualTaskPage/ActualTaskPage"
import OldTasksPage from "../pages/OldTasksPage/OldTasksPage"
import { Pump } from "../Pump/Pump"
import { getSettings } from "../../redux/AquariumSlice"
import fanIcon from '../../assets/icons/fan.svg'
import heatIcon from '../../assets/icons/heat.svg'

const App = () => {
  const dispatch = useAppDispatch()
  const closeMenusHandler = (e: MouseEvent<HTMLDivElement>) => {
    dispatch(closeContextMenu())
    dispatch(closeIconsMenu())
  }
  const aquarium = useAppSelector(state => state.aquarium.settings)
  useEffect(() => {
    dispatch(getSettings())
  }, [dispatch])

  return (
    <div onClick={closeMenusHandler} className="app">
      <Header />
      <h3>Chip temp: {aquarium.system.chipTemp}</h3>
      <h3>Total space: {aquarium.system.totalSpace! / 1024 / 1024} MB</h3>
      <h3>Used space: {aquarium.system.usedSpace! / 1024 / 1024} MB</h3>
      <h3>Free space: {aquarium.system.freeSpace! / 1024 / 1024} MB</h3>

      <Pump pump1={aquarium.doser.pump1} pump2={aquarium.doser.pump2} pump3={aquarium.doser.pump3} pump4={aquarium.doser.pump4} />

      <div style={{ marginLeft: "100px" }}>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          <div style={{ margin: "10px 30px" }}>
            <div>CO2:</div>
            <div>On Time: {aquarium.co2.on}</div>
            <div>Off Time: {aquarium.co2.off}</div>
            <div>Status: {aquarium.co2.status}</div>
          </div>

          <div style={{ margin: "10px 30px" }}>
            <div>O2:</div>
            <div>On Time: {aquarium.o2.on}</div>
            <div>Off Time: {aquarium.o2.off}</div>
            <div>Status: {aquarium.o2.status}</div>
          </div>

          <div style={{ margin: "10px 30px" }}>
            <div>Temp:</div>
            <div>Setting: {aquarium.temp.setting}</div>
            <div>Hysteresis: {aquarium.temp.hysteresis}</div>
            <div>k: {aquarium.temp.k}</div>
            <div>Timeout: {aquarium.temp.timeout}</div>
            <div>Status: {aquarium.temp.status}</div>
            {/* {aquarium.temp.status == 1 && <img className="fan" style={{ width: "80px" }} src={fanIcon}></img>} */}
            {/* {aquarium.temp.status == 2 && <img className="heat" style={{ width: "80px" }} src={heatIcon}></img>} */}
            {<img className="fan" style={{ width: "80px" }} src={fanIcon}></img>}
            {<img className="heat" style={{ width: "80px" }} src={heatIcon}></img>}
          </div>

        </div>

        <div style={{ display: "flex", flexWrap: "wrap" }}>
          <div style={{ margin: "10px 30px" }}>
            <div>Light:</div>
            <div>On Time: {aquarium.light.on}</div>
            <div>Off Time: {aquarium.light.off}</div>
            <div>Status: {aquarium.light.status}</div>
          </div>

          <div style={{ margin: "10px 30px" }}>
            <div>RGB:</div>
            <div>R: {aquarium.rgb.r}</div>
            <div>G: {aquarium.rgb.g}</div>
            <div>B: {aquarium.rgb.b}</div>
            <div>On Time: {aquarium.rgb.on}</div>
            <div>Off Time: {aquarium.rgb.off}</div>
            <div>Status: {aquarium.rgb.status}</div>
          </div>

        </div>
      </div>







      {/* <Routes>
        <Route path="/" element={<GeneralPage />} />
        <Route path="/actual" element={<ActualTaskPage />} />
        <Route path="/old" element={<OldTasksPage />} />
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/settings/*" element={<SettingsPage />} />

      </Routes> */}
    </div>
  )
}
export default App