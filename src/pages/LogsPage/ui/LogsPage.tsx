
import { Page } from "widgets/Page";
import { classNames } from "shared/lib/classNames";
import cls from './LogsPage.module.sass';
import { Dropdown } from "shared/ui/Dropdown";
import { useAppDispatch, useAppSelector } from "models/Hook";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { clearDoserLogs, clearRelayLogs, clearSystemLogs, getDoserLogs, getRelayLogs, getSystemLogs, switchModal } from "../../../redux/AquariumSlice";
import { Button } from "shared/ui/Button";
import { Status } from "models/Status";
import { ReactComponent as Spinner } from 'shared/assets/icons/spinner.svg';
import { ReactComponent as TrashIcon } from 'shared/assets/icons/aquarium/trash.svg';
import { Navbar } from "widgets/Navbar";
import { ButtonGroup } from "shared/ui/ButtonGroup";
import BG from 'shared/assets/img/bg4.jpg';
import { formatTimestamp } from "shared/lib/period";
import { LogEntry } from "shared/lib/logs";

export interface LogsPageProps {
  className?: string;
}

export const LogsPage = ({ className }: LogsPageProps) => {
  const dispatch = useAppDispatch()
  const logs = useAppSelector(state => state.aquarium.logs)
  const logStatus = useAppSelector(state => state.aquarium.logStatus)
  const [select, setSelect] = useState("all")
  const containerRef = useRef<HTMLDivElement>(null)

  // const selectSystemLogs = () => {
  //   dispatch(getSystemLogs());
  //   setSelectLog("System");
  // }
  // const selectRelayLogs = () => {
  //   dispatch(getRelayLogs());
  //   setSelectLog("Relay");
  // }
  // const selectDoserLogs = () => {
  //   dispatch(getDoserLogs());
  //   setSelectLog("Doser");
  // }

  // const clearLogs = () => {
  //   switch (selectLog) {
  //     case "System":
  //       dispatch(clearSystemLogs());
  //       break;
  //     case "Relay":
  //       dispatch(clearRelayLogs());
  //       break;
  //     case "Doser":
  //       dispatch(clearDoserLogs());
  //       break;
  //     default:
  //       break;
  //   }
  // }


  useEffect(() => {
    dispatch(getSystemLogs())
    dispatch(getRelayLogs())
    dispatch(getDoserLogs())
  }, [dispatch])

  useLayoutEffect(() => {
    // if (containerRef.current && logStatus) {
    //   containerRef.current.scrollIntoView({ behavior: "auto" });
    // }
    const el = containerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [logs.doser.length, logs.relay.length, logs.system.length, select]);

  const getLogs = (): LogEntry[] => {
    switch (select) {
      case "system":
        console.log(logs.system)
        return logs.system;
      case "relay":
        return logs.relay;
      case "doser":
        return logs.doser;
      default:
        return [...logs.system, ...logs.relay, ...logs.doser];
    }
  }
  return (
    <Page className={classNames(cls.logsPage, {}, [className])}>
      <div className={cls.content}>
        <div className={cls.card}>
          <div className={cls.cardHead}>
            <h3>Log Viewer</h3>
            <div className={cls.logToolbar}>
              <span className={cls.pill} id="matchInfo">{[...getLogs()].length} lines</span>
              <select className={cls.select} id="logType" onChange={(e) => setSelect(e.currentTarget.value)}>
                <option value="all">All Types</option>
                <option value="system">System</option>
                <option value="relay">Relay</option>
                <option value="doser">DOSER</option>
              </select>
              {/* <select className={cls.select} id="severityType">
                <option value="all">All Severity</option>
                <option value="info">INFO</option>
                <option value="warn">WARN</option>
                <option value="error">ERROR</option>
              </select> */}
              {/* <span className={cls.chip} id="liveChip">Live</span>
              <span className={cls.chip} id="scrollChip">Auto Scroll ON</span>
              <span className={cls.chip} id="clearBtn">Clear Filter</span> */}
            </div>
          </div>

          <div className={cls.viewerWrap}>
            {/* <div className={cls.viewerToolbar}>
              <div className={cls.left}>
                <span className={cls.pill}>Scroll inside log area only</span>
                <span className={cls.pill}>Monospace output</span>
              </div>
              <div className={cls.right}>
                <span className={cls.pill} id="matchInfo">48 lines</span>
              </div>
            </div> */}

            <div className={cls.viewer} id="viewer" ref={containerRef}>
              {[...getLogs()].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()).map((line) => (
                <div className={cls.line} key={Math.random()}>
                  <span className={cls.time}>{formatTimestamp(line.timestamp)}</span>
                  <span className={classNames(cls.type, { [cls.system]: line.type === "system", [cls.relay]: line.type === "relay", [cls.doser]: line.type === "doser" }, [])}>{line.type.toUpperCase()}</span>
                  <span className={cls.msg}>{line.message}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </Page>
  );
};
