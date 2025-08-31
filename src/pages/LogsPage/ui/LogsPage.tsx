
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
      <div className={cls.log_body}>
        <div className={cls.log_header}>
          <ButtonGroup className={cls.group}>
            <Button
              className={classNames(cls.groupButton, { [cls.active]: selectLog === "System" }, [])}
              onClick={selectSystemLogs}
            >System</Button>
            <Button
              className={classNames(cls.groupButton, { [cls.active]: selectLog === "Relay" }, [])}
              onClick={selectRelayLogs}
            >Relay</Button>
            <Button
              className={classNames(cls.groupButton, { [cls.active]: selectLog === "Doser" }, [])}
              onClick={selectDoserLogs}
            >Doser</Button>
          </ButtonGroup>
          <Button theme='clear' className={cls.clearButton} onClick={clearLogs}>
            <TrashIcon />
          </Button>
        </div>
        <div className={cls.log_container}>
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
        <div ref={containerRef} />
      </div>
      <Navbar className={cls.navbar} />
    </Page>
  );
};
