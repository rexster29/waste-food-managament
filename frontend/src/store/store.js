import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
    key: 'root',    //
    storage,
    /*
    whitelist: ['foodReducer'],  // Optional: Specify which reducers to persist
    blacklist: [],  //Optional: Specify which reducers not to persist
    */
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export default store;

export const persistor = persistStore(store);