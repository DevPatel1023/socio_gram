import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
  selectedPost: null,
};

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    updatePost: (state, action) => {
      const updatedPost = action.payload;
      const index = state.posts.findIndex((p) => p._id === updatedPost._id);
      if (index !== -1) {
        state.posts[index] = updatedPost;
      } else {
        // Optionally add new post if not found
        state.posts.push(updatedPost);
      }
    },
    setSelectedPost: (state, action) => {
      state.selectedPost = action.payload;
    },
  },
});

export const { setPosts, updatePost, setSelectedPost } = postSlice.actions;
export default postSlice.reducer;
