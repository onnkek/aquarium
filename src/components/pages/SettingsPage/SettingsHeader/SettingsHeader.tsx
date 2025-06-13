import React from 'react'
import './SettingsHeader.sass'
import Spinner from "../../../UI/Spinner/Spinner"
import { CheckLg } from "react-bootstrap-icons"
import { useAppSelector } from '../../../../models/Hook'
import { Status } from '../../../../models/Status'

const SettingsHeader = ({ title }: any) => {
	const status = useAppSelector(state => state.settings.settingStatus)


	return (
		<div className="settings-header-container">
			<h2 className="settings-header">{title}</h2>
			<div className="settings-check">
				{status === Status.Loading && <Spinner className='spinner-small' />}
				{status === Status.Succeeded &&
					<>
						<div className="settings-check-icon">
							<CheckLg className="icon-check" />
						</div>
						<span className="settings-check-title">Saved</span>
					</>
				}
			</div>
		</div>
	)
}

export default SettingsHeader