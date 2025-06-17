import React, { MouseEvent, useEffect } from "react"
import "./App.sass"
import Header from "../Header/Header"
import { useAppDispatch, useAppSelector } from "../../models/Hook"
import { closeContextMenu, closeIconsMenu } from "../../redux/NotesSlice"
import { Doser } from "../Doser/Doser"
import { getConfig, getCurrentInfo } from "../../redux/AquariumSlice"
import fanIcon from '../../assets/icons/fan.svg'
import heatIcon from '../../assets/icons/heat.svg'

import co2Icon from '../../assets/icons/aquarium/co2.svg'
import filterIcon from '../../assets/icons/aquarium/filter.svg'
import lightIcon from '../../assets/icons/aquarium/light.svg'
import o2Icon from '../../assets/icons/aquarium/o2.svg'
import rgbIcon from '../../assets/icons/aquarium/rgb.svg'
import tempIcon from '../../assets/icons/aquarium/temp.svg'
import doserIcon from '../../assets/icons/aquarium/doser.svg'

import chipIcon from '../../assets/icons/aquarium/chip.svg'
import timeIcon from '../../assets/icons/aquarium/time.svg'
import harddriveIcon from '../../assets/icons/aquarium/harddrive.svg'

const App = () => {
  const dispatch = useAppDispatch()
  const closeMenusHandler = (e: MouseEvent<HTMLDivElement>) => {
    dispatch(closeContextMenu())
    dispatch(closeIconsMenu())
  }
  const aquarium = useAppSelector(state => state.aquarium)
  useEffect(() => {
    dispatch(getCurrentInfo())
    dispatch(getConfig())
  }, [dispatch])

  return (
    <div onClick={closeMenusHandler} className="app">
      <Header />
      <div style={{ padding: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", margin: "10px 0" }}>
          <div style={{ width: "50px" }}>
            <img className="" style={{ width: "30px", marginRight: "10px" }} src={chipIcon}></img>
          </div>

          <h6 style={{ margin: 0 }}>Chip temp: {aquarium.currentInfo.system.chipTemp}</h6>
        </div>
        <div style={{ display: "flex", alignItems: "center", margin: "10px 0" }}>
          <div style={{ width: "50px" }}>
            <img className="" style={{ width: "30px", marginRight: "10px" }} src={timeIcon}></img>
          </div>

          <h6 style={{ margin: 0 }}>Uptime: {aquarium.currentInfo.system.uptime / 1000} ms</h6>
        </div>
        <div style={{ display: "flex", alignItems: "center", margin: "10px 0" }}>
          <div style={{ width: "50px" }}>
            <img className="" style={{ width: "30px", marginRight: "10px" }} src={harddriveIcon}></img>
          </div>

          <div>
            <h6 style={{ margin: 0 }}>Total space: {aquarium.currentInfo.system.totalSpace / 1024 / 1024} MB</h6>
            <h6 style={{ margin: 0 }}>Used space: {aquarium.currentInfo.system.usedSpace / 1024 / 1024} MB</h6>
            <h6 style={{ margin: 0 }}>Free space: {aquarium.currentInfo.system.freeSpace / 1024 / 1024} MB</h6>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ width: "100px", margin: "0 50px 20px 50px" }}>
          <img className="" style={{ width: "130px", marginRight: "10px" }} src={doserIcon}></img>
        </div>
        <Doser doserConfig={aquarium.config.doser} doserStatus={aquarium.currentInfo.doser} />
      </div>


      <div style={{ marginLeft: "100px" }}>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          <div className="card">
            <img className="" style={{ width: "40px" }} src={co2Icon}></img>
            <div>On Time: {aquarium.config.co2.on}</div>
            <div>Off Time: {aquarium.config.co2.off}</div>
            {/* <div>Status: {aquarium.currentInfo.co2.status}</div> */}
            <div className="form-check form-switch">
              <input className="form-check-input mt-3" type="checkbox" role="switch" id="switchCheckChecked" checked />
            </div>
          </div>

          <div className="card">
            <img className="" style={{ width: "50px" }} src={o2Icon}></img>
            <div>On Time: {aquarium.config.o2.on}</div>
            <div>Off Time: {aquarium.config.o2.off}</div>
            {/* <div>Status: {aquarium.currentInfo.o2.status}</div> */}
            <div className="form-check form-switch">
              <input className="form-check-input mt-3" type="checkbox" role="switch" id="switchCheckChecked" />
            </div>
          </div>

          <div className="card">
            <img className="" style={{ width: "50px" }} src={tempIcon}></img>
            <div>Setting: {aquarium.config.temp.setting}</div>
            <div>Hysteresis: {aquarium.config.temp.hysteresis}</div>
            <div>k: {aquarium.config.temp.k}</div>
            <div>Timeout: {aquarium.config.temp.timeout}</div>
            <div>Temp: {aquarium.currentInfo.temp.current}</div>
            {/* <div>Status: {aquarium.currentInfo.temp.status}</div> */}
            {/* {aquarium.config.temp.status == 1 && <img className="fan" style={{ width: "80px" }} src={fanIcon}></img>} */}
            {/* {aquarium.config.temp.status == 2 && <img className="heat" style={{ width: "80px" }} src={heatIcon}></img>} */}
            {<img className="fan" style={{ width: "80px" }} src={fanIcon}></img>}
            <div className="form-check form-switch">
              <input className="form-check-input mt-3" type="checkbox" role="switch" id="switchCheckChecked" checked />
            </div>
            {<img className="heat" style={{ width: "80px" }} src={heatIcon}></img>}
            <div className="form-check form-switch">
              <input className="form-check-input mt-3" type="checkbox" role="switch" id="switchCheckChecked" checked />
            </div>
          </div>

        </div>

        <div style={{ display: "flex", flexWrap: "wrap" }}>
          <div className="card">
            <img className="" style={{ width: "100px" }} src={lightIcon}></img>
            <div>On Time: {aquarium.config.light.on}</div>
            <div>Off Time: {aquarium.config.light.off}</div>
            {/* <div>Status: {aquarium.currentInfo.light.status}</div> */}
            <div className="form-check form-switch">
              <input className="form-check-input mt-3" type="checkbox" role="switch" id="switchCheckChecked" checked />
            </div>
          </div>

          <div className="card">
            <img className="" style={{ width: "150px" }} src={rgbIcon}></img>
            <div>R: {aquarium.config.rgb.r}</div>
            <div>G: {aquarium.config.rgb.g}</div>
            <div>B: {aquarium.config.rgb.b}</div>
            <div>On Time: {aquarium.config.rgb.on}</div>
            <div>Off Time: {aquarium.config.rgb.off}</div>
            {/* <div>Status: {aquarium.currentInfo.rgb.status}</div> */}
            <div className="form-check form-switch">
              <input className="form-check-input mt-3" type="checkbox" role="switch" id="switchCheckChecked" checked />
            </div>
          </div>

          <div className="card">
            <img className="" style={{ width: "80px" }} src={filterIcon}></img>
            {/* <div>Status: 1</div> */}
            <div className="form-check form-switch">
              <input className="form-check-input mt-3" type="checkbox" role="switch" id="switchCheckChecked" checked />
            </div>
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