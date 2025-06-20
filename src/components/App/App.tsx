import React, { MouseEvent, useEffect, useState } from "react"
import "./App.sass"
import Header from "../Header/Header"
import { useAppDispatch, useAppSelector } from "../../models/Hook"
import { closeContextMenu, closeIconsMenu } from "../../redux/NotesSlice"
import { Doser } from "../Doser/Doser"
import { getConfig, getCurrentInfo } from "../../redux/AquariumSlice"
import fanIcon from '../../assets/icons/fan.svg'
import heatIcon from '../../assets/icons/heat.svg'


import filterIcon from '../../assets/icons/aquarium/filter.svg'
import lightIcon from '../../assets/icons/aquarium/light.svg'
import o2Icon from '../../assets/icons/aquarium/o2.svg'
import rgbIcon from '../../assets/icons/aquarium/argb.svg'
import tempIcon from '../../assets/icons/aquarium/temp.svg'
import doserIcon from '../../assets/icons/aquarium/doser.svg'

import chipIcon from '../../assets/icons/aquarium/chip.svg'
import timeIcon from '../../assets/icons/aquarium/time.svg'
import harddriveIcon from '../../assets/icons/aquarium/harddrive.svg'
import Modal from "../Modal/Modal"
import CO2Widget from "../widgets/CO2Widget/CO2Widget"
import O2Widget from "components/widgets/O2Widget/O2Widget"
import LightWidget from "components/widgets/LightWidget/LightWidget"
import FilterWidget from "components/widgets/FilterWidget/FilterWidget"
import ARGBWidget from "components/widgets/ARGBWidget/ARGBWidget"
import TempWidget from "components/widgets/TempWidget/TempWidget"

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


  const [showModal, setShowModal] = useState(false)
  return (
    <div onClick={closeMenusHandler} className="app">
      {/* <Header /> */}

      <button
        type="button"
        className="btn"
        onClick={() => setShowModal(true)}
      >
        {/* <img className="co2__edit-btn-icon" ></img> */}TEST
      </button>


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



      <div style={{}}>
        <div style={{ display: "flex", flexWrap: "wrap" }}>

          <CO2Widget />
          <O2Widget />
          <LightWidget />
          <FilterWidget />
          <ARGBWidget />
          <TempWidget />

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
      <Modal title='Add new task' show={showModal} setShow={setShowModal}>
        <h1>TEST</h1>
      </Modal >
    </div>
  )
}
export default App