import React, { useState, useRef } from 'react'
import './Modal.sass'
import { XLg } from 'react-bootstrap-icons'


type PropsType = {
	children: any
	buttons?: boolean
	title: string
	show: boolean
	setShow: any
}
const Modal = ({ children, buttons, title, show, setShow }: PropsType) => {

	return (

		show ? (
			<div className={`modal fade show`} style={{ display: "block" }} onMouseDown={() => { setShow(false) }}>
				<div className="modal-backdrop fade show" style={{ zIndex: 0 }}></div>
				<div className="modal-dialog modal-dialog-centered" onMouseDown={e => e.stopPropagation()}>
					<div className="modal-content">
						<div className="modal-header">
							<h1 className="modal-title fs-5" id="exampleModalLabel">{title}</h1>
							<button type="button" className="close-btn btn" onClick={() => { setShow(false) }}>
								<XLg size={20} className='close-icon' />
							</button>
						</div>
						<div className="modal-body">
							{children}
						</div>
						{buttons && <div className="modal-footer">
							<button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
							<button type="button" className="btn btn-primary">Save changes</button>
						</div>}
					</div>
				</div>

			</div>
		) : <></>

	)

}

export default Modal