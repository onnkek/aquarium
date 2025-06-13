import React, { useState } from 'react'
import './ThemeColorsPalette.sass'

const ThemeColorsPalette = ({ active }: any) => {

    const [color, setColor] = useState('')

    const setTheme = (color: any) => {
        if (active) {
            setColor(color);
            (document.querySelector('body') as HTMLElement)
                .setAttribute('data-color-theme', color)
        }
    }

    return (
        <div className="theme-card-colors">
            <div onClick={() => setTheme('primary')} className={`theme-card-color ${color === 'primary' ? 'theme-card-color-active' : ''}`}>
                <div className="color-item color-item-1"></div>
            </div>
            <div onClick={() => setTheme('success')} className={`theme-card-color ${color === 'success' ? 'theme-card-color-active' : ''}`}>
                <div className="color-item color-item-2"></div>
            </div>
            <div onClick={() => setTheme('danger')} className={`theme-card-color ${color === 'danger' ? 'theme-card-color-active' : ''}`}>
                <div className="color-item color-item-3"></div>
            </div>
            <div onClick={() => setTheme('warning')} className={`theme-card-color ${color === 'warning' ? 'theme-card-color-active' : ''}`}>
                <div className="color-item color-item-4"></div>
            </div>
            <div onClick={() => setTheme('purple')} className={`theme-card-color ${color === 'purple' ? 'theme-card-color-active' : ''}`}>
                <div className="color-item color-item-5"></div>
            </div>
        </div>
    )
}

export default ThemeColorsPalette