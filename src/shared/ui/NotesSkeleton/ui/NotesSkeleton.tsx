import cls from './NotesSkeleton.module.sass';

export interface NotesSkeletonProps {
  count?: number;
}

export const NotesSkeleton = ({
	count = 4,
}: NotesSkeletonProps) => {
	return (
		<>
			{Array.from({ length: count }).map((_, index) => (
				<div className={cls.card} key={index}>
					<div className="card-text placeholder-glow">

						<div className="mb-3">
							<span className="placeholder col-4 placeholder-sm"></span>
						</div>

						<div className="mb-4">
							<span className="placeholder col-12 placeholder-lg bg-secondary"></span>
						</div>

						{Array.from({ length: 6 }).map((_, i) => (
							<div className="mb-2" key={i}>
								<span className="placeholder col-12 placeholder-sm"></span>
							</div>
						))}
					</div>
				</div>
			))}
		</>
	)
}