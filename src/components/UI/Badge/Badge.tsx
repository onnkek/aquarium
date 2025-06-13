import React from 'react'
import './Badge.sass'
import { X, Plus } from 'react-bootstrap-icons'
import { IBadge } from '../../../models/Badge'
import { useAppSelector } from '../../../models/Hook'
import Spinner from '../Spinner/Spinner'

interface PropsType {
	badge: IBadge
	type?: BadgeType
	onClick: (badge: IBadge) => void
}

export enum BadgeType {
	Add,
	Remove
}

const Badge: React.FC<PropsType> = (props) => {

	const removing = useAppSelector(state => state.badges.removing)
	const { id, color, text } = props.badge

	let colorClass
	switch (color) {
		case 0:
			colorClass = 'badge_primary'
			break
		case 1:
			colorClass = 'badge_success'
			break
		case 2:
			colorClass = 'badge_danger'
			break
		case 3:
			colorClass = 'badge_warning'
			break
		case 4:
			colorClass = 'badge_purpl'
			break
		case 5:
			colorClass = 'badge_primary-outline'
			break
		case 6:
			colorClass = 'badge_success-outline'
			break
		case 7:
			colorClass = 'badge_danger-outline'
			break
		case 8:
			colorClass = 'badge_warning-outline'
			break
		case 9:
			colorClass = 'badge_purpl-outline'
			break
		default:
			break
	}

	let buttonContent
	switch (props.type) {
		case BadgeType.Add:
			removing.some(badgeId => badgeId === id) ? (
				buttonContent = <Spinner className='spinner-small p-spinner' />
			) : (
				buttonContent = <X size={20} />
			)
			break
		case BadgeType.Remove:
			buttonContent = <Plus size={20} />
			break
		default:
			break
	}

	return (

		<div className={`badge ${colorClass}`}>
			<span className="badge-text">{text}</span>
			<div className="badge-btn"
				onClick={() => props.onClick(props.badge)}>
				{buttonContent}
			</div>
		</div>
	)
}

export default Badge