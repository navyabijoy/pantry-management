'use client';

const { configureStore } = require('@reduxjs/toolkit');

const initialState = {
    pantryItems: [],
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_PANTRY_ITEMS':
            return { ...state, pantryItems: action.payload };
        default:
            return state;
    }
};

exports.store = configureStore({
    reducer,
    preloadedState: initialState
});