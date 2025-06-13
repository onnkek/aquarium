import React from 'react'
import './TimetaskPage.sass'
import Timetask from '../../../Timetask/Timetask'
import SettingsHeader from '../SettingsHeader/SettingsHeader'
import Search from '../../../Search/Search'
import { PlusLg } from 'react-bootstrap-icons'

const TimetaskPage = () => {

	return (
		<>
			{/* <Modal id='add-timetask' title='Add new timetask'>
                <TaskAddForm />
            </Modal> */}
			<div className='settings-item'>
				<SettingsHeader title='Timetask preferences' />
				<p className="settings-descr">
					Here you can add tasks that will automatically
					create cases and add them to the to-do list on a schedule.
				</p>
				<h3 className="settings-subheader">Current tasks</h3>
				<div className="search-containter">
					<Search />
					<button type="button" className="add-button btn btn-primary outline"
						data-bs-target="#add-timetask" data-bs-toggle="modal"
					><PlusLg size={22} /></button>
				</div>
				<ul className='timetask-list row'>
					<li className='timetask-item'>
						<Timetask />
					</li>
					<li className='timetask-item'>
						<Timetask />
					</li>
					<li className='timetask-item'>
						<Timetask />
					</li>
				</ul>
			</div>
		</>
	)
}

export default TimetaskPage