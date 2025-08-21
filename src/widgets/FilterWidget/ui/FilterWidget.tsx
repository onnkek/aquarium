import React, { useState } from "react"
import cls from './FilterWidget.module.sass'
import { useAppDispatch, useAppSelector } from "models/Hook"
import { Toggle } from "shared/ui/Toggle"
import { Modal } from "shared/ui/Modal"
import { Status } from "models/Status"
import { Button } from "shared/ui/Button"
import { ReactComponent as Spinner } from 'shared/assets/icons/spinner.svg';
import { ReactComponent as FilterIcon } from 'shared/assets/icons/aquarium/filter.svg';
import { getCurrentInfo, switchModal, updateFilter } from "../../../redux/AquariumSlice"
import { Dropdown } from "shared/ui/Dropdown"
import { Input } from "shared/ui/Input"
import { getStringMode, invertMode } from "shared/lib/period"
import { WidgetWrapper } from "widgets/WidgetWrapper"

interface FilterWidgetProps {
  prop?: string
}

export const FilterWidget = ({ prop }: FilterWidgetProps) => {
  const dispatch = useAppDispatch()
  const filter = useAppSelector(state => state.aquarium.config.filter)
  const filterCurrent = useAppSelector(state => state.aquarium.currentInfo.filter.status)
  const [showModal, setShowModal] = useState(false)
  const status = useAppSelector(state => state.aquarium.status)

  const [onTime, setOnTime] = useState(filter.on)
  const [offTime, setOffTime] = useState(filter.off)
  const [mode, setMode] = useState(filter.mode)

  const openModal = () => {
    dispatch(switchModal(true));
    setOnTime(filter.on)
    setOffTime(filter.off)
    setMode(filter.mode)
    setShowModal(true);
  }
  const closeModal = () => {
    dispatch(switchModal(false));
    setShowModal(false);
  }
  const sendFilterState = async () => {
    await dispatch(updateFilter({ on: onTime, off: offTime, mode: invertMode(mode) }))
    if (status === Status.Succeeded) {

      setMode(invertMode(mode))
      setTimeout(() => {
        dispatch(getCurrentInfo())
      }, 200);

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
    <WidgetWrapper color='tiffany' onClickEdit={openModal} className={cls.filterWidget} state={filterCurrent}>
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
      <Modal isOpen={showModal} onClose={closeModal} iconColor='green' bgWrapper='none' modalStyle='none'>
        <WidgetWrapper color='tiffany' type='write' onClickEdit={closeModal} className={cls.wrapper} state={filterCurrent}>
          <div className={cls.edit}>
            <div className={cls.edit_right}>
              <div className={cls.edit_header}>
                <FilterIcon className={cls.edit_icon} />
                <div className={cls.edit_header_text}>Filter settings</div>
              </div>
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
                <div className={cls.edit_group}>
                  {mode === 2 && <div className={cls.edit_text_wrapper}>
                    <p className={cls.edit_text_header}>On Time</p>
                    <Input type="time" value={onTime} onChange={(e) => setOnTime(e.target.value)} />
                  </div>}
                  {mode === 2 && <div className={cls.edit_text_wrapper}>
                    <p className={cls.edit_text_header}>Off Time</p>
                    <Input type="time" value={offTime} onChange={(e) => setOffTime(e.target.value)} />
                  </div>}
                  {mode !== 2 && <div className={cls.edit_text_wrapper}>
                    <p className={cls.edit_text_header}>State</p>
                    <Toggle className={cls.toggle} size="XL" checked={filterCurrent} onClick={sendFilterState} />
                  </div>}
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