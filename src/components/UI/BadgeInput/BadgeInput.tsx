import React from 'react'
import './BadgeInput.sass'
import { Colors } from '../../pages/SettingsPage/BadgesPage/BadgesPage'

interface PropsType {
	text: string
	color: Colors
	setText: (text: string) => void
}


const BadgeInput: React.FC<PropsType> = ({ text, setText, color }) => {

	let colorClass = ''
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

	return (
		<input
			className={`add-badge badge-input ${colorClass}`}
			value={text}
			onChange={e => setText(e.target.value)}
		/>
	)
}

export default BadgeInput