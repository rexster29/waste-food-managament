import { combineReducers } from "redux";
import authReducer from "./authReducer";
import foodReducer from "./foodReducer";

const rootReducer = combineReducers({
    auth: authReducer,
    food: foodReducer,
});

export default rootReducer;