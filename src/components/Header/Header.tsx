import React from 'react'
import './Header.sass'
import { Link } from 'react-router-dom'
import { YinYang } from 'react-bootstrap-icons'
import ControlPanel from '../ControlPanel/ControlPanel'
import logo from '../../assets/logo.svg'

const Header = () => {
	return (
		<div className='header'>
			<div className='header-global'>
				<div className='header-right'>
					<Link className='header-link' to='/'>
						<img src={logo} className='header-logo-icon'/>
						<span className='header-logo'>Aquarium</span>
					</Link>
				</div>
			</div>
			<div className='header-local'>
				<ControlPanel />
			</div>
		</div>
	)
}

export default Header