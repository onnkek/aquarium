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

function App() {
  const { theme, toggleTheme } = useTheme();
  const dispatch = useAppDispatch()
  const system = useAppSelector(state => state.aquarium.config.system)
  const logs = useAppSelector(state => state.aquarium.logs)
  const logStatus = useAppSelector(state => state.aquarium.logStatus)
  const updateStatus = useAppSelector(state => state.aquarium.updateStatus)
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [showModal, setShowModal] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null);
  const openModal = () => {
    dispatch(getLogs())
    console.log(logs)
    setShowModal(true);
  }

  const closeModal = () => {
    setShowModal(false);
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
  }, [closeModal]);

  return (
    <div className={classNames('app', {}, [theme])}>

      <div className='header'>
        <Logo className='logo' />
        <h1 className='title'>Aquarium</h1>
        <Button onClick={openModal} theme='clear'>Logs</Button>
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

      <Modal isOpen={showModal} onClose={closeModal} iconColor='green' bgWrapper='none' className='modal'>
        <div ref={containerRef} className='log-container'>
          {logStatus === Status.Succeeded &&
            <pre className='log'>{logs}</pre>
          }
          {logStatus === Status.Loading &&
            <Spinner className="spinner" />
          }
        </div>
      </Modal>

    </div>
  );
}

export default App;
