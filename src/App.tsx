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
import { clearDoserLogs, clearRelayLogs, clearSystemLogs, getConfig, getCurrentInfo, getDoserLogs, getRelayLogs, getSystemLogs, switchModal } from './redux/AquariumSlice';
import { Status } from 'models/Status';
import { ReactComponent as Logo } from './assets/logo.svg';
import { Modal } from 'components/Modal';
import { Button } from 'components/Button';
import { ReactComponent as Spinner } from 'assets/icons/spinner.svg';
import { Dropdown } from 'components/Dropdown';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, Tooltip, Legend, LinearScale, CategoryScale, PointElement, LineElement, Title } from "chart.js";
import { ReactComponent as LogsIcon } from 'assets/icons/aquarium/journal.svg';
import { ReactComponent as ArchiveIcon } from 'assets/icons/aquarium/archive.svg';
import { ReactComponent as DashboardIcon } from 'assets/icons/aquarium/dashboard.svg';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const { theme, toggleTheme } = useTheme();
  const dispatch = useAppDispatch()
  const system = useAppSelector(state => state.aquarium.config.system)
  const openModal = useAppSelector(state => state.aquarium.modal)
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
    dispatch(switchModal(true));
    dispatch(getSystemLogs())
    dispatch(getRelayLogs())
    dispatch(getDoserLogs())
    setShowLogs(true);
    if (showArchive) {
      setShowArchive(false);
    }
  }
  const closeLogs = () => {
    dispatch(switchModal(false));
    setShowLogs(false);
  }
  const openArchive = () => {
    dispatch(switchModal(true));
    setShowArchive(true);
    if (showLogs) {
      setShowLogs(false);
    }
  }
  const openDashboard = () => {
    dispatch(switchModal(false));
    if (showLogs) {
      setShowLogs(false);
    }
    if (showArchive) {
      setShowArchive(false);
    }
  }

  const closeArchive = () => {
    setShowArchive(false);
    dispatch(switchModal(false));
  }
  useEffect(() => {
    dispatch(getCurrentInfo())
    dispatch(getConfig())
  }, [dispatch])

  const selectSystemLogs = () => {
    dispatch(getSystemLogs());
    setSelectLog("System");
  }
  const selectRelayLogs = () => {
    dispatch(getRelayLogs());
    setSelectLog("Relay");
  }
  const selectDoserLogs = () => {
    dispatch(getDoserLogs());
    setSelectLog("Doser");
  }
  const clearLogs = () => {
    switch (selectLog) {
      case "System":
        dispatch(clearSystemLogs());
        break;
      case "Relay":
        dispatch(clearRelayLogs());
        break;
      case "Doser":
        dispatch(clearDoserLogs());
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    if (updateStatus === Status.Succeeded && system.update > 0 && !openModal) {
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

  }, [updateStatus, system.update, dispatch, openModal])

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

        <Button onClick={openDashboard} theme='clear' className='header-button header-button-dashboard'>
          <DashboardIcon className='header_icon' />
          <div className='header_button-text'>Dashboard</div>
        </Button>
        <Button onClick={openLogs} theme='clear' className='header-button'>
          <LogsIcon className='header_icon' />
          <div className='header_button-text'>Logs</div>
        </Button>
        <Button onClick={openArchive} theme='clear' className='header-button'>
          <ArchiveIcon className='header_icon' />
          <div className='header_button-text'>Archive</div>
        </Button>

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
        <div className='log-body'>
          <div className='log-header'>
            <h2 className='log-title'>Logs</h2>
            <Dropdown className="" select={selectLog} items={[
              [{
                content: 'System',
                onClick: selectSystemLogs
              },
              {
                content: 'Relay',
                onClick: selectRelayLogs
              },
              {
                content: 'Doser',
                onClick: selectDoserLogs
              }]
            ]} />
            <Button theme='clear' onClick={clearLogs}>Clear</Button>
          </div>
          <div ref={containerRef} className='log-container'>
            {logStatus === Status.Loading &&
              <div className='spinner-container'>
                <Spinner className="spinner" />
              </div>
            }
            {selectLog === "System" && logStatus === Status.Succeeded &&
              <pre className='log'>{logs.system}</pre>
            }
            {selectLog === "Relay" && logStatus === Status.Succeeded &&
              <pre className='log'>{logs.relay}</pre>
            }
            {selectLog === "Doser" && logStatus === Status.Succeeded &&
              <pre className='log'>{logs.doser}</pre>
            }
          </div>
        </div>

      </Modal>
      <Modal isOpen={showArchive} onClose={closeArchive} iconColor='green' bgWrapper='none' className='modal' >
        <div className='log-body'>
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
              <div className='spinner-container'>
                <Spinner className="spinner" />
              </div>
            }
            {selectArchive === "Chip tempurature" && logStatus === Status.Succeeded &&
              <pre className='log'>Chip tempurature</pre>
            }
            {selectArchive === "Water tempurature" && logStatus === Status.Succeeded &&
              <pre className='log'>Water tempurature</pre>
            }
            {selectArchive === "Air temperature" && logStatus === Status.Succeeded &&
              <pre className='log'>Air temperature</pre>
            }
            {selectArchive === "Humidity" && logStatus === Status.Succeeded &&
              <pre className='log'>Humidity</pre>
            }
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default App;
