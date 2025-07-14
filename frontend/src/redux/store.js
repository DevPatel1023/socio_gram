import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlide.js"
import postSlice from "./postSlice.js"
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
}

const rootReducer = combineReducers({
    auth : authSlice,
    post : postSlice
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

// storing the data in one place through redux so we can use it on our app
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