import React from 'react'
import './Timetask.sass'
import { Trash3 } from 'react-bootstrap-icons'

const Timetask = (props) => {

    const deleteButton = (
        <button
            type="button"
            className="btn-icon btn btn-primary"
        >
            <Trash3 className="icon-trash-3"/>
        </button>)

    return (
        <>
            <div className="timetask-wrapper">
                <div className="item-title-container col-8">
                    {/* <div className="btn-icon-outline">
                            <Arrow />
                        </div> */}
                    <div className="item-title">
                        <p>Laboris esse in voluptate adipisicing ad laboris.</p>
                    </div>
                </div>
                <div className="item-progress col-3">
                    2 day
                </div>
                <div className="delete-button col-1">{deleteButton}</div>
            </div>
        </>
    )
}

export default Timetask