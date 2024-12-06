import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    isLoggedin: false,
}

const authReducer = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state = initialState, action) {
            const { type, payload } = action;
            state.user = payload;
            state.isLoggedin = true;
        },
        logout(state = initialState, action) {
            state.user = null;
            state.isLoggedin = false;
        },
    },
})

export default authReducer.reducer;
export const { login, logout } = authReducer.actions;