import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { FaRegHeart, FaHeart, FaBookmark, FaRegBookmark } from "react-icons/fa";
import { MessageCircle, Send } from "lucide-react";
import Commentdialog from "./Commentdialog";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Badge } from "./ui/badge";
import { Link } from "react-router-dom";

const Post = ({ post }) => {
  const user = useSelector((store) => store.auth.user);
  const { posts } = useSelector((store) => store.post);
  const dispatch = useDispatch();

  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [comments, setComments] = useState(post.comments || []);
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (user && post) {
      setIsLiked(post.likes.includes(user._id));
      setIsBookmarked(user?.bookmarks?.includes(post._id) || false);
      setLikesCount(post.likes.length);
      setComments(post.comments || []);
    }
  }, [user, post]);

  const likeanddislikeHandler = async (postId) => {
    if (!user) {
      toast.error("Please log in to like posts");
      return;
    }
    try {
      const action = isLiked ? "dislike" : "like";
      const res = await axios.post(
        `http://localhost:8000/api/v1/post/${postId}/${action}`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedPost = res.data.post;

        // Update Redux store with updated post
        const updatedPostData = posts.map((p) =>
  p._id === updatedPost._id ? updatedPost : p
);


        dispatch(setPosts(updatedPostData));

        setLikesCount(updatedPost.likes.length);
        setIsLiked(updatedPost.likes.includes(user._id));

        toast.success(
          res.data.message ||
            `${action.charAt(0).toUpperCase() + action.slice(1)}d successfully`
        );

        console.log("posts before update:", posts);
        console.log("updatedPost:", updatedPost);
      }
    } catch (error) {
      console.error("Like/Dislike error:", error);
      toast.error(
        error.response?.data?.message ||
          `Failed to ${isLiked ? "dislike" : "like"} post`
      );
    }
  };

  const handleLike = (postId) => {
    likeanddislikeHandler(postId);
  };

  const handleBookmark = async () => {
    if (!user) {
      toast.error("Please log in to bookmark posts");
      return;
    }
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/post/${post._id}/bookmark`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        setIsBookmarked(res.data.type === "saved");
        toast.success(res.data.message || `Post ${res.data.type}`);
      }
    } catch (error) {
      console.error("Bookmark error:", error);
      toast.error(
        error.response?.data?.message ||
          `Failed to ${isBookmarked ? "unbookmark" : "bookmark"} post`
      );
    }
  };

  const handleComment = async () => {
    if (!user) {
      toast.error("Please log in to comment");
      return;
    }
    if (!text.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/post/${post._id}/comment`,
        { text },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedCommentData = [...comments, res.data.comment];
        setComments(updatedCommentData);
        setText("");
        const updatedPostData = posts.map((p) =>
          p._id === post._id ? { ...p, comments: updatedCommentData } : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message || "Comment added successfully");
      }
    } catch (error) {
      console.error("Comment error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to post comment. Please try again.";
      toast.error(errorMessage);
    }
  };

  const formatLikes = (count) => {
    if (count >= 1000000) return (count / 1000000).toFixed(1) + "M";
    if (count >= 1000) return (count / 1000).toFixed(1) + "k";
    return count.toString();
  };

  const deletePostHandler = async () => {
    if (!user) {
      toast.error("Please log in to delete posts");
      return;
    }
    try {
      const res = await axios.delete(
        `http://localhost:8000/api/v1/post/delete/${post?._id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedPostData = posts.filter(
          (postItem) => postItem?._id !== post?._id
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message || "Post deleted successfully");
        setDialogOpen(false);
      }
    } catch (error) {
      console.error("Delete post error:", error);
      toast.error(error.response?.data?.message || "Failed to delete post");
      setDialogOpen(false);
    }
  };

  return (
    // Changed from mx-auto to just my-8 to prevent shifting
    <div className="my-8 w-full max-w-sm md:max-w-lg bg-white border border-gray-200 rounded-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 px-1 mt-2 mx-1">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={post.author?.profilePicture}
              alt={`${post.author?.username || "User"}'s avatar`}
            />
            <AvatarFallback className="text-xs font-medium">
              <img src="/defaultimg.jpg" alt="default avatar" />
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-2">
            <Link
              className="cursor-pointer"
              to={`/profile/${post.author?._id}`}
            >
              <h1 className="text-sm font-semibold">
                {post.author?.username || "Unknown"}
              </h1>
            </Link>
            <span className="text-gray-500 text-xs">•</span>
            {user?._id === post.author?._id && (
              <Badge variant="secondary">Author</Badge>
            )}
          </div>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <button
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="More options"
            >
              <MoreHorizontal className="cursor-pointer w-5 h-5" />
            </button>
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm text-center w-80">
            <Button
              variant="ghost"
              className="cursor-pointer w-full text-[#ED4956] font-bold hover:bg-gray-50"
            >
              {user?.isFollowing ? "Unfollow" : "Follow"}
            </Button>
            <Button
              variant="ghost"
              className="cursor-pointer w-full hover:bg-gray-50"
            >
              Add to favorites
            </Button>
            <Button
              variant="ghost"
              className="cursor-pointer w-full hover:bg-gray-50"
            >
              Copy link
            </Button>
            <Button
              variant="ghost"
              className="cursor-pointer w-full hover:bg-gray-50"
            >
              Share to...
            </Button>
            {user && user?._id === post?.author?._id ? (
              <Button
                variant="ghost"
                className="cursor-pointer w-full text-[#ED4956] hover:bg-gray-50"
                onClick={deletePostHandler}
              >
                Delete
              </Button>
            ) : (
              <Button
                variant="ghost"
                className="cursor-pointer w-full text-[#ED4956] hover:bg-gray-50"
              >
                Report
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Post Image */}
      <div className="relative">
        <img
          className="rounded-sm w-full aspect-square object-cover border border-gray-200"
          src={post?.image}
          alt="Post content"
          loading="lazy"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between my-3 px-1">
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleLike(post._id)}
            className="p-1 hover:bg-gray-100 rounded-full transition-all duration-200"
            aria-label={isLiked ? "Unlike post" : "Like post"}
            disabled={!user}
          >
            {isLiked ? (
              <FaHeart size="24" className="text-red-500 cursor-pointer " />
            ) : (
              <FaRegHeart
                size="24"
                className="cursor-pointer hover:text-gray-600 transition-colors"
              />
            )}
          </button>
          <button
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Comment on post"
          >
            <MessageCircle
              className="cursor-pointer hover:text-gray-600 w-6 h-6"
              onClick={() => {
                dispatch(setSelectedPost(post));
                setOpen(true);
              }}
            />
          </button>
          <button
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Share post"
          >
            <Send className="cursor-pointer hover:text-gray-600 w-6 h-6" />
          </button>
        </div>

        <button
          onClick={handleBookmark}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          aria-label={isBookmarked ? "Remove bookmark" : "Bookmark post"}
          disabled={!user}
        >
          {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
        </button>
      </div>

      {/* Likes Count */}
      <div className="px-1 mb-2">
        <span className="font-semibold text-sm">
          {formatLikes(likesCount)} {likesCount === 1 ? "like" : "likes"}
        </span>
      </div>

      {/* Caption */}
      <div className="px-1 mb-2">
        <p className="text-sm">
          <span className="font-semibold mr-2">
            {post.author?.username || "Unknown"}
          </span>
          {post.caption || ""}
        </p>
      </div>

      {/* Comments */}
      {comments.length > 0 && (
        <div className="px-1 mb-2">
          <button
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
            onClick={() => {
              dispatch(setSelectedPost(post));
              setOpen(true);
            }}
          >
            View all {comments.length} comments
          </button>
        </div>
      )}

      <Commentdialog open={open} setOpen={setOpen} comments={comments} />

      {/* Add Comment */}
      <div className="flex items-center border-t pt-3 mt-3">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment..."
          className="text-sm flex-1 px-3 py-2 focus:outline-none"
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleComment();
            }
          }}
          disabled={!user}
        />
        <button
          onClick={handleComment}
          disabled={!text.trim() || !user}
          className={`ml-2 text-sm font-semibold px-3 py-2 rounded transition-colors ${
            text.trim() && user
              ? "text-[#3BADF8] hover:text-[#1d9bf0] cursor-pointer"
              : "text-gray-400 cursor-not-allowed"
          }`}
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default Post;
