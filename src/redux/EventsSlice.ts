import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Status } from "models/Status";
import AquariumService from "../services/AquariumService";

const service = new AquariumService()

export type Point = {
	x: number;
	y: number;
};
export type PidEvent = {
	name: "HEAT" | "COOL"
	time: number
	status: 0 | 1
}
export type Doser = {
	1: Point[]
	2: Point[]
	3: Point[]
	4: Point[]
}

export type Relay = {
	1: Point[]
	2: Point[]
	3: Point[]
	4: Point[]
	5: Point[]
}

interface EventsState {
	status: Status
	doser: Doser
	pid: PidEvent[]
	relay: Relay
}

const initialState: EventsState = {
	status: Status.Idle,
	doser: {
		1: [],
		2: [],
		3: [],
		4: []
	},
	pid: [],
	relay: {
		1: [],
		2: [],
		3: [],
		4: [],
		5: []
	}
}

const EventsSlice = createSlice({
	name: 'events',
	initialState,
	reducers: {

	},
	extraReducers(builder) {
		// =====================
		// DOSER
		// =====================
		builder
			.addCase(fetchDoser.pending, (state) => {
				state.status = Status.Loading
			})
			.addCase(fetchDoser.fulfilled, (state, action) => {
				state.status = Status.Succeeded
				state.doser = action.payload
			})
			.addCase(fetchDoser.rejected, (state, action) => {
				state.status = Status.Failed
			})

		// =====================
		// PID
		// =====================
		builder
			.addCase(fetchPid.pending, (state) => {
				state.status = Status.Loading
			})
			.addCase(fetchPid.fulfilled, (state, action) => {
				state.status = Status.Succeeded
				state.pid = action.payload
			})
			.addCase(fetchPid.rejected, (state, action) => {
				state.status = Status.Failed
			})

		// =====================
		// RELAY
		// =====================
		builder
			.addCase(fetchRelay.pending, (state) => {
				state.status = Status.Loading
			})
			.addCase(fetchRelay.fulfilled, (state, action) => {
				state.status = Status.Succeeded
				state.relay = action.payload
			})
			.addCase(fetchRelay.rejected, (state, action) => {
				state.status = Status.Failed
			})
	}
})


export const fetchRelay = createAsyncThunk(
	"events/fetchRelay",
	async (
		params: {
			year: number
			month: number
		},
		thunkAPI
	) => {
		try {
			const csv = await service.getRelayEvents(params)

			const data = service.parseRelayCSV(csv)

			return data
		} catch (e: any) {
			return thunkAPI.rejectWithValue(
				e?.message || "relay fetch failed"
			)
		}
	}
)

export const fetchPid = createAsyncThunk(
	"events/fetchPid",
	async (
		params: {
			year: number
			month: number
		},
		thunkAPI
	) => {
		try {
			const csv = await service.getPidEvents(params)

			return service.parsePidCSV(csv)
		} catch (e: any) {
			return thunkAPI.rejectWithValue(
				e?.message || "pid failed"
			)
		}
	}
)

export const fetchDoser = createAsyncThunk(
	"events/fetchDoser",
	async (
		params: {
			year: number
			month: number
		},
		thunkAPI
	) => {
		try {
			const csv = await service.getDoserEvents({
				type: "doser",
				...params
			})

			return service.parseDoserCSV(csv)
		} catch (e: any) {
			return thunkAPI.rejectWithValue(
				e?.message || "doser failed"
			)
		}
	}
)



export default EventsSlice.reducer