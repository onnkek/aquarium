
import { useAppDispatch, useAppSelector } from "models/Hook";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { classNames } from "shared/lib/classNames";
import { LogEntry } from "shared/lib/logs";
import { formatTimestamp } from "shared/lib/period";
import { Page } from "widgets/Page";
import { getDoserLogs, getRelayLogs, getSystemLogs } from "../../../redux/AquariumSlice";
import cls from './LogsPage.module.sass';

export interface LogsPageProps {
  className?: string;
}

export const LogsPage = ({ className }: LogsPageProps) => {
  const dispatch = useAppDispatch()
  const logs = useAppSelector(state => state.aquarium.logs)
  const logStatus = useAppSelector(state => state.aquarium.logStatus)
  const [select, setSelect] = useState("all")
  const containerRef = useRef<HTMLDivElement>(null)


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
            </div>
          </div>

          <div className={cls.viewerWrap}>
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
