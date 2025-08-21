
import { Page } from "widgets/Page";
import { classNames } from "shared/lib/classNames";
import cls from './ArchivePage.module.sass';
import { Dropdown } from "shared/ui/Dropdown";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "models/Hook";
import { Status } from "models/Status";
import { ReactComponent as Spinner } from 'shared/assets/icons/spinner.svg';
import { switchModal } from "../../../redux/AquariumSlice";

export interface ArchivePageProps {
  className?: string;
}

export const ArchivePage = ({ className }: ArchivePageProps) => {
  const dispatch = useAppDispatch()
  const [selectArchive, setSelectArchive] = useState("Chip tempurature")
  // const logs = useAppSelector(state => state.aquarium.logs)
  const logStatus = useAppSelector(state => state.aquarium.logStatus)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    dispatch(switchModal(true));
    // fetch archive
  }, [dispatch])

  return (
    <Page className={classNames(cls.archivePage, {}, [className])}>
      <div className={cls.log_body}>
        <div className={cls.log_header}>
          <h2 className={cls.log_title}>Archive</h2>
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
        <div ref={containerRef} className={cls.log_container}>
          {logStatus === Status.Loading &&
            <div className={cls.spinner_container}>
              <Spinner className={cls.spinner} />
            </div>
          }
          {selectArchive === "Chip tempurature" && logStatus === Status.Succeeded &&
            <pre className={cls.log}>Chip tempurature</pre>
          }
          {selectArchive === "Water tempurature" && logStatus === Status.Succeeded &&
            <pre className={cls.log}>Water tempurature</pre>
          }
          {selectArchive === "Air temperature" && logStatus === Status.Succeeded &&
            <pre className={cls.log}>Air temperature</pre>
          }
          {selectArchive === "Humidity" && logStatus === Status.Succeeded &&
            <pre className={cls.log}>Humidity</pre>
          }
        </div>
      </div>
    </Page>
  );
};
