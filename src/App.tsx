import './App.sass';
import { useTheme } from 'helpers/ThemeProvider/lib/useTheme';
import { classNames } from 'helpers/classNames';
import CO2Widget from 'components/Widgets/CO2Widget/CO2Widget';
import TempWidget from 'components/Widgets/TempWidget/TempWidget';
import SystemWidget from 'components/Widgets/SystemWidget/SystemWidget';
import LightWidget from 'components/Widgets/LightWidget/LightWidget';
import O2Widget from 'components/Widgets/O2Widget/O2Widget';
import FilterWidget from 'components/Widgets/FilterWidget/FilterWidget';
import ARGBWidget from 'components/Widgets/ARGBWidget/ARGBWidget';
import { PumpWidget } from 'components/Widgets/PumpWidget/PumpWidget';
import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'models/Hook';
import { getConfig, getCurrentInfo, getLogs } from './redux/AquariumSlice';
import { Status } from 'models/Status';
import { ReactComponent as Logo } from './assets/logo.svg';
import { Modal } from 'components/Modal';
import { Button } from 'components/Button';
import { ReactComponent as Spinner } from 'assets/icons/spinner.svg';
import { Dropdown } from 'components/Dropdown';

function App() {
  const { theme, toggleTheme } = useTheme();
  const dispatch = useAppDispatch()
  const system = useAppSelector(state => state.aquarium.config.system)
  const logs = useAppSelector(state => state.aquarium.logs)
  const logStatus = useAppSelector(state => state.aquarium.logStatus)
  const updateStatus = useAppSelector(state => state.aquarium.updateStatus)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const [showLogs, setShowLogs] = useState(false)
  const [showArchive, setShowArchive] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const [selectLog, setSelectLog] = useState("System")
  const [selectArchive, setSelectArchive] = useState("Chip tempurature")

  const openLogs = () => {
    dispatch(getLogs())
    console.log(logs)
    setShowLogs(true);
  }

  const closeLogs = () => {
    setShowLogs(false);
  }
  const openArchive = () => {
    dispatch(getLogs())
    console.log(logs)
    setShowArchive(true);
  }

  const closeArchive = () => {
    setShowArchive(false);
  }
  useEffect(() => {
    dispatch(getCurrentInfo())
    dispatch(getConfig())
  }, [dispatch])

  useEffect(() => {
    if (updateStatus === Status.Succeeded && system.update > 0) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      timerRef.current = setInterval(() => {
        dispatch(getCurrentInfo())
      }, 1000 * system.update)

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }

  }, [updateStatus, system.update, dispatch])

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [closeLogs]);

  return (
    <div className={classNames('app', {}, [theme])}>

      <div className='header'>
        <Logo className='logo' />
        <h1 className='title'>Aquarium</h1>
        <Button onClick={openLogs} theme='clear'>Logs</Button>
        <Button onClick={openArchive} theme='clear'>Archive</Button>
      </div>
      <div className='container'>
        <SystemWidget />
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          <TempWidget />
          <LightWidget />
          <CO2Widget />
          <O2Widget />
          <FilterWidget />
          <ARGBWidget />
        </div>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          <PumpWidget number={0} />
          <PumpWidget number={1} />
          <PumpWidget number={2} />
          <PumpWidget number={3} />
        </div>
      </div>

      <Modal isOpen={showLogs} onClose={closeLogs} iconColor='green' bgWrapper='none' className='modal' >
        <div className='log-header'>
          <h2 className='log-title'>Logs</h2>
          <Dropdown className="" select={selectLog} items={[
            [{
              content: 'System',
              onClick: () => setSelectLog("System")
            },
            {
              content: 'Relay',
              onClick: () => setSelectLog("Relay")
            },
            {
              content: 'Doser',
              onClick: () => setSelectLog("Doser")
            }]
          ]} />
        </div>
        <div ref={containerRef} className='log-container'>
          {logStatus === Status.Loading &&
            <Spinner className="spinner" />
          }
          {selectLog === "System" && logStatus === Status.Succeeded &&
            <pre className='log'>{logs}</pre>
          }
          {selectLog === "Relay" && logStatus === Status.Succeeded &&
            <pre className='log'>{logs}</pre>
          }
          {selectLog === "Doser" && logStatus === Status.Succeeded &&
            <pre className='log'>{logs}</pre>
          }
        </div>
      </Modal>
      <Modal isOpen={showArchive} onClose={closeArchive} iconColor='green' bgWrapper='none' className='modal' >
        <div className='log-header'>
          <h2 className='log-title'>Archive</h2>
          <Dropdown className="" select={selectArchive} items={[
            [{
              content: 'Chip tempurature',
              onClick: () => setSelectArchive("Chip tempurature")
            },
            {
              content: 'Water tempurature',
              onClick: () => setSelectArchive("Water tempurature")
            },
            {
              content: 'Air temperature',
              onClick: () => setSelectArchive("Air temperature")
            },
            {
              content: 'Humidity',
              onClick: () => setSelectArchive("Humidity")
            }]
          ]} />
        </div>
        <div ref={containerRef} className='log-container'>
          {logStatus === Status.Loading &&
            <Spinner className="spinner" />
          }
          {selectArchive === "Chip tempurature" && logStatus === Status.Succeeded &&
            <pre className='log'>{logs}</pre>
          }
          {selectArchive === "Water tempurature" && logStatus === Status.Succeeded &&
            <pre className='log'>{logs}</pre>
          }
          {selectArchive === "Air temperature" && logStatus === Status.Succeeded &&
            <pre className='log'>{logs}</pre>
          }
          {selectArchive === "Humidity" && logStatus === Status.Succeeded &&
            <pre className='log'>{logs}</pre>
          }
        </div>
      </Modal>
    </div>
  );
}

export default App;
