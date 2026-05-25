// Product.tsx
import { AddNewNote } from "features/AddNewNote/ui/AddNewNote";
import { CardWithMenu } from "features/CardWithMenu/ui/CardWithMenu";
import { useAppDispatch, useAppSelector } from "models/Hook";
import { useEffect, useState } from "react";
import { deleteNote, INote } from "redux/NotesSlice";
import { formatNoteDate } from "shared/lib/period";
import cls from "./Note.module.sass";

interface NoteProps {
  className?: string
  note: INote
}

export const Note = ({ note }: NoteProps) => {
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.notes.status);
  const [isEdit, setIsEdit] = useState(false);
  const isMenuVisible = useAppSelector(state => state.notes.isModal)
  const [shouldEditAfterClose, setShouldEditAfterClose] = useState(false);

  const handleRemove = async () => {
    try {
      await dispatch(deleteNote(note.uid)).unwrap()
    } catch (e) {
      console.error(e)
    }
  };

  const handleEdit = () => {  // Кнопка "Edit"
    if (isMenuVisible) {
      setShouldEditAfterClose(true);  // Устанавливаем флаг ожидания
      return;
    }
    setIsEdit(true);  // Если меню закрыто — сразу
  };

  useEffect(() => {
    if (!isMenuVisible && shouldEditAfterClose) {
      setIsEdit(true);           // Edit режим!
      setShouldEditAfterClose(false);  // Сбрасываем флаг (один раз)
    }
  }, [isMenuVisible, shouldEditAfterClose]);

  return (
    <>
      <CardWithMenu
        onEdit={handleEdit}
        onRemove={handleRemove}
      >
        <div className={cls.card} key={note.uid}>
          <div className={cls.header}>
            <h3 className={cls.title}>{note.title}</h3>
            <div className={cls.date}>{formatNoteDate(note.date)}</div>
          </div>
          <div className={cls.body}>{note.text}</div>
        </div>
      </CardWithMenu>
      <AddNewNote open={isEdit} onClose={() => setIsEdit(false)} note={note} />
    </>

  );
};