import React, { useEffect, useState } from "react"
import cls from './SystemWidget.module.sass'
import { Modal } from "shared/ui/Modal"
import { Input } from "shared/ui/Input"
import { Button } from "shared/ui/Button"
import { ReactComponent as Spinner } from 'shared/assets/icons/spinner.svg';
import { ReactComponent as ChipIcon } from 'shared/assets/icons/aquarium/chip.svg';
import { ReactComponent as TimeIcon } from 'shared/assets/icons/aquarium/time.svg';
import { ReactComponent as SDIcon } from 'shared/assets/icons/aquarium/sd.svg';
import { ReactComponent as ArrowClockwiseIcon } from 'shared/assets/icons/aquarium/arrow-clockwise.svg';
import { ReactComponent as TempIcon } from 'shared/assets/icons/aquarium/temp2.svg';
import { ReactComponent as HumidityIcon } from 'shared/assets/icons/aquarium/humidity.svg';
import { ReactComponent as CalendarIcon } from 'shared/assets/icons/aquarium/calendar.svg';
import { ReactComponent as UptimeIcon } from 'shared/assets/icons/aquarium/arrow-up.svg';
import { ReactComponent as RAMIcon } from 'shared/assets/icons/aquarium/ram.svg';
import { Status } from "models/Status"
import { getCurrentInfo, switchModal, updateDateTime, updateSystem } from "../../../redux/AquariumSlice"
import { Progress } from "shared/ui/Progress"
import { getDateTimeISO, getDateString, getTimeString, getUptime, getDateTimeFromInput } from "shared/lib/period"
import { useAppDispatch, useAppSelector } from "models/Hook"
import { WidgetWrapper } from "widgets/WidgetWrapper"
interface SystemWidgetProps {
  prop?: string
}

