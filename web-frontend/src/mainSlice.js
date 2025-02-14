import { createSlice } from "@reduxjs/toolkit";

const mainSlice = createSlice({
    name: "main",
    initialState: {
        isMapInitialized: false,
        focusedCountry: null,
        focusedState: null,
        menuWidthPx: 500,
    },
    reducers: {
        setIsMapInitialized: (state, action) => {
            state.isMapInitialized = action.payload;
        },
        setFocusedCountry: (state, action) => {
            state.focusedCountry = action.payload;
        },
        setFocusedState: (state, action) => {
            state.focusedState = action.payload;
        },
        setMenuWidthPx: (state, action) => {
            state.menuWidthPx = action.payload;
        },
    },
});

export default mainSlice;
