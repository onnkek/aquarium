import React from 'react'
import './TaskPlaceholder.sass'
import { CheckLg, Link45deg, Trash3 } from 'react-bootstrap-icons'

const TaskPlaceholder = () => {
	return (
		<>
			<div className="item-wrapper card">
				<div className="row card-body m-0 p-0">
					<div className="col-7 card-title placeholder-wave placeholder-glow">
						<div className="row">
							<ul className="p-badges badge-list mb-2 p-0">
								<span className="rounded placeholder bg-primary col-2"></span>
								<span className="rounded placeholder bg-danger col-3"></span>
								<span className="rounded placeholder bg-warning col-4"></span>
							</ul>
						</div>
						<div className="row card-text placeholder-wave placeholder-glow">
							<span className="placeholder col-7 mt-2"></span>
							<span className="placeholder col-4 mt-2"></span>
							<span className="placeholder col-4 mt-2"></span>
							<span className="placeholder col-6 mt-2"></span>
							<span className="placeholder col-8 mt-2"></span>
						</div>
					</div>
					<div className="col-5">
						<div className="row item-flex">
							<div className="col">
								<div className="">
									<div className="p-min">
										<div
											className="progress mb-2 placeholder-progress"
											aria-valuenow={25}
											aria-valuemin={0}
											aria-valuemax={100}
										>
											<div
												className="progress-bar"
												style={{ width: 50 }}
											></div>
										</div>
										<div className="mb-1 placeholder-glow placeholder-wave">
											<span className="placeholder col-3 mt-2"></span>
											<span className="placeholder col-6 mt-2"></span>
										</div>
										<div className="placeholder-glow placeholder-wave">
											<span className="placeholder col-2 mt-2"></span>
											<span className="placeholder col-7 mt-2"></span>
										</div>
									</div>
								</div>
							</div>
							<div className="fix">
								<div className="item-flex-btns">
									<Link45deg size={20} className='placeholder-icon' />
									<CheckLg size={20} className='placeholder-icon' />
									<Trash3 className='placeholder-icon' />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default TaskPlaceholder