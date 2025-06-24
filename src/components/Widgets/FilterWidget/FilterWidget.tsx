import React, { MouseEvent, ReactNode, useState } from "react"
import cls from './FilterWidget.module.sass'
import { useAppDispatch, useAppSelector } from "../../../models/Hook"
import { Toggle } from "components/Toggle"
import { Modal } from "components/Modal"
import { Status } from "models/Status"
import { Button } from "components/Button"
import { ReactComponent as Spinner } from 'assets/icons/spinner.svg';
import { ReactComponent as FilterIcon } from 'assets/icons/aquarium/filter.svg';
import { updateFilterState } from "../../../redux/AquariumSlice"
import { WidgetWrapper } from "../WidgetWrapper"

interface FilterWidgetProps {
  prop?: string
}

const FilterWidget = ({ prop }: FilterWidgetProps) => {
  const dispatch = useAppDispatch()
  const filter = useAppSelector(state => state.aquarium.currentInfo.filter.status)
  const [showApprove, setShowApprove] = useState(false)
  const status = useAppSelector(state => state.aquarium.status)

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

  return (
    <WidgetWrapper color='tiffany'>
      <div className={cls.left}>
        <div className={cls.icon_wrapper}>
          <FilterIcon className={cls.icon} />
        </div>

        <Toggle className={cls.toggle} size="XL" checked={filter} onClick={openApprove} />
      </div>
      <div className={cls.right}>
        <div>
          <div className={cls.text_wrapper}>
            <p className={cls.text_header}>Work time</p>
            <p className={cls.text}>24/7</p>
          </div>
        </div>
      </div>

      <Modal isOpen={showApprove} onClose={closeApprove} iconColor='green' bgWrapper='none'>
        <div className="co2__form">
          <div className="co2__input">
            <label className="co2__label">
              This will lead to filter shutdown. Do you agree?
            </label>
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