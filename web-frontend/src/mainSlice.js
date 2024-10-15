import { createSlice } from "@reduxjs/toolkit";

const mainSlice = createSlice({
    name: "main",
    initialState: {
        isMapInitialized: false,
        focusedCountry: null,
        menuWidthPx: 300,
    },
    reducers: {
        setIsMapInitialized: (state, action) => {
            state.isMapInitialized = action.payload;
        },
        setFocusedCountry: (state, action) => {
            state.focusedCountry = action.payload;
        },
        setMenuWidthPx: (state, action) => {
            state.menuWidthPx = action.payload;
        },
    },
});

export default mainSlice;
