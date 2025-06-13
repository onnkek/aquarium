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
import { getSettings } from "../../redux/SettingsSlice"
import { getChipTemp, getFSInfo } from "../../redux/AquariumSlice"

const App = () => {
  const dispatch = useAppDispatch()
  const closeMenusHandler = (e: MouseEvent<HTMLDivElement>) => {
    dispatch(closeContextMenu())
    dispatch(closeIconsMenu())
  }
  const aquarium = useAppSelector(state => state.aquarium)
  useEffect(() => {
    dispatch(getChipTemp())
    dispatch(getFSInfo())
  }, [dispatch])

  return (
    <div onClick={closeMenusHandler} className="app">
      <Header />
      <h3>Chip temp: {aquarium.chipTemp}</h3>
      <h3>Total space: {aquarium.fs.totalSpace! / 1024 / 1024} MB</h3>
      <h3>Used space: {aquarium.fs.usedSpace! / 1024 / 1024} MB</h3>
      <h3>Free space: {aquarium.fs.freeSpace! / 1024 / 1024} MB</h3>
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