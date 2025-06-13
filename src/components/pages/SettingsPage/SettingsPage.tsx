import React, { Component } from "react"
import "./SettingsPage.sass"
import ThemePage from "./ThemePage/ThemePage"
import Sidebar from "./Sidebar/Sidebar"
import { Route, Routes } from "react-router-dom"
import ProfilePage from "./ProfilePage/ProfilePage"
import TimetaskPage from "./TimetaskPage/TimetaskPage"
import NotificationsPage from "./NotificationsPage/NotificationsPage"
import BadgesPage from "./BadgesPage/BadgesPage"
import DatePage from "./DatePage/DatePage"

const SettingsPage = () => {

  return (
    <>
      <div className="app-container">
        <div className="settings-page row">
          <div className="col-4">
            <Sidebar />
          </div>
          <div className="settings-page-body col-8">
            <Routes>
              <Route path="profile" element={<ProfilePage />} />
              <Route path="appearance" element={<ThemePage />} />
              <Route path="time" element={<TimetaskPage />} />
              <Route path="badges" element={<BadgesPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="date" element={<DatePage />} />
            </Routes>
          </div>

        </div>
      </div>
    </>
  )
}
export default SettingsPage
