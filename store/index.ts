'use client'

import { configureStore } from '@reduxjs/toolkit'

interface PantryState {
    pantryItems: any[];
}

const initialState: PantryState = {
    pantryItems: [],
};

const reducer = (state = initialState, action: any) => {
    switch (action.type) {
        case 'SET_PANTRY_ITEMS':
            return { ...state, pantryItems: action.payload };
        default:
            return state;
    }
};

export const store = configureStore({
    reducer,
    preloadedState: initialState
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;