import React, { MouseEvent, ReactNode, useState } from "react"
import cls from './FilterWidget.module.sass'
import { useAppDispatch, useAppSelector } from "../../../models/Hook"
import { Toggle } from "components/Toggle"
import { Modal } from "components/Modal"
import { Status } from "models/Status"
import { Button } from "components/Button"
import { ReactComponent as Spinner } from 'assets/icons/spinner.svg';
import { ReactComponent as FilterIcon } from 'assets/icons/aquarium/filter.svg';
import { getCurrentInfo, updateFilter, updateFilterState } from "../../../redux/AquariumSlice"
import { WidgetWrapper } from "../WidgetWrapper"
import { Dropdown } from "components/Dropdown"
import { Input } from "components/Input"
import { getStringMode, invertMode } from "helpers/period"

interface FilterWidgetProps {
  prop?: string
}

const FilterWidget = ({ prop }: FilterWidgetProps) => {
  const dispatch = useAppDispatch()
  const filter = useAppSelector(state => state.aquarium.config.filter)
  const filterCurrent = useAppSelector(state => state.aquarium.currentInfo.filter.status)
  const [showModal, setShowModal] = useState(false)
  const status = useAppSelector(state => state.aquarium.status)

  const [onTime, setOnTime] = useState(filter.on)
  const [offTime, setOffTime] = useState(filter.off)
  const [mode, setMode] = useState(filter.mode)

  const openModal = () => {
    setOnTime(filter.on)
    setOffTime(filter.off)
    setMode(filter.mode)
    setShowModal(true);
  }
  const closeModal = () => {
    setShowModal(false);
  }
  const sendFilterState = async () => {
    await dispatch(updateFilter({ on: onTime, off: offTime, mode: invertMode(mode) }))
    if (status === Status.Succeeded) {

      setMode(invertMode(mode)) 
      dispatch(getCurrentInfo())
    }
  }
  const sendConfig = async () => {
    await dispatch(updateFilter({ on: onTime, off: offTime, mode: mode }))
    if (status === Status.Succeeded) {
      setOnTime(filter.on)
      setOffTime(filter.off)
      setMode(filter.mode)
      closeModal()
    }
  }
  const selectMode = async (mode: number) => {
    setMode(mode);
    await dispatch(updateFilter({ on: onTime, off: offTime, mode: mode }))
  }

  return (
    <WidgetWrapper color='tiffany' onClickEdit={openModal} className={cls.widget_wrapper} state={filterCurrent}>
      <div className={cls.left}>
        <div className={cls.icon_wrapper}>
          <FilterIcon className={cls.icon} />
        </div>
      </div>
      <div className={cls.right}>
        <div>
          <div className={cls.text_wrapper}>
            <p className={cls.text_header}>Mode</p>
            <p className={cls.text}>{getStringMode(filter.mode)}</p>
          </div>
          {filter.mode === 2 && <div className={cls.text_wrapper}>
            <p className={cls.text_header}>On Time</p>
            <p className={cls.text}>{filter.on}</p>
          </div>}
          {filter.mode === 2 && <div className={cls.text_wrapper}>
            <p className={cls.text_header}>Off Time</p>
            <p className={cls.text}>{filter.off}</p>
          </div>}
        </div>
      </div>
      <Modal isOpen={showModal} onClose={closeModal} iconColor='green' bgWrapper='none' style='none'>
        <WidgetWrapper color='tiffany' type='write' onClickEdit={closeModal} className={cls.wrapper} state={filterCurrent}>
          <div className={cls.edit}>
            <div className={cls.edit_right}>
              <FilterIcon className={cls.edit_icon} />
              <div className={cls.edit_wrapper}>
                <div className={cls.text_wrapper}>
                  <p className={cls.edit_text_header}>
                    Mode
                  </p>
                  <Dropdown className={cls.dropdown} select={getStringMode(mode)} items={[
                    [{
                      content: 'Auto',
                      onClick: () => selectMode(2)
                    },
                    {
                      content: 'Manual',
                      onClick: () => selectMode(Number(filterCurrent))
                    }]
                  ]} />
                </div>
                {mode === 2 && <div className={cls.text_wrapper}>
                  <p className={cls.edit_text_header}>On Time</p>
                  <Input type="time" value={onTime} onChange={(e) => setOnTime(e.target.value)} />
                </div>}
                {mode === 2 && <div className={cls.text_wrapper}>
                  <p className={cls.edit_text_header}>Off Time</p>
                  <Input type="time" value={offTime} onChange={(e) => setOffTime(e.target.value)} />
                </div>}
                {mode !== 2 && <div className={cls.text_wrapper}>
                  <p className={cls.edit_text_header}>State</p>
                  <Toggle className={cls.toggle} size="XL" checked={filterCurrent} onClick={sendFilterState} />
                </div>}
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

export default FilterWidget