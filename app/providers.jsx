'use client'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'

const store = configureStore({
    reducer: {
        pantry: (state = [], action) => {
            if (action.type === 'SET_PANTRY_ITEMS') {
                return { ...state, pantryItems: action.payload }
            }
            return state
        }
    }
})

export function Providers({children}) {
    return <Provider store={store}>{children}</Provider>
}
