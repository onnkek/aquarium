import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { IBadge } from "../models/Badge"
import { RootState } from "./store"
import PlannerAPIService from "../services/PlannerAPIService"
import { Colors } from "../components/pages/SettingsPage/BadgesPage/BadgesPage"
import { Status } from "../models/Status"


interface IBadges {
    badges: IBadge[]
    status: Status
    removing: number[]
    addStatus: Status
}

const initialState: IBadges = {
    badges: [],
    status: Status.Idle,
    removing: [],
    addStatus: Status.Idle
}

const BadgesSlice = createSlice({
    name: 'badges',
    initialState,
    reducers: {

    },
    extraReducers(builder) {
        builder

            .addCase(getBadges.pending, (state: IBadges) => {
                state.status = Status.Loading
            })
            .addCase(getBadges.fulfilled, (state: IBadges, action) => {
                state.status = Status.Succeeded
                state.badges = action.payload
            })
            .addCase(getBadges.rejected, (state: IBadges, action) => {
                state.status = Status.Failed
            })


            .addCase(addBadge.fulfilled, (state: IBadges, action) => {
                state.addStatus = Status.Succeeded
                state.badges.push(action.payload)
            })
            .addCase(addBadge.pending, (state: IBadges, action) => {
                state.addStatus = Status.Loading
            })

            .addCase(removeBadge.fulfilled, (state: IBadges, action) => {
                state.removing.splice(action.meta.arg.id, 1)
                state.badges = action.payload
            })
            .addCase(removeBadge.pending, (state: IBadges, action) => {
                state.removing.push(action.meta.arg.id)
            })
    }
})
type PayloadType = {
    text: string
    color: Colors
}


export const getBadges = createAsyncThunk(
    'badges/getBadges',
    async () => {
        return await new PlannerAPIService().getBadges()
    })


export const addBadge = createAsyncThunk<IBadge, PayloadType, { state: RootState }>(

    'badges/addBadge',
    async (payload: PayloadType, { getState }) => {

        const badges = getState().badges.badges
        let maxId = 1
        if (badges.length) {
            maxId = badges.reduce((prev, cur) => (prev.id > cur.id ? prev : cur)).id
            maxId++
        }
        const newBadge: IBadge = {
            id: maxId,
            color: Number(payload.color),
            text: payload.text
        }

        const newBadges = [...badges, newBadge]
        await new PlannerAPIService().addBadge(newBadge)
        return newBadge

    }
)
type RemovePayloadType = {
    id: number
}
export const removeBadge = createAsyncThunk<IBadge[], RemovePayloadType, { state: RootState, rejectValue: string }>(

    'badges/removeBadge',
    async (payload: RemovePayloadType, { rejectWithValue, getState }) => {


        const state = getState().badges.badges
        const index = state.findIndex((badge) => badge.id === payload.id)
        const newData = [...state.slice(0, index), ...state.slice(index + 1)]
        const response = await new PlannerAPIService().removeBadge(payload.id)
        if (!response.ok) {
            return rejectWithValue('Can\'t delete badge! Server error!')
        }
        return newData
    }
)

export default BadgesSlice.reducer