// user global state
import {createSlice} from "@reduxjs/toolkit" ;  

const authSlide = createSlice({
    name : "auth" ,
    initialState : {
        user : null
    },
    reducers : {
        setAuthUser : (state,action) => {
            state.user = action.payload;
        }
    }
});

export const {setAuthUser} = authSlide.actions;

export default authSlide.actions;