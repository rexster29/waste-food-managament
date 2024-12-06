import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    foodDonationList: [],
}

const foodReducer = createSlice({
    name: "food",
    initialState,
    reducers: {
        setFoodList(state = initialState, action) {
            // console.log('action payload', action.payload);
            const foodDonationList = action.payload;
            state.foodDonationList = foodDonationList;
            console.log("initial state", foodDonationList);
        },
        
    },
});

export const { setFoodList } = foodReducer.actions;
export default foodReducer.reducer;