
import { useAppDispatch, useAppSelector } from "models/Hook";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { fetchDoserLogs, fetchRelayLogs, fetchSystemLogs, LogEntry } from "redux/LogsSlice";
import { classNames } from "shared/lib/classNames";
import { formatDateForInput, formatTimestamp, getDateFromInput } from "shared/lib/period";
import { validateDate } from "shared/lib/validation";
import { Page } from "widgets/Page";
import cls from './LogsPage.module.sass';

export interface LogsPageProps {
  className?: string;
}

type FormData = {
  date: string;
};

export const LogsPage = ({ className }: LogsPageProps) => {
  const dispatch = useAppDispatch()
  const logs = useAppSelector(state => state.logs)
  const logStatus = useAppSelector(state => state.logs.status)
  const [select, setSelect] = useState("all")
  const containerRef = useRef<HTMLDivElement>(null)

  const {
    register,
    trigger,
    control,
    formState: { errors, isValid },
  } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      date: formatDateForInput(new Date(Date.now()))
    }
  });
  const selectedDate = useWatch({
    control,
    name: 'date',
  });

  useEffect(() => {
    trigger();
  }, []);

  useEffect(() => {
    if (!errors.date) {
      dispatch(fetchSystemLogs(getDateFromInput(selectedDate)))
      dispatch(fetchRelayLogs(getDateFromInput(selectedDate)))
      dispatch(fetchDoserLogs(getDateFromInput(selectedDate)))
    }
  }, [dispatch, selectedDate])

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
            {/* <h3>Log Viewer</h3> */}
            <div className={cls.logToolbar}>
              <span className={cls.pill} id="matchInfo">{[...getLogs()].length} lines</span>
              <select className={"form-select"} data-bs-theme="dark" id="logType" onChange={(e) => setSelect(e.currentTarget.value)}>
                <option value="all">All Types</option>
                <option value="system">System</option>
                <option value="relay">Relay</option>
                <option value="doser">DOSER</option>
              </select>
              <input
                className={`form-control ${errors.date ? "is-invalid" : ""}`}
                data-bs-theme="dark"
                id="onTime"
                type="date"
                {...register("date", {
                  required: "",
                  validate: validateDate,
                })}
              />
            </div>
          </div>

          <div className={cls.viewerWrap}>
            <div className={cls.viewer} id="viewer" ref={containerRef}>
              {[...getLogs()].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()).map((line) => (
                <div className={cls.line} key={Math.random()}>
                  <span className={cls.time}>{formatTimestamp(line.timestamp)}</span>
                  <span className={classNames(cls.type, { [cls.system]: line.category === "system", [cls.relay]: line.category === "relay", [cls.doser]: line.category === "doser" }, [])}>{line.type.toUpperCase()}</span>
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
