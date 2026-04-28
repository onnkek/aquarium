
import { Page } from "widgets/Page";
import { classNames } from "shared/lib/classNames";
import cls from './LogsPage.module.sass';
import { Dropdown } from "shared/ui/Dropdown";
import { useAppDispatch, useAppSelector } from "models/Hook";
import { useEffect, useRef, useState } from "react";
import { clearDoserLogs, clearRelayLogs, clearSystemLogs, getDoserLogs, getRelayLogs, getSystemLogs, switchModal } from "../../../redux/AquariumSlice";
import { Button } from "shared/ui/Button";
import { Status } from "models/Status";
import { ReactComponent as Spinner } from 'shared/assets/icons/spinner.svg';
import { ReactComponent as TrashIcon } from 'shared/assets/icons/aquarium/trash.svg';
import { Navbar } from "widgets/Navbar";
import { ButtonGroup } from "shared/ui/ButtonGroup";
import BG from 'shared/assets/img/bg4.jpg';

export interface LogsPageProps {
  className?: string;
}

export const LogsPage = ({ className }: LogsPageProps) => {
  const dispatch = useAppDispatch()
  const logs = useAppSelector(state => state.aquarium.logs)
  const logStatus = useAppSelector(state => state.aquarium.logStatus)
  const [selectLog, setSelectLog] = useState("System")
  const containerRef = useRef<HTMLDivElement>(null)

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
    dispatch(getSystemLogs())
  }, [dispatch])

  useEffect(() => {
    if (containerRef.current && logStatus) {
      containerRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [logStatus]);

  return (
    <Page className={classNames(cls.logsPage, {}, [className])}>
      <div className={cls.content}>
        <div className={cls.card}>
          <div className={cls.cardHead}>
            <h3>Log Viewer</h3>
            <div className={cls.logToolbar}>
              <select className={cls.select} id="logType">
                <option value="all">All Types</option>
                <option value="system">System</option>
                <option value="relay">Relay</option>
                <option value="dispenser">DOSER</option>
              </select>
              <select className={cls.select} id="severityType">
                <option value="all">All Severity</option>
                <option value="info">INFO</option>
                <option value="warn">WARN</option>
                <option value="error">ERROR</option>
              </select>
              <span className={cls.chip} id="liveChip">Live</span>
              <span className={cls.chip} id="scrollChip">Auto Scroll ON</span>
              <span className={cls.chip} id="clearBtn">Clear Filter</span>
            </div>
          </div>

          <div className={cls.viewerWrap}>
            <div className={cls.viewerToolbar}>
              <div className={cls.left}>
                <span className={cls.pill}>Scroll inside log area only</span>
                <span className={cls.pill}>Monospace output</span>
              </div>
              <div className={cls.right}>
                <span className={cls.pill} id="matchInfo">48 lines</span>
              </div>
            </div>

            <div className={cls.viewer} id="viewer">
              <div className={cls.line} data-type="system" data-severity="info">
                <span className={cls.time}>08:00:01</span>
                <span className={cls.type + " " + cls.system}>SYSTEM</span>
                <span className={cls.msg}>Controller boot completed</span>
              </div>
              <div className={cls.line} data-type="system" data-severity="info">
                <span className={cls.time}>08:00:03</span>
                <span className={cls.type + " " + cls.system}>SYSTEM</span>
                <span className={cls.msg}>Wi-Fi stack initialized</span>
              </div>
              <div className={cls.line} data-type="relay" data-severity="info">
                <span className={cls.time}>08:00:05</span>
                <span className={cls.type + " " + cls.relay}>RELAY</span>
                <span className={cls.msg}>Relay 1 switched ON</span>
              </div>
              <div className={cls.line} data-type="dispenser" data-severity="info">
                <span className={cls.time}>08:00:06</span>
                <span className={cls.type + " " + cls.doser}>DOSER</span>
                <span className={cls.msg}>Pump 1 started, target 200 ml</span>
              </div>
              <div className={cls.line} data-type="system" data-severity="info">
                <span className={cls.time}>08:00:08</span>
                <span className={cls.type + " " + cls.system}>SYSTEM</span>
                <span className={cls.msg}>MQTT connected to broker</span>
              </div>
              <div className={cls.line} data-type="relay" data-severity="warn">
                <span className={cls.time}>08:00:10</span>
                <span className={cls.type + " " + cls.relay}>RELAY</span>
                <span className={cls.msg}>Relay 2 switched OFF unexpectedly</span>
              </div>
              <div className={cls.line} data-type="system" data-severity="info">
                <span className={cls.time}>08:00:12</span>
                <span className={cls.type + " " + cls.system}>SYSTEM</span>
                <span className={cls.msg}>SD card mounted successfully</span>
              </div>
              <div className={cls.line} data-type="dispenser" data-severity="info">
                <span className={cls.time}>08:00:14</span>
                <span className={cls.type + " " + cls.dispenser}>DOSER</span>
                <span className={cls.msg}>Pump 2 standby ready</span>
              </div>
              <div className={cls.line} data-type="system" data-severity="info">
                <span className={cls.time}>08:00:16</span>
                <span className={cls.type + " " + cls.system}>SYSTEM</span>
                <span className={cls.msg}>Memory usage 72%, free heap 95 KB</span>
              </div>
              <div className={cls.line} data-type="relay" data-severity="info">
                <span className={cls.time}>08:00:18</span>
                <span className={cls.type + " " + cls.relay}>RELAY</span>
                <span className={cls.msg}>Relay 3 auto mode enabled</span>
              </div>
              <div className={cls.line} data-type="dispenser" data-severity="info">
                <span className={cls.time}>08:00:20</span>
                <span className={cls.type + " " + cls.dispenser}>DOSER</span>
                <span className={cls.msg}>Pump 3 completed dosing cycle</span>
              </div>
              <div className={cls.line} data-type="system" data-severity="info">
                <span className={cls.time}>08:00:22</span>
                <span className={cls.type + " " + cls.system}>SYSTEM</span>
                <span className={cls.msg}>Temperature sensor updated: 24.6 C</span>
              </div>
              <div className={cls.line} data-type="relay" data-severity="error">
                <span className={cls.time}>08:00:24</span>
                <span className={cls.type + " " + cls.relay}>RELAY</span>
                <span className={cls.msg}>Relay 4 failed to respond</span>
              </div>
              <div className={cls.line} data-type="system" data-severity="info">
                <span className={cls.time}>08:00:26</span>
                <span className={cls.type + " " + cls.system}>SYSTEM</span>
                <span className={cls.msg}>Humidity sensor updated: 51 %</span>
              </div>
              <div className={cls.line} data-type="dispenser" data-severity="warn">
                <span className={cls.time}>08:00:28</span>
                <span className={cls.type + " " + cls.dispenser}>DOSER</span>
                <span className={cls.msg}>Pump 4 dose skipped, tank low</span>
              </div>
              <div className={cls.line} data-type="system" data-severity="info">
                <span className={cls.time}>08:00:30</span>
                <span className={cls.type + " " + cls.system}>SYSTEM</span>
                <span className={cls.msg}>Time synchronized via NTP</span>
              </div>
              <div className={cls.line} data-type="relay" data-severity="info">
                <span className={cls.time}>08:00:32</span>
                <span className={cls.type + " " + cls.relay}>RELAY</span>
                <span className={cls.msg}>Relay 1 switched OFF</span>
              </div>
              <div className={cls.line} data-type="dispenser" data-severity="info">
                <span className={cls.time}>08:00:34</span>
                <span className={cls.type + " " + cls.dispenser}>DOSER</span>
                <span className={cls.msg}>Pump 1 dosing completed</span>
              </div>
              <div className={cls.line} data-type="system" data-severity="info">
                <span className={cls.time}>08:00:36</span>
                <span className={cls.type + " " + cls.system}>SYSTEM</span>
                <span className={cls.msg}>Controller status OK</span>
              </div>
              <div className={cls.line} data-type="relay" data-severity="info">
                <span className={cls.time}>08:00:38</span>
                <span className={cls.type + " " + cls.relay}>RELAY</span>
                <span className={cls.msg}>Relay 2 switched ON</span>
              </div>
              <div className={cls.line} data-type="system" data-severity="info">
                <span className={cls.time}>08:01:01</span>
                <span className={cls.type + " " + cls.system}>SYSTEM</span>
                <span className={cls.msg}>Watchdog check passed</span>
              </div>
              <div className={cls.line} data-type="relay" data-severity="warn">
                <span className={cls.time}>08:01:03</span>
                <span className={cls.type + " " + cls.relay}>RELAY</span>
                <span className={cls.msg}>Relay 3 switched OFF by safety rule</span>
              </div>
              <div className={cls.line} data-type="dispenser" data-severity="info">
                <span className={cls.time}>08:01:05</span>
                <span className={cls.type + " " + cls.dispenser}>DOSER</span>
                <span className={cls.msg}>Pump 2 target 150 ml started</span>
              </div>
              <div className={cls.line} data-type="system" data-severity="info">
                <span className={cls.time}>08:01:07</span>
                <span className={cls.type + " " + cls.system}>SYSTEM</span>
                <span className={cls.msg}>API request handled successfully</span>
              </div>
              <div className={cls.line} data-type="relay" data-severity="error">
                <span className={cls.time}>08:01:09</span>
                <span className={cls.type + " " + cls.relay}>RELAY</span>
                <span className={cls.msg}>Relay 4 auto shutdown trigger failed</span>
              </div>
              <div className={cls.line} data-type="dispenser" data-severity="info">
                <span className={cls.time}>08:01:11</span>
                <span className={cls.type + " " + cls.dispenser}>DOSER</span>
                <span className={cls.msg}>Pump 3 tank level 56%</span>
              </div>
              <div className={cls.line} data-type="system" data-severity="info">
                <span className={cls.time}>08:01:13</span>
                <span className={cls.type + " " + cls.system}>SYSTEM</span>
                <span className={cls.msg}>Log rotation scheduled</span>
              </div>
              <div className={cls.line} data-type="relay" data-severity="info">
                <span className={cls.time}>08:01:15</span>
                <span className={cls.type + " " + cls.relay}>RELAY</span>
                <span className={cls.msg}>Relay 1 power cycle complete</span>
              </div>
              <div className={cls.line} data-type="dispenser" data-severity="warn">
                <span className={cls.time}>08:01:17</span>
                <span className={cls.type + " " + cls.dispenser}>DOSER</span>
                <span className={cls.msg}>Pump 4 low-level warning</span>
              </div>
              <div className={cls.line} data-type="system" data-severity="info">
                <span className={cls.time}>08:01:19</span>
                <span className={cls.type + " " + cls.system}>SYSTEM</span>
                <span className={cls.msg}>RTC updated</span>
              </div>
              <div className={cls.line} data-type="relay" data-severity="info">
                <span className={cls.time}>08:01:21</span>
                <span className={cls.type + " " + cls.relay}>RELAY</span>
                <span className={cls.msg}>Relay 2 manual override enabled</span>
              </div>
              <div className={cls.line} data-type="dispenser" data-severity="info">
                <span className={cls.time}>08:01:23</span>
                <span className={cls.type + " " + cls.dispenser}>DOSER</span>
                <span className={cls.msg}>Pump 1 reached 50% progress</span>
              </div>
              <div className={cls.line} data-type="system" data-severity="info">
                <span className={cls.time}>08:01:25</span>
                <span className={cls.type + " " + cls.system}>SYSTEM</span>
                <span className={cls.msg}>Heap fragmentation below threshold</span>
              </div>
              <div className={cls.line} data-type="relay" data-severity="info">
                <span className={cls.time}>08:01:27</span>
                <span className={cls.type + " " + cls.relay}>RELAY</span>
                <span className={cls.msg}>Relay 4 switched OFF</span>
              </div>
              <div className={cls.line} data-type="dispenser" data-severity="error">
                <span className={cls.time}>08:01:29</span>
                <span className={cls.type + " " + cls.dispenser}>DOSER</span>
                <span className={cls.msg}>Pump 2 stopped by timer error</span>
              </div>
              <div className={cls.line} data-type="system" data-severity="info">
                <span className={cls.time}>08:01:31</span>
                <span className={cls.type + " " + cls.system}>SYSTEM</span>
                <span className={cls.msg}>Configuration saved</span>
              </div>
              <div className={cls.line} data-type="relay" data-severity="info">
                <span className={cls.time}>08:01:33</span>
                <span className={cls.type + " " + cls.relay}>RELAY</span>
                <span className={cls.msg}>Relay 3 switched ON</span>
              </div>
              <div className={cls.line} data-type="dispenser" data-severity="warn">
                <span className={cls.time}>08:01:35</span>
                <span className={cls.type + " " + cls.dispenser}>DOSER</span>
                <span className={cls.msg}>Pump 3 dose aborted by safety limit</span>
              </div>
              <div className={cls.line} data-type="system" data-severity="info">
                <span className={cls.time}>08:01:37</span>
                <span className={cls.type + " " + cls.system}>SYSTEM</span>
                <span className={cls.msg}>Heartbeat sent to dashboard</span>
              </div>
              <div className={cls.line} data-type="relay" data-severity="info">
                <span className={cls.time}>08:01:39</span>
                <span className={cls.type + " " + cls.relay}>RELAY</span>
                <span className={cls.msg}>Relay 1 switched ON</span>
              </div>
              <div className={cls.line} data-type="dispenser" data-severity="info">
                <span className={cls.time}>08:01:41</span>
                <span className={cls.type + " " + cls.dispenser}>DOSER</span>
                <span className={cls.msg}>Pump 4 queued for next cycle</span>
              </div>
              <div className={cls.line} data-type="system" data-severity="info">
                <span className={cls.time}>08:01:43</span>
                <span className={cls.type + " " + cls.system}>SYSTEM</span>
                <span className={cls.msg}>Network latency 18 ms</span>
              </div>
              <div className={cls.line} data-type="relay" data-severity="error">
                <span className={cls.time}>08:01:45</span>
                <span className={cls.type + " " + cls.relay}>RELAY</span>
                <span className={cls.msg}>Relay 2 failed to switch OFF</span>
              </div>
              <div className={cls.line} data-type="dispenser" data-severity="info">
                <span className={cls.time}>08:01:47</span>
                <span className={cls.type + " " + cls.dispenser}>DOSER</span>
                <span className={cls.msg}>Pump 1 tank refill acknowledged</span>
              </div>
              <div className={cls.line} data-type="system" data-severity="warn">
                <span className={cls.time}>08:01:49</span>
                <span className={cls.type + " " + cls.system}>SYSTEM</span>
                <span className={cls.msg}>NTP drift corrected with warning</span>
              </div>
              <div className={cls.line} data-type="relay" data-severity="info">
                <span className={cls.time}>08:01:51</span>
                <span className={cls.type + " " + cls.relay}>RELAY</span>
                <span className={cls.msg}>Relay 3 switched OFF</span>
              </div>
              <div className={cls.line} data-type="dispenser" data-severity="info">
                <span className={cls.time}>08:01:53</span>
                <span className={cls.type + " " + cls.dispenser}>DOSER</span>
                <span className={cls.msg}>Pump 2 refill interval set</span>
              </div>
              <div className={cls.line} data-type="system" data-severity="info">
                <span className={cls.time}>08:01:55</span>
                <span className={cls.type + " " + cls.system}>SYSTEM</span>
                <span className={cls.msg}>Sensor cache refreshed</span>
              </div>

            </div>
          </div>
        </div>
      </div>

    </Page>
  );
};
