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
import { useEffect } from 'react';
import { useAppDispatch } from 'models/Hook';
import { getConfig, getCurrentInfo } from './redux/AquariumSlice';

function App() {
  const { theme, toggleTheme } = useTheme();
  const dispatch = useAppDispatch()
  // setInterval(() => {
  //   dispatch(getCurrentInfo())
  // }, 5000)
  useEffect(() => {
    dispatch(getCurrentInfo())
    dispatch(getConfig())
  }, [dispatch])

  return (
    <div className={classNames('app', {}, [theme])}>


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
  );
}

export default App;
