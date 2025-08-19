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
import { clearDoserLogs, clearRelayLogs, clearSystemLogs, getConfig, getCurrentInfo, getDoserLogs, getRelayLogs, getSystemLogs } from './redux/AquariumSlice';
import { Status } from 'models/Status';
import { ReactComponent as Logo } from './assets/logo.svg';
import { Modal } from 'components/Modal';
import { Button } from 'components/Button';
import { ReactComponent as Spinner } from 'assets/icons/spinner.svg';
import { Dropdown } from 'components/Dropdown';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, Tooltip, Legend, LinearScale, CategoryScale, PointElement, LineElement, Title } from "chart.js";

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
    dispatch(getSystemLogs())
    dispatch(getRelayLogs())
    dispatch(getDoserLogs())
    setShowLogs(true);
  }

  const closeLogs = () => {
    setShowLogs(false);
  }
  const openArchive = () => {
    // dispatch(getLogs())
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

  const options = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
        text: 'Chart.js Line Chart - Multi Axis',
        color: 'white'
      },
      legend: {
        color: 'white',
        labels: {
          color: 'white' // Set your desired color here
        }
      },
    },
    scales: {
      x: {
        grid: {
          color: 'white'
        },
        ticks: {
          color: 'white' // Color for X-axis tick labels
        }
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        grid: {
          color: 'white'
        },
        ticks: {
          color: 'white' // Color for X-axis tick labels
        }
      },
      // y1: {
      //   type: 'linear' as const,
      //   display: true,
      //   position: 'right' as const,
      //   grid: {
      //     drawOnChartArea: false,
      //     color: 'white'
      //   },
      //   ticks: {
      //     color: 'white' // Color for X-axis tick labels
      //   }
      // },
    },
  };
  const labels = ["13.08.2024 09:00:00",
    "13.08.2024 09:00:30",
    "13.08.2024 09:01:30",
    "13.08.2024 09:02:00",
    "13.08.2024 09:03:30",
    "13.08.2024 09:04:00",
    "13.08.2024 09:05:00",
    "13.08.2024 09:05:30",
    "13.08.2024 09:06:30",
    "13.08.2024 09:07:00",
    "13.08.2024 09:09:00",
    "13.08.2024 09:09:30",
    "13.08.2024 09:10:30",
    "13.08.2024 09:11:00",
    "13.08.2024 09:12:30",
    "13.08.2024 09:13:00",
    "13.08.2024 09:14:00",
    "13.08.2024 09:14:30",
    "13.08.2024 09:16:00",
    "13.08.2024 09:16:30",
    "13.08.2024 09:18:00",
    "13.08.2024 09:18:30",
    "13.08.2024 09:20:00",
    "13.08.2024 09: 20: 30",
    "13.08.2024 09: 22:00",
    "13.08.2024 09: 22: 30",
    "13.08.2024 09: 23: 30",
    "13.08.2024 09: 24:00",
    "13.08.2024 09: 26:00",
    "13.08.2024 09: 26: 30",
    "13.08.2024 09: 27: 30",
    "13.08.2024 09: 28:00",
    "13.08.2024 09: 29: 30",
    "13.08.2024 09: 30:00",
    "13.08.2024 09: 32:00",
    "13.08.2024 09: 32: 30",
    "13.08.2024 09: 33: 30",
    "13.08.2024 09: 34:00"

  ];
  const data = {
    labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: [
          699.209228515625,
          699.516662597656,
          703.830139160156,
          709.114379882813,
          708.310546875,
          707.433349609375,
          709.414672851563,
          709.36962890625,
          711.945739746094,
          713.264770507813,
          716.685668945313,
          717.293640136719,
          720.751586914063,
          721.235046386719,
          724.218566894531,
          724.877319335938,
          727.10986328125,
          731.17578125,
          730.05859375,
          730.289916992188,
          734.505737304688,
          735.950134277344,
          736.955017089844,
          737.164306640625,
          739.53662109375,
          740.663696289063,
          743.38623046875,
          744.557312011719,
          747.452270507813,
          748.580627441406,
          749.373657226563,
          749.770141601563,
          753.169189453125,
          754.634765625,
          758.986999511719,
          760.440673828125,
          762.337768554688,
          763.306884765625,


        ],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        yAxisID: 'y',
      },
      // {
      //   label: 'Dataset 2',
      //   data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
      //   borderColor: 'rgb(53, 162, 235)',
      //   backgroundColor: 'rgba(53, 162, 235, 0.5)',
      //   yAxisID: 'y',
      // },
    ],
  };

  return (
    <div className={classNames('app', {}, [theme])}>

      <div className='header'>
        <Logo className='logo' />
        <h1 className='title'>Aquarium</h1>
        <Button onClick={openLogs} theme='clear'>Logs</Button>
        <Button onClick={openArchive} theme='clear'>Archive</Button>
      </div>

      {/* <div className='graph'>
        <Line options={options} data={data} />
      </div> */}

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
      </Modal>
    </div>
  );
}

export default App;
