import React from 'react'
import './BadgePalette.sass'
import Badge from '../Badge/Badge'
import { Colors } from '../../pages/SettingsPage/BadgesPage/BadgesPage'

interface PropsType {
	color: Colors
	setColor: (color: Colors) => void
}

const BadgePalette: React.FC<PropsType> = ({ color, setColor }) => {

	const colors = [
		Colors.Primary,
		Colors.Success,
		Colors.Danger,
		Colors.Warning,
		Colors.Purpl,
		Colors.PrimaryOutline,
		Colors.SuccessOutline,
		Colors.DangerOutline,
		Colors.WarningOutline,
		Colors.PurplOutline
	]

	const content = colors.map((c, i) => {
		return (
			<li key={i}
				onClick={() => { setColor(c) }}
				className={`badge-color-item ${color === c && 'badge-color-item_active'}`}>
				<Badge badge={{ "id": 1, text: "Color", "color": c }} onClick={() => { }} />
			</li>
		)
	})


	return (
		<ul className='color-list'>
			{content}
		</ul>
	)
}

export default BadgePalette