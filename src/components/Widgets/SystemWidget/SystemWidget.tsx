import React, { MouseEvent, ReactNode, useState } from "react"
import cls from './SystemWidget.module.sass'
import { useAppDispatch, useAppSelector } from "../../../models/Hook"
import { Modal } from "components/Modal"
import { Input } from "components/Input"
import { Button } from "components/Button"
import { ReactComponent as Spinner } from 'assets/icons/spinner.svg';
import { ReactComponent as ChipIcon } from 'assets/icons/aquarium/chip.svg';
import { ReactComponent as TimeIcon } from 'assets/icons/aquarium/time.svg';
import { ReactComponent as SDIcon } from 'assets/icons/aquarium/sd.svg';
import { ReactComponent as ArrowClockwiseIcon } from 'assets/icons/aquarium/arrow-clockwise.svg';
import { ReactComponent as TempIcon } from 'assets/icons/aquarium/temp2.svg';
import { ReactComponent as HumidityIcon } from 'assets/icons/aquarium/humidity.svg';
import { Status } from "models/Status"
import { updateSystem } from "../../../redux/AquariumSlice"
import { Progress } from "components/Progress"
import { WidgetWrapper } from "../WidgetWrapper"
import { getUptime } from "helpers/period"
interface SystemWidgetProps {
  prop?: string
}

const SystemWidget = ({ prop }: SystemWidgetProps) => {
  const dispatch = useAppDispatch()
  const [showModal, setShowModal] = useState(false)
  const system = useAppSelector(state => state.aquarium.config.system)
  const systemCurrent = useAppSelector(state => state.aquarium.currentInfo.system)
  const status = useAppSelector(state => state.aquarium.status)

  const [updateTime, setUpdateTime] = useState(system.update)


  const openModal = () => {
    setUpdateTime(system.update)
    setShowModal(true);
  }
  const closeModal = () => {
    setShowModal(false);
  }


  const sendConfig = async () => {
    await dispatch(updateSystem({ update: updateTime }))
    if (status === Status.Succeeded) {
      setUpdateTime(system.update)
      closeModal()
    }
  }
  return (
    <WidgetWrapper color='white' onClickEdit={openModal} className={cls.wrapper}>
      <div className={cls.left}>

        <div className={cls.text_wrapper}>
          <TimeIcon className={cls.icon} />
          <div>
            <p className={cls.text_header}>Uptime</p>
            <p className={cls.text}>{getUptime(systemCurrent.uptime, false)}</p>
          </div>
        </div>
        <div className={cls.text_wrapper}>
          <ArrowClockwiseIcon className={cls.icon} />
          <div>
            <p className={cls.text_header}>Update time</p>
            <p className={cls.text}>{system.update} sec</p>
          </div>
        </div>
        <div className={cls.text_wrapper}>
          <SDIcon className={cls.icon} />
          <div>
            <p className={cls.text_header}>Space</p>
            <Progress className={cls.progress} text="none" value={systemCurrent.usedSpace / systemCurrent.totalSpace * 100} />
            <div className={cls.space_items}>
              <p className={cls.space_item}>{(systemCurrent.usedSpace / 1024 / 1024).toFixed(1)} MB</p>
              <p className={cls.space_item}>{(systemCurrent.freeSpace / 1024 / 1024 / 1024).toFixed(1)} GB</p>
            </div>
          </div>

        </div>
      </div>
      <div className={cls.right}>
        <div className={cls.text_wrapper}>
          <ChipIcon className={cls.icon} />
          <div>
            <p className={cls.text_header}>Chip temperature</p>
            <p className={cls.text}>{systemCurrent.chipTemp} ℃</p>
          </div>
        </div>
        <div className={cls.text_wrapper}>
          <TempIcon className={cls.icon} />
          <div>
            <p className={cls.text_header}>Outside temperature</p>
            <p className={cls.text}>{systemCurrent.temp} ℃</p>
          </div>
        </div>
        <div className={cls.text_wrapper}>
          <HumidityIcon className={cls.icon} />
          <div>
            <p className={cls.text_header}>Outside humidity</p>
            <p className={cls.text}>{systemCurrent.humidity} %</p>
          </div>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={closeModal} iconColor='green' bgWrapper='none' style='none'>
        <WidgetWrapper color='white' type='write' onClickEdit={closeModal}>
          <div className={cls.edit}>
            <div className={cls.edit_right}>
              <ChipIcon className={cls.edit_icon} />
              <div>
                <div className={cls.edit_text_wrapper}>
                  <p className={cls.edit_text_header}>Update time</p>
                  <Input type="number" value={updateTime} onChange={(e) => setUpdateTime(Number(e.target.value))} />
                </div>
              </div>
            </div>
            <div className={cls.buttons}>
              {status !== Status.Loading ? (
                <>
                  <Button width='170px' size='L' theme='outline-transp' onClick={closeModal}>Cancel</Button>
                  <Button width='170px' size='L' onClick={sendConfig}>Confirm</Button>
                </>
              ) : (
                <>
                  <Button width='170px' size='L' theme='outline' disabled>Cancel</Button>
                  <Button width='170px' size='L' disabled>
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

export default SystemWidget