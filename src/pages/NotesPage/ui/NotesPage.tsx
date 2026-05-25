
import { Note } from "entities/Note/ui/Note";
import { AddNewNote } from "features/AddNewNote/ui/AddNewNote";
import { useAppDispatch, useAppSelector } from "models/Hook";
import { Status } from "models/Status";
import { useEffect, useState } from "react";
import { fetchNotes, INote } from "redux/NotesSlice";
import { ReactComponent as PlusIcon } from 'shared/assets/icons/aquarium/plus.svg';
import { classNames } from "shared/lib/classNames";
import { Button } from "shared/ui/Button";
import { NotesSkeleton } from "shared/ui/NotesSkeleton";
import { Page } from "widgets/Page";
import cls from './NotesPage.module.sass';

export interface NotesPageProps {
  className?: string;
}

type FormData = {
  date: string;
};

export const NotesPage = ({ className }: NotesPageProps) => {
  const dispatch = useAppDispatch()
  const notes = useAppSelector(state => state.notes.data)
  const status = useAppSelector(state => state.notes.status)
  const [open, setOpen] = useState(false)
  // const [isEdit, setIsEdit] = useState(false)
  const isMenuVisible = useAppSelector(state => state.notes.isModal)
  const [shouldEditAfterClose, setShouldEditAfterClose] = useState(false)

  useEffect(() => {
    dispatch(fetchNotes())
  }, [dispatch])

  const notesMock: INote[] = [
    {
      "uid": "1",
      "date": "2026-05-13T10:31",
      "title": "Подмена",
      "text": "Убавил свет до 100/60/80\nПо тестам NO3 < 5, PO4 0.5-1, PH 7, дропчекер темно-зеленый\nПовысил NO3 и PO4 из расчета на 300л\nЖелезо 5 + Калий 5\nПеренес СО2 и добавил\nВнес реминерализатор 25 ложек\nТиосульфат 20 капель"
    },
    {
      "uid": "2",
      "date": "2026-05-12T15:35",
      "title": "Наблюдение",
      "text": "Убавил свет до 100/60/80\nПо тестам NO3 < 5, PO4 0.5-1, PH 7, дропчекер темно-зеленый\nПовысил NO3 и PO4 из расчета на 300л\nЖелезо 5 + Калий 5\nПеренес СО2 и добавил\nВнес реминерализатор 25 ложек\nТиосульфат 20 капель"
    },
    {
      "uid": "3",
      "date": "2026-05-11T20:23",
      "title": "",
      "text": "Убавил свет до 100/60/80\nПо тестам NO3 < 5, PO4 0.5-1, PH 7, дропчекер темно-зеленый\nПовысил NO3 и PO4 из расчета на 300л\nЖелезо 5 + Калий 5\nПеренес СО2 и добавил\nВнес реминерализатор 25 ложек\nТиосульфат 20 капель"
    },
    {
      "uid": "4",
      "date": "2026-05-10T04:42",
      "title": "Наблюдение",
      "text": "Убавил свет до 100/60/80\nПо тестам NO3 < 5, PO4 0.5-1, PH 7, дропчекер темно-зеленый\nПовысил NO3 и PO4 из расчета на 300л\nЖелезо 5 + Калий 5\nПеренес СО2 и добавил\nВнес реминерализатор 25 ложек\nТиосульфат 20 капель"
    },
    {
      "uid": "5",
      "date": "2026-05-09T06:10",
      "title": "",
      "text": "Убавил свет до 100/60/80\nПо тестам NO3 < 5, PO4 0.5-1, PH 7, дропчекер темно-зеленый\nПовысил NO3 и PO4 из расчета на 300л\nЖелезо 5 + Калий 5\nПеренес СО2 и добавил\nВнес реминерализатор 25 ложек\nТиосульфат 20 капель"
    }
  ]
  useEffect(() => {
    if (!isMenuVisible && shouldEditAfterClose) {
      // setIsEdit(true);           // Edit режим!
      setShouldEditAfterClose(false);  // Сбрасываем флаг (один раз)
    }
  }, [isMenuVisible, shouldEditAfterClose]);
  const sorted = [...notes].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  return (
    <Page className={classNames(cls.notesPage, {}, [className])}>
      <div className={cls.content}>
        <div className={cls.wrapper}>
          {status === Status.Failed &&
            <div className={cls.error}>
              <div className={cls.errorIcon}>⚠️</div>
              <h2 className={cls.errorTitle}>
                Failed to load notes
              </h2>
              <p className={cls.errorText}>
                Check your internet connection or try again later.
              </p>
              <button
                className={cls.retryButton}
                onClick={() => dispatch(fetchNotes())}
              >Try again</button>
            </div>
          }
          {status === Status.Loading && <NotesSkeleton />}
          {status === Status.Succeeded &&
            <>
              {sorted.map((note) => (
                <Note note={note} key={note.uid}/>
              ))}
              {open ||
                <Button theme='clear' className={cls.addButton} onClick={() => setOpen(true)}>
                  <PlusIcon />
                </Button>
              }
            </>
          }
        </div>
      </div>
      <AddNewNote open={open} onClose={() => setOpen(false)} />
    </Page>
  );
};
