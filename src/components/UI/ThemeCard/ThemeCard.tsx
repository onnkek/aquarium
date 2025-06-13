import React from 'react'
import './ThemeCard.sass'
import ThemeExample from '../ThemeExample/ThemeExample'
import ThemeColorsPalette from '../ThemeColorsPalette/ThemeColorsPalette'

interface PropsType {
    dark?: string
    active: string
    setActive: () => void
}

const ThemeCard: React.FC<PropsType> = ({ dark, active, setActive }) => {
    return (
        <div className="settings-theme-item">
            <div className={`settings-theme-card ${active && 'settings-theme-card-active'}`}>
                <div className="theme-card-header" onClick={setActive}>
                    <div className="theme-card-container">
                        <h4>Day theme</h4>
                    </div>
                </div>
                <div className="theme-card-body">
                    <div className="theme-card-container">
                        <div className="theme-card-descr">
                            This theme will be active when your system is set to
                            “light mode”
                        </div>
                        <div className="theme-card-example">
                            <ThemeExample dark={dark} />
                            <div className="example-descr">Light default</div>
                        </div>
                        <ThemeColorsPalette active={active} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ThemeCard