import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Status } from "models/Status";
import { v4 as uuidv4 } from "uuid";
import AquariumService from "../services/AquariumService";
import { RootState } from "./store";

const service = new AquariumService()

export interface INote {
	uid: string
	title: string
	date: string
	text: string
}

interface NotesState {
	data: INote[]
	status: Status
	isModal: boolean
}

const initialState: NotesState = {
	data: [],
	status: Status.Idle,
	isModal: false
};

const NotesSlice = createSlice({
	name: 'notes',
	initialState,
	reducers: {

	},
	extraReducers(builder) {
		builder
			.addCase(fetchNotes.pending, (state) => {
				state.status = Status.Loading;
			})
			.addCase(fetchNotes.fulfilled, (state, action) => {
				state.status = Status.Succeeded;
				state.data = action.payload;
			})
			.addCase(fetchNotes.rejected, (state, action) => {
				state.status = Status.Failed;
			});
		builder
			.addCase(createNote.pending, (state) => {
				state.status = Status.Loading;
			})
			.addCase(createNote.fulfilled, (state, action) => {
				state.status = Status.Succeeded;
				state.data.push(action.payload);
			})
			.addCase(createNote.rejected, (state, action) => {
				state.status = Status.Failed;
			});
		builder
			.addCase(updateNote.pending, (state) => {
				state.status = Status.Loading;
			})
			.addCase(updateNote.fulfilled, (state, action) => {
				state.status = Status.Succeeded;
				const index = state.data.findIndex(
					(note) => note.uid === action.payload.uid
				)
				if (index !== -1) {
					state.data[index] = action.payload
				}
			})
			.addCase(updateNote.rejected, (state, action) => {
				state.status = Status.Failed;
			});
		builder
			.addCase(deleteNote.pending, (state) => {
				state.status = Status.Loading;
			})
			.addCase(deleteNote.fulfilled, (state, action) => {
				state.status = Status.Succeeded;
				state.data = state.data.filter(
					(note) => note.uid !== action.payload
				)
			})
			.addCase(deleteNote.rejected, (state, action) => {
				state.status = Status.Failed;
			});
	}
})


export const fetchNotes = createAsyncThunk(
	"notes/fetchNotes",
	async (
		_, thunkAPI
	) => {
		try {

			return await service.getNotes()

		} catch (e: any) {
			return thunkAPI.rejectWithValue(
				e?.message || "system logs failed"
			)
		}
	}
)

export interface NewNote {
	title: string
	date: string
	text: string
}

export const createNote = createAsyncThunk<INote, NewNote, { state: RootState }>(
	'notes/createNote',
	async (payload: NewNote, { rejectWithValue }) => {
		const newNote: INote = {
			uid: uuidv4(),
			title: payload.title,
			date: payload.date,
			text: payload.text
		}
		const response = await service.createNote(newNote)
		if (!response.ok) {
			return rejectWithValue('Can\'t delete post! Server error!')
		}
		return newNote
	}
)

export const updateNote = createAsyncThunk<INote, INote, { state: RootState }>(
	'notes/updateNote',
	async (payload: INote, { rejectWithValue }) => {
		const response = await service.updateNote(payload)
		if (!response.ok) {
			return rejectWithValue('Can\'t delete post! Server error!')
		}
		return payload
	}
)

export const deleteNote = createAsyncThunk(
  "notes/deleteNote",
  async (uid: string, thunkAPI) => {
    try {
      const res = await service.deleteNote(uid);

      if (!res || res.status !== "deleted") {
        return thunkAPI.rejectWithValue("Delete failed");
      }

      return uid; // 🔥 ВОТ ЭТО ГЛАВНОЕ
    } catch (e: any) {
      return thunkAPI.rejectWithValue(
        e?.message || "Delete note failed"
      );
    }
  }
);


export default NotesSlice.reducer