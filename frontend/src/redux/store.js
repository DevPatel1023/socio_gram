import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlide.js"

// storing the data in one place through redux so we can use it on our app
const store = configureStore({
    reducer : {
        auth : authSlice
    }
});

export default store;