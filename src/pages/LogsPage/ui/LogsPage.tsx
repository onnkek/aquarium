
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
    dispatch(switchModal(true));
    dispatch(getSystemLogs())
    dispatch(getRelayLogs())
    dispatch(getDoserLogs())
  }, [dispatch])
  // useEffect(() => {
  //   if (containerRef.current) {
  //     containerRef.current.scrollTop = containerRef.current.scrollHeight;
  //   }
  // }, [closeLogs]);
  return (
    <Page className={classNames(cls.logsPage, {}, [className])}>
      <div className={cls.log_body}>
        <div className={cls.log_header}>
          <h2 className={cls.log_title}>Logs</h2>
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
        <div ref={containerRef} className={cls.log_container}>
          {logStatus === Status.Loading &&
            <div className={cls.spinner_container}>
              <Spinner className={cls.spinner} />
            </div>
          }
          {selectLog === "System" && logStatus === Status.Succeeded &&
            <pre className={cls.log_text}>{logs.system}</pre>
          }
          {selectLog === "Relay" && logStatus === Status.Succeeded &&
            <pre className={cls.log_text}>{logs.relay}</pre>
          }
          {selectLog === "Doser" && logStatus === Status.Succeeded &&
            <pre className={cls.log_text}>{logs.doser}</pre>
          }
        </div>
      </div>
    </Page>
  );
};
