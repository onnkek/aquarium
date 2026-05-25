import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Status } from "models/Status";
import AquariumService from "../services/AquariumService";

const service = new AquariumService()

export type LogCategory = "system" | "relay" | "doser";

export interface LogEntry {
	type: "error" | "warning" | "info"
	timestamp: string
	category: LogCategory
	message: string
}

interface LogsState {
	system: LogEntry[]
	relay: LogEntry[]
	doser: LogEntry[]
	status: Status
}

const initialState: LogsState = {
	system: [],
	relay: [],
	doser: [],
	status: Status.Idle
};

const LogsSlice = createSlice({
	name: 'logs',
	initialState,
	reducers: {

	},
	extraReducers(builder) {
		// SYSTEM
		builder
			.addCase(fetchSystemLogs.pending, (state) => {
				state.status = Status.Loading;
			})
			.addCase(fetchSystemLogs.fulfilled, (state, action) => {
				state.status = Status.Succeeded;
				state.system = action.payload;
			})
			.addCase(fetchSystemLogs.rejected, (state, action) => {
				state.status = Status.Failed;
			})

		// RELAY
		builder
			.addCase(fetchRelayLogs.pending, (state) => {
				state.status = Status.Loading;
			})
			.addCase(fetchRelayLogs.fulfilled, (state, action) => {
				state.status = Status.Succeeded;
				state.relay = action.payload;
			})
			.addCase(fetchRelayLogs.rejected, (state, action) => {
				state.status = Status.Failed;
			})

		// DOSER
		builder
			.addCase(fetchDoserLogs.pending, (state) => {
				state.status = Status.Loading;
			})
			.addCase(fetchDoserLogs.fulfilled, (state, action) => {
				state.status = Status.Succeeded;
				state.doser = action.payload;
			})
			.addCase(fetchDoserLogs.rejected, (state, action) => {
				state.status = Status.Failed;
			});

	}
})


export const fetchSystemLogs = createAsyncThunk(
	"logs/fetchSystem",
	async (
		params: {
			year: number
			month: number
			day: number
		},
		thunkAPI
	) => {
		try {
			const text = await service.getLogs({
				type: "system",
				...params
			})

			return service.parseLogs(text, "system")
		} catch (e: any) {
			return thunkAPI.rejectWithValue(
				e?.message || "system logs failed"
			)
		}
	}
)
export const fetchRelayLogs = createAsyncThunk(
	"logs/fetchRelay",
	async (
		params: {
			year: number
			month: number
			day: number
		},
		thunkAPI
	) => {
		try {
			const text = await service.getLogs({
				type: "relay",
				...params
			})

			return service.parseLogs(text, "relay")
		} catch (e: any) {
			return thunkAPI.rejectWithValue(
				e?.message || "relay logs failed"
			)
		}
	}
)
export const fetchDoserLogs = createAsyncThunk(
	"logs/fetchDoser",
	async (
		params: {
			year: number
			month: number
			day: number
		},
		thunkAPI
	) => {
		try {
			const text = await service.getLogs({
				type: "doser",
				...params
			})

			return service.parseLogs(text, "doser")
		} catch (e: any) {
			return thunkAPI.rejectWithValue(
				e?.message || "doser logs failed"
			)
		}
	}
)



export default LogsSlice.reducer