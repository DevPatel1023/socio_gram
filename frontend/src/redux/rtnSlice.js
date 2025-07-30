import { createSlice } from "@reduxjs/toolkit";

const rtnSlice = createSlice({
  name: "realTimeNotification",
  initialState: {
    likeNotification: [],
    hasUnreadLikeNotification: false,
  },
  reducers: {
    setLikeNotification: (state, action) => {
      if (action.payload.type === "like") {
        state.likeNotification.push(action.payload);
        state.hasUnreadLikeNotification = true; // Mark as unread on new like
      } else if (action.payload.type === "dislike") {
        state.likeNotification = state.likeNotification.filter(
          (item) => item.userId !== action.payload.userId
        );
      }
    },
    markLikeNotificationAsRead: (state) => {
      state.hasUnreadLikeNotification = false;
    },
  },
});

export const { setLikeNotification, markLikeNotificationAsRead } = rtnSlice.actions;
export default rtnSlice.reducer;
