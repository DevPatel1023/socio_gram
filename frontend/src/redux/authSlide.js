// user global state
import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        suggestedUsers: [],
        userProfile: null
    },
    reducers: {
        setAuthUser: (state, action) => {
            state.user = action.payload;
        },
        setSuggestedUsers: (state, action) => {
            state.suggestedUsers = action.payload;
        },
        setUserProfile: (state, action) => {
            state.userProfile = action.payload;
        },
        toggleFollowState: (state, action) => {
            const userId = action.payload;
            const user = state.suggestedUsers.find((u) => u._id === userId);
            if (user) {
                user.isFollowing = !user.isFollowing;
            }
        },
        logoutUser: (state) => {
            state.user = null;
            state.suggestedUsers = [];
        },
    }
});

export const { setAuthUser, setSuggestedUsers, setUserProfile ,toggleFollowState ,logoutUser  } = authSlice.actions;

export default authSlice.reducer;