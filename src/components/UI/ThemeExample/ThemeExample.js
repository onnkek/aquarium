import React from 'react'
import './ThemeExample.sass'

const ThemeExample = ({ dark }) => {
    return (
        <div className="example-body-container" dark={dark} >
            <div className={`example-top`}>
                <div className="temp temp-color"></div>
                <div className="temp temp-color"></div>
                <div className="temp temp-color"></div>
            </div>
            <div className="example-tabs">
                <div className="temp temp-color temp-1"></div>
                <div className="temp-group">
                    <div className="temp temp-2 temp-color1"></div>
                    <div className="temp temp-2 temp-color2"></div>
                </div>
            </div>
            <div className="example-body">
                <div className="example-body-wrapper">
                    <div className="example-body-temp">
                        <div className="temp temp-3"></div>
                    </div>
                </div>
                <div className="example-body-wrapper example-body-wrapper-1"></div>
            </div>
        </div>
    )
}

export default ThemeExample