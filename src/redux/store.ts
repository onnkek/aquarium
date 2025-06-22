import { configureStore } from '@reduxjs/toolkit'
import AquariumReducer from './AquariumSlice'

const store = configureStore({
    reducer: {
        aquarium: AquariumReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store