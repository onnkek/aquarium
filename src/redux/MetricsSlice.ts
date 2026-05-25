import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AquariumService from "../services/AquariumService";

const service = new AquariumService()

export type Point = {
	x: number;
	y: number;
};

interface MetricsState {
	loading: boolean
	error: string | null

	data: {
		air_temp: Point[]
		water_temp: Point[]
		humidity: Point[]
	}
}

const initialState: MetricsState = {
	loading: false,
	error: null,

	data: {
		air_temp: [],
		water_temp: [],
		humidity: []
	}
}

const MetricsSlice = createSlice({
	name: 'metrics',
	initialState,
	reducers: {

	},
	extraReducers(builder) {
		// =====================
		// AIR TEMP
		// =====================
		builder
			.addCase(fetchAirTemp.pending, (state) => {
				state.loading = true
				state.error = null
				state.data.air_temp = []
			})
			.addCase(fetchAirTemp.fulfilled, (state, action) => {
				state.loading = false
				state.data.air_temp = action.payload
			})
			.addCase(fetchAirTemp.rejected, (state, action) => {
				state.loading = false
				state.error = (action.payload as string) || "air error"
			})

		// =====================
		// WATER TEMP
		// =====================
		builder
			.addCase(fetchWaterTemp.pending, (state) => {
				state.loading = true
				state.error = null
				state.data.water_temp = []
			})
			.addCase(fetchWaterTemp.fulfilled, (state, action) => {
				state.loading = false
				state.data.water_temp = action.payload
			})
			.addCase(fetchWaterTemp.rejected, (state, action) => {
				state.loading = false
				state.error = (action.payload as string) || "water error"
			})

		// =====================
		// HUMIDITY
		// =====================
		builder
			.addCase(fetchHumidity.pending, (state) => {
				state.loading = true
				state.error = null
				state.data.humidity = []
			})
			.addCase(fetchHumidity.fulfilled, (state, action) => {
				state.loading = false
				state.data.humidity = action.payload
			})
			.addCase(fetchHumidity.rejected, (state, action) => {
				state.loading = false
				state.error = (action.payload as string) || "humidity error"
			})

	}
})

export const fetchAirTemp = createAsyncThunk(
	"metrics/fetchAirTemp",
	async (
		params: {
			year: number
			month: number
			day: number
		},
		thunkAPI
	) => {
		try {
			const csv = await service.getMetrics({
				metric: "air_temp",
				...params
			})

			return service.parseMetricsCSV(csv)
		} catch (e: any) {
			return thunkAPI.rejectWithValue(
				e?.message || "air_temp failed"
			)
		}
	}
)
export const fetchWaterTemp = createAsyncThunk(
	"metrics/fetchWaterTemp",
	async (
		params: {
			year: number
			month: number
			day: number
		},
		thunkAPI
	) => {
		try {
			const csv = await service.getMetrics({
				metric: "water_temp",
				...params
			})

			return service.parseMetricsCSV(csv)
		} catch (e: any) {
			return thunkAPI.rejectWithValue(
				e?.message || "water_temp failed"
			)
		}
	}
)
export const fetchHumidity = createAsyncThunk(
	"metrics/fetchHumidity",
	async (
		params: {
			year: number
			month: number
			day: number
		},
		thunkAPI
	) => {
		try {
			const csv = await service.getMetrics({
				metric: "humidity",
				...params
			})

			return service.parseMetricsCSV(csv)
		} catch (e: any) {
			return thunkAPI.rejectWithValue(
				e?.message || "humidity failed"
			)
		}
	}
)



export default MetricsSlice.reducer