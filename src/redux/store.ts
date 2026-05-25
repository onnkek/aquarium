import { configureStore } from '@reduxjs/toolkit'
import AquariumReducer from './AquariumSlice'
import EventsReducer from './EventsSlice'
import LogsReducer from './LogsSlice'
import MetricsReducer from './MetricsSlice'
import NotesReducer from './NotesSlice'

const store = configureStore({
    reducer: {
        aquarium: AquariumReducer,
        metrics: MetricsReducer,
        events: EventsReducer,
        logs: LogsReducer,
        notes: NotesReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store