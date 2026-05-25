import { useAppDispatch, useAppSelector } from "models/Hook";
import { useForm } from "react-hook-form";
import { createNote, INote, NewNote, updateNote } from "redux/NotesSlice";
import { classNames } from "shared/lib/classNames";
import { getLocalISODateTime } from "shared/lib/period";
import { validateDateTime } from "shared/lib/validation";
import { Modal } from "shared/ui/Modal";
import cls from './AddNewNote.module.sass';



export interface AddNewProductProps {
	className?: string;
	open?: boolean;
	onClose: () => void
	note?: INote
}

export const AddNewNote = ({ className, open, onClose, note }: AddNewProductProps) => {

	const dispatch = useAppDispatch()
	const status = useAppSelector(state => state.notes.status)
	const {
		register,
		reset,
		handleSubmit,
		setValue,
		trigger,
		formState: { errors, isValid },
	} = useForm<NewNote>({
		mode: "onChange",
		defaultValues: {
			title: note?.title,
			date: note?.date || getLocalISODateTime(),
			text: note?.text,
		}
	});

	const sendConfig = async (data: NewNote) => {
		try {
			if (note) {
				await dispatch(updateNote({
					uid: note.uid,
					title: data.title,
					date: data.date,
					text: data.text
				}))
			} else {
				await dispatch(createNote(data))
			}

			reset({
				title: note?.title ?? "",
				date: note?.date ?? getLocalISODateTime(),
				text: note?.text ?? ""
			})

			onClose()

		} catch (e) {
			console.error(e)
		}
	}

	return (
		<Modal className={classNames(cls.addNewNote, {}, [className])} isOpen={open} onClose={onClose} headerText={"Note"} onConfirm={handleSubmit(sendConfig)} isValid={isValid}>
			<section className={cls.card}>
				<div className={cls.field}>
					<label htmlFor="datetime">Date</label>
					<input
						className={`form-control ${errors.date ? "is-invalid" : ""}`}
						data-bs-theme="dark"
						id="datetime"
						type="datetime-local"
						{...register("date", {
							required: "",
							validate: validateDateTime,
						})}
					/>
				</div>
				<div className={`${cls.field} ${cls.title}`}>
					<label htmlFor="title">Title</label>
					<input
						className={`form-control ${errors.title ? "is-invalid" : ""}`}
						data-bs-theme="dark"
						id="title"
						{...register("title", {
							required: ""
						})}
					/>
				</div>
				<div className={`${cls.field} ${cls.text}`}>
					<label htmlFor="text">Text</label>
					<textarea
						className={`form-control ${errors.text ? "is-invalid" : ""}`}
						data-bs-theme="dark"
						id="text"
						{...register("text", {
							required: ""
						})}
					/>
				</div>
			</section>
		</Modal>
	);
};
