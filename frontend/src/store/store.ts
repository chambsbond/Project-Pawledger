import { configureStore } from '@reduxjs/toolkit'
import OrgSlice from './slices/OrgSlice'

export const store = configureStore({
    reducer: {
        orgContract: OrgSlice
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch