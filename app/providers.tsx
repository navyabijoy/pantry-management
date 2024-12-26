// app/providers.tsx
'use client'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'

const store = configureStore({
    reducer: {
        pantry: (state = { pantryItems: [] }, action) => {
            if (action.type === 'SET_PANTRY_ITEMS') {
                return { ...state, pantryItems: action.payload }
            }
            return state
        }
    }
})

export function Providers({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>
}