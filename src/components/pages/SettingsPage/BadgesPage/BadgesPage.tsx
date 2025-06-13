import React, { useState, useEffect } from 'react'
import './BadgesPage.sass'
import SettingsHeader from '../SettingsHeader/SettingsHeader'
import { PlusLg } from 'react-bootstrap-icons'
import Badge, { BadgeType } from '../../../UI/Badge/Badge'
import { useAppDispatch, useAppSelector } from '../../../../models/Hook'
import { addBadge, getBadges, removeBadge } from '../../../../redux/BadgesSlice'
import BadgeInput from '../../../UI/BadgeInput/BadgeInput'
import BadgePalette from '../../../UI/BadgePalette/BadgePalette'
import { Status } from '../../../../models/Status'
import Spinner from '../../../UI/Spinner/Spinner'

export enum Colors {
	Primary,
	Success,
	Danger,
	Warning,
	Purpl,
	PrimaryOutline,
	SuccessOutline,
	DangerOutline,
	WarningOutline,
	PurplOutline
}

const BadgesPage = () => {

	const dispatch = useAppDispatch()
	const status = useAppSelector(state => state.badges.status)
	const [text, setText] = useState('')
	const [color, setColor] = useState(Colors.Primary)
	const badges = useAppSelector(state => state.badges.badges)
	const addStatus = useAppSelector(state => state.badges.addStatus)

	useEffect(() => {
		if (status === Status.Idle) {
			dispatch(getBadges())
		}
	}, [status, dispatch])

	const addBadgeHandler = async () => {
		await dispatch(addBadge({ text, color }))
		setText('')
	}
	const badgesContent = badges && badges.map(badge => {
		const id = badge.id
		return (<li key={badge.id}>
			<Badge badge={badge} type={BadgeType.Add} onClick={() => { dispatch(removeBadge({ id })) }} /></li>)
	})

	const buttonContent = addStatus === Status.Loading ? (
		<Spinner className='spinner-small p-spinner' />
	) : (
		<PlusLg size={22} />
	)

	return (
		<>
			<div className="settings-item">
				<SettingsHeader title='Badges preferences' />


				<label className="profile-form-group-label form-label">
					Select badge type
				</label>

				<BadgePalette color={color} setColor={setColor} />


				<div className="profile-from-group-descr">
					You can choose the color that will be used
					when applying this badge to posts.
				</div>

				<form className="form-1 col-12 mt-3">
					<div className="badge-form-group">

						<label className="profile-form-group-label form-label">
							Create new badge
						</label>

						<div className='add-badge-wrapper'>

							<BadgeInput text={text} setText={setText} color={color} />

							<button type="button" className="add-button btn btn-primary outline"
								onClick={addBadgeHandler}
							>{buttonContent}</button>
						</div>
						<div className="profile-from-group-descr">
							You can choose the text that will be written
							inside the badge when applying this badge to posts.
						</div>

					</div>
				</form>

				<label className="profile-form-group-label form-label m-0 mt-3">
					Available badges
				</label>
				{status === Status.Loading && (
					<div className="col-12 placeholder-wave placeholder-glow">
						<div className="row m-1 badges-placeholder">
							<span className="rounded placeholder bg-primary col-4"></span>
							<span className="rounded placeholder bg-danger col-3"></span>
							<span className="rounded placeholder bg-success col-1"></span>
							<span className="rounded placeholder bg-danger col-2"></span>
							<span className="rounded placeholder bg-warning col-3"></span>
							<span className="rounded placeholder bg-purpl col-1"></span>
							<span className="rounded placeholder bg-warning col-2"></span>
							<span className="rounded placeholder bg-primary col-3"></span>
							<span className="rounded placeholder bg-danger col-1"></span>
							<span className="rounded placeholder bg-purpl col-2"></span>
							<span className="rounded placeholder bg-danger col-3"></span>
							<span className="rounded placeholder bg-success col-2"></span>
							<span className="rounded placeholder bg-warning col-2"></span>
							<span className="rounded placeholder bg-purpl col-1"></span>
						</div>
					</div>
				)}
				<ul className='custom-badges-list'>
					{badgesContent}
				</ul>

				<div className="profile-from-group-descr">
					User-created badges are displayed here, which can be used
					to customize posts, they can be deleted.
				</div>
			</div>

		</>
	)
}

export default BadgesPage