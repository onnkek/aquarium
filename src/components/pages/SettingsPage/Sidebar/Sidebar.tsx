import React from 'react'
import './Sidebar.sass'
import { NavLink } from 'react-router-dom'
import { Bell, Brush, Calendar, ClockHistory, Person, Sticky } from 'react-bootstrap-icons'

const Sidebar = () => {
    const setActive = ({ isActive }: any) => isActive ? "sidebar-item-link sidebar-item-link-active" : "sidebar-item-link"
    return (
        <>
            <div className='sidebar'>
                <ul className='sidebar-list'>
                    <NavLink
                        className={setActive}
                        to='/settings/profile'>
                        <li className='sidebar-list-item'>
                            <div className='sidebar-item-icon'>
                                <Person className="main-icon" size={20} />
                            </div>
                            <span>Profile</span>
                        </li>
                    </NavLink>
                    <NavLink
                        className={setActive}
                        to='/settings/appearance'>
                        <li className='sidebar-list-item'>
                            <div className='sidebar-item-icon'>
                                <Brush className="main-icon" />
                            </div>
                            <span>Appearance</span>
                        </li>
                    </NavLink>
                    <NavLink
                        className={setActive}
                        to='/settings/time'>
                        <li className='sidebar-list-item'>
                            <div className='sidebar-item-icon'>
                                <ClockHistory className="main-icon" />
                            </div>
                            <span>Time task</span>
                        </li>
                    </NavLink>
                    <NavLink
                        className={setActive}
                        to='/settings/badges'>
                        <li className='sidebar-list-item'>
                            <div className='sidebar-item-icon'>
                                <Sticky className="main-icon" />
                            </div>
                            <span>Badges</span>
                        </li>
                    </NavLink>
                    <NavLink
                        className={setActive}
                        to='/settings/notifications'>
                        <li className='sidebar-list-item'>
                            <div className='sidebar-item-icon'>
                                <Bell className="main-icon" />
                            </div>
                            <span>Notifications</span>
                        </li>
                    </NavLink>
                    <NavLink
                        className={setActive}
                        to='/settings/date'>
                        <li className='sidebar-list-item'>
                            <div className='sidebar-item-icon'>
                                <Calendar className="main-icon" />
                            </div>
                            <span>Date</span>
                        </li>
                    </NavLink>
                </ul>
            </div>
        </>
    )
}

export default Sidebar