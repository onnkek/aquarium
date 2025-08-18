import React, { MouseEvent, ReactNode, useState } from "react"
import cls from './FilterWidget.module.sass'
import { useAppDispatch, useAppSelector } from "../../../models/Hook"
import { Toggle } from "components/Toggle"
import { Modal } from "components/Modal"
import { Status } from "models/Status"
import { Button } from "components/Button"
import { ReactComponent as Spinner } from 'assets/icons/spinner.svg';
import { ReactComponent as FilterIcon } from 'assets/icons/aquarium/filter.svg';
import { updateFilter, updateFilterState } from "../../../redux/AquariumSlice"
import { WidgetWrapper } from "../WidgetWrapper"
import { Dropdown } from "components/Dropdown"
import { Input } from "components/Input"

interface FilterWidgetProps {
  prop?: string
}

const FilterWidget = ({ prop }: FilterWidgetProps) => {
  const dispatch = useAppDispatch()
  const filter = useAppSelector(state => state.aquarium.config.filter)
  const filterCurrent = useAppSelector(state => state.aquarium.currentInfo.filter.status)
  const [showApprove, setShowApprove] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const status = useAppSelector(state => state.aquarium.status)

  const [onTime, setOnTime] = useState(filter.on)
  const [offTime, setOffTime] = useState(filter.off)
  const [mode, setMode] = useState("Auto")

  const openModal = () => {
    console.log("test")
    // setOnTime(co2.on)
    // setOffTime(co2.off)
    setShowModal(true);
  }
  const closeModal = () => {
    setShowModal(false);
  }
  const openApprove = () => {
    setShowApprove(true);
  }
  const closeApprove = () => {
    setShowApprove(false);
  }
  const sendFilterState = async () => {
    await dispatch(updateFilterState(!filter))
    if (status === Status.Succeeded) {
      closeApprove()
    }
  }
  const sendConfig = async () => {
    await dispatch(updateFilter({ on: onTime, off: offTime }))
    if (status === Status.Succeeded) {
      setOnTime(filter.on)
      setOnTime(filter.off)
      closeModal()
    }
  }

  return (
    <WidgetWrapper color='tiffany' onClickEdit={openModal} className={cls.widget_wrapper} state={filterCurrent}>
      <div className={cls.left}>
        <div className={cls.icon_wrapper}>
          <FilterIcon className={cls.icon} />
        </div>
        {/* <Toggle className={cls.toggle} size="XL" checked={filter} onClick={openApprove} /> */}
      </div>
      <div className={cls.right}>
        <div>
          <div className={cls.text_wrapper}>
            <p className={cls.text_header}>Mode</p>
            <p className={cls.text}>{mode}</p>
          </div>
          {mode === "Auto" && <div className={cls.text_wrapper}>
            <p className={cls.text_header}>On Time</p>
            <p className={cls.text}>{filter.on}</p>
          </div>}
          {mode === "Auto" && <div className={cls.text_wrapper}>
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
                  <Dropdown className={cls.dropdown} select={mode} items={[
                    [{
                      content: 'Auto',
                      onClick: () => setMode("Auto")
                    },
                    {
                      content: 'Manual',
                      onClick: () => setMode("Manual")
                    }]
                  ]} />
                </div>
                {mode === "Auto" && <div className={cls.text_wrapper}>
                  <p className={cls.edit_text_header}>On Time</p>
                  <Input type="time" value={onTime} onChange={(e) => setOnTime(e.target.value)} />
                </div>}
                {mode === "Auto" && <div className={cls.text_wrapper}>
                  <p className={cls.edit_text_header}>Off Time</p>
                  <Input type="time" value={offTime} onChange={(e) => setOffTime(e.target.value)} />
                </div>}
                {mode === "Manual" && <div className={cls.text_wrapper}>
                  <p className={cls.edit_text_header}>State</p>
                  <Toggle className={cls.toggle} size="XL" checked={filterCurrent} onClick={() => { }} />
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
      <Modal isOpen={showApprove} onClose={closeApprove} iconColor='green' bgWrapper='none'>
        <div>
          <div>
            <p className={cls.agree}>
              Filtering will be {filter ? 'switched off' : 'switched on'}.
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', marginTop: '32px', justifyContent: 'space-between' }}>
          {status !== Status.Loading ? (
            <>
              <Button width='170px' size='L' theme='outline' onClick={closeApprove}>Cancel</Button>
              <Button width='170px' size='L' onClick={sendFilterState}>Agree</Button>
            </>
          ) : (
            <>
              <Button width='170px' size='L' theme='outline' onClick={closeApprove} disabled>Cancel</Button>
              <Button width='170px' size='L' onClick={sendFilterState} disabled>
                <Spinner />
                Loading...
              </Button>
            </>
          )}
        </div>
      </Modal>
    </WidgetWrapper>
  )
}

export default FilterWidget