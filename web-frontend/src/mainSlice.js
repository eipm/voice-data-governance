import { createSlice } from "@reduxjs/toolkit";

const mainSlice = createSlice({
    name: "main",
    initialState: {
        isMapInitialized: false,
        focusedCountry: null,
    },
    reducers: {
        setIsMapInitialized: (state, action) => {
            state.isMapInitialized = action.payload;
        },
        setFocusedCountry: (state, action) => {
            state.focusedCountry = action.payload;
        },
    },
});

export default mainSlice;
