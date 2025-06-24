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
import { getConfig, getCurrentInfo } from './redux/AquariumSlice';
import { Status } from 'models/Status';

function App() {
  const { theme, toggleTheme } = useTheme();
  const dispatch = useAppDispatch()
  const system = useAppSelector(state => state.aquarium.config.system)
  const status = useAppSelector(state => state.aquarium.updateStatus)
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    dispatch(getCurrentInfo())
    dispatch(getConfig())
  }, [dispatch])

  useEffect(() => {
    if (status === Status.Succeeded && system.update > 0) {
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

  }, [status, system.update, dispatch])


  return (
    <div className={classNames('app', {}, [theme])}>

      <h6 className='aquarium'>Aquarium</h6>
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


    </div>
  );
}

export default App;
