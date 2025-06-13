import React from 'react'
import './Spinner.sass'

const Spinner = (props: any) => {
    return (
        <div className='spinner'>
            <div className={`custom-loader ${props.className}`}></div>
        </div>
    )
}

export default Spinner