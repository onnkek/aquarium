import React from "react"
import "./ProfilePage.sass"
import SettingsHeader from "../SettingsHeader/SettingsHeader"

const ProfilePage = () => {
  return (
    <>
      <div className="settings-item">
        <SettingsHeader title='Profile preferences' />
        <form className="form-1 col-8">
          <div className="profile-form-group">
            <label className="profile-form-group-label form-label">
              Username
            </label>
            <input
              className="profile-form-group-input form-control"
              value="username"
              onChange={() => { }}
            />
            <div className="profile-from-group-descr">
              Your username in the glider system and in the header of the site
              to display authorization information.
            </div>
          </div>
          <div className="profile-form-group">
            <label className="profile-form-group-label form-label">Email</label>
            <input
              className="profile-form-group-input form-control"
              value="email@email.com"
              onChange={() => { }}
            />
            <div className="profile-from-group-descr">
              Your e-mail in the planner's system for the possibility of account
              recovery in case of password loss. Your email is not displayed
              publicly for privacy reasons.
            </div>
          </div>
        </form>
      </div>
    </>
  )
}

export default ProfilePage
