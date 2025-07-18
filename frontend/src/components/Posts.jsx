import React from "react";
import Post from "./Post";
import { useSelector } from "react-redux";

const Posts = () => {
  const { posts } = useSelector((store) => store.post);
  
  // Add null check and loading state
  if (!posts) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-500">Loading posts...</div>
      </div>
    );
  }
  
  // Handle empty posts array
  if (posts.length === 0) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-500">No posts found</div>
      </div>
    );
  }
  
  return (
    <div className="w-full space-y-4">
      {posts.map((post) => (
        <div key={post._id} className="flex justify-center">
          <Post post={post} />
        </div>
      ))}
    </div>
  );
};

export default Posts;