export const SystemWidget = ({ prop }: SystemWidgetProps) => {
  const dispatch = useAppDispatch()
  const [showModal, setShowModal] = useState(false)
  const system = useAppSelector(state => state.aquarium.config.system)
  const systemCurrent = useAppSelector(state => state.aquarium.currentInfo.system)
  const status = useAppSelector(state => state.aquarium.status)
  const lastSuccess = useAppSelector(state => state.aquarium.lastSuccess)

  const [updateTime, setUpdateTime] = useState(system.update)
  const [dateTime, setDateTime] = useState(systemCurrent.time)

  const [isAlive, setIsAlive] = useState(true)

  const openModal = () => {
    dispatch(switchModal(true));
    setUpdateTime(system.update)
    setDateTime(systemCurrent.time)
    setShowModal(true);
  }
  const closeModal = () => {
    dispatch(switchModal(false));
    setShowModal(false);
  }


  const sendConfig = async () => {
    await dispatch(updateSystem({ update: updateTime }))
    await dispatch(updateDateTime({ dateTime: dateTime }))
    if (status === Status.Succeeded) {
      setUpdateTime(system.update)
      setTimeout(() => {
        dispatch(getCurrentInfo())
      }, 200);
      closeModal()
    }
  }
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAlive(Date.now() - lastSuccess <= system.update * 2 * 1000);
    }, 500)

    return () => clearInterval(interval);
  }, [lastSuccess, system.update])

  return (
    <WidgetWrapper color='white' onClickEdit={openModal} className={cls.systemWidget} state={isAlive}>
      <div className={cls.left}>
        {/* <div className={cls.text_wrapper}>
          <CalendarIcon className={cls.icon} />
          <div> 
            <p className={cls.text_header}>System date</p>
            <p className={cls.text}>{getDateString(systemCurrent.time)}</p>
          </div>
        </div> */}
        {/* <div className={cls.text_wrapper}>
          <TimeIcon className={cls.icon} />
          <div>
            <p className={cls.text_header}>System time</p>
            <p className={cls.text}>{getTimeString(systemCurrent.time)}</p>
          </div>
        </div> */}
        <div className={cls.text_wrapper}>
          <UptimeIcon className={cls.icon} />
          <div>
            <p className={cls.text_header}>Uptime</p>
            <p className={cls.text}>{getUptime(systemCurrent.uptime, false)}</p>
          </div>
        </div>
      </div>
      <div className={cls.left}>
        <div className={cls.text_wrapper}>
          <ArrowClockwiseIcon className={cls.icon} />
          <div>
            <p className={cls.text_header}>Update time</p>
            <p className={cls.text}>{system.update} sec</p>
          </div>
        </div>
        <div className={cls.text_wrapper}>
          <SDIcon className={cls.icon} />
          <div className={cls.space_right}>
            <p className={cls.text_header}>Space</p>
            <Progress className={cls.progress} text="none" value={systemCurrent.usedSpace / systemCurrent.totalSpace * 100} />
            <div className={cls.space_items}>
              <p className={cls.space_item}>{(systemCurrent.usedSpace / 1024 / 1024).toFixed(1)} MB</p>
              <p className={cls.space_item}>{(systemCurrent.freeSpace / 1024 / 1024 / 1024).toFixed(1)} GB</p>
            </div>
          </div>
        </div>
        <div className={cls.text_wrapper}>
          <RAMIcon className={cls.icon} />
          <div className={cls.space_right}>
            <p className={cls.text_header}>RAM</p>
            <Progress className={cls.progress} text="none" value={(systemCurrent.heapSize - systemCurrent.freeHeap) / systemCurrent.heapSize * 100} />
            <div className={cls.space_items}>
              <p className={cls.space_item}>{((systemCurrent.heapSize - systemCurrent.freeHeap) / 1024).toFixed(1)} KB</p>
              <p className={cls.space_item}>{(systemCurrent.heapSize / 1024).toFixed(1)} KB</p>
            </div>
          </div>
        </div>
      </div>
      <div className={cls.right}>
        <div className={cls.text_wrapper}>
          <ChipIcon className={cls.icon} />
          <div>
            <p className={cls.text_header}>Chip temperature</p>
            <p className={cls.text}>{systemCurrent.chipTemp.toFixed(2)} ℃</p>
          </div>
        </div>
        {/* <div className={cls.text_wrapper}>
          <TempIcon className={cls.icon} />
          <div>
            <p className={cls.text_header}>Outside temperature</p>
            <p className={cls.text}>{systemCurrent.outside.temp.toFixed(2)} ℃</p>
          </div>
        </div>
        <div className={cls.text_wrapper}>
          <HumidityIcon className={cls.icon} />
          <div>
            <p className={cls.text_header}>Outside humidity</p>
            <p className={cls.text}>{systemCurrent.outside.hum.toFixed(2)} %</p>
          </div>
        </div> */}
      </div>

      <Modal isOpen={showModal} onClose={closeModal} iconColor='green' bgWrapper='none' modalStyle='none'>
        <WidgetWrapper color='white' type='write' onClickEdit={closeModal} state={isAlive} className={cls.wrapper}>
          <div className={cls.edit}>
            <div className={cls.edit_right}>
              <div className={cls.edit_header}>
                <ChipIcon className={cls.edit_icon} />
                <div className={cls.edit_header_text}>System settings</div>
              </div>

              <div className={cls.edit_wrapper}>
                <div className={cls.edit_text_wrapper}>
                  <p className={cls.edit_text_header}>Update time</p>
                  <Input type="number" value={updateTime} onChange={(e) => setUpdateTime(Number(e.target.value))} />
                </div>
                <div className={cls.edit_text_wrapper}>
                  <p className={cls.edit_text_header}>Date</p>
                  <Input type="datetime-local"
                    step={1}
                    value={getDateTimeISO(dateTime)}
                    onChange={(e) => setDateTime(
                      {
                        ...dateTime,
                        hour: getDateTimeFromInput(e.target.value).hour,
                        minute: getDateTimeFromInput(e.target.value).minute,
                        second: getDateTimeFromInput(e.target.value).second,
                        day: getDateTimeFromInput(e.target.value).day,
                        month: getDateTimeFromInput(e.target.value).month,
                        year: getDateTimeFromInput(e.target.value).year
                      }
                    )} />
                </div>
              </div>

            </div>
            <div className={cls.buttons}>
              {status !== Status.Loading ? (
                <>
                  <Button size='L' theme='outline-transp' onClick={closeModal}>Cancel</Button>
                  <Button size='L' onClick={sendConfig}>Confirm</Button>
                </>
              ) : (
                <>
                  <Button size='L' theme='outline' disabled>Cancel</Button>
                  <Button size='L' disabled>
                    <Spinner />
                    Loading...
                  </Button>
                </>
              )}
            </div>

          </div>
        </WidgetWrapper>
      </Modal>


    </WidgetWrapper>
  )
}