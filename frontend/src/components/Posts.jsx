import React, { useEffect } from "react";
import Post from "./Post";
import { useDispatch, useSelector } from "react-redux";
import { updatePost } from "../redux/postSlice";

const Posts = () => {
  const { posts } = useSelector((store) => store.post);
  const { socket } = useSelector((store) => store.socketio);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!socket) return;

    // Listen to 'postUpdated' event
    socket.on("postUpdated", (updatedPost) => {
      dispatch(updatePost(updatedPost));
    });

    // Cleanup
    return () => {
      socket.off("postUpdated");
    };
  }, [socket, dispatch]);

  if (!posts) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-500">Loading posts...</div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-500">No posts found</div>
      </div>
    );
  }

  const validPosts = posts.filter(
    (post) => post && post._id && Array.isArray(post.likes)
  );

  return (
    <div className="w-full space-y-4">
      {validPosts.length > 0 ? (
        validPosts.map((post) => (
          <div key={post._id} className="flex justify-center">
            <Post post={post} />
          </div>
        ))
      ) : (
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-500">No valid posts found</div>
        </div>
      )}
    </div>
  );
};

export default Posts;
