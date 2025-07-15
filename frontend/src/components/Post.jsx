import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Bookmark, MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { MessageCircle, Send } from "lucide-react";
import Commentdialog from "./Commentdialog";
import { useDispatch, useSelector } from "react-redux";
import store from "@/redux/store";
import { toast } from "sonner";
import axios from "axios";
import { setPosts } from "@/redux/postSlice";

const Post = ({ post }) => {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked);
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [comment, setComment] = useState("");
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const user = useSelector((store) => store.auth.user);
  const {posts} = useSelector((store)=>store.post);
  const dispatch = useDispatch();

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleComment = () => {
    if (comment.trim()) {
      // Handle comment submission
      setComment("");
    }
  };

  const formatLikes = (count) => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + "M";
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + "k";
    }
    return count.toString();
  };

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:8000/api/v1/post/delete/${post?._id}`,
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedPostData = posts.filter((postItem)=>postItem?._id !== post?._id)
        toast.success(res.data.message || res.data.msg);
        dispatch(setPosts(updatedPostData));
        // Close the dialog
        setDialogOpen(false);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
      // Close the dialog
      setDialogOpen(false);
    }
  };

  return (
    <div className="my-8 w-full max-w-sm mx-auto bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={post.author?.profilePicture}
              alt={`${post.author.username}'s avatar`}
            />
            <AvatarFallback className="text-xs font-medium">
              {post.author.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-semibold">{post.author.username}</h1>
            <span className="text-gray-500 text-xs">•</span>
            <span className="text-gray-500 text-xs">{post.timestamp}</span>
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
            {user && user?._id === post?.author._id ? (
              <Button
                variant="ghost"
                className="cursor-pointer w-full text-[#ED4956] hover:bg-gray-50"
                onClick={deletePostHandler}
              >
                delete
              </Button>
            ) : (
              <Button
                variant="ghost"
                className="cursor-pointer w-full text-[#ED4956] hover:bg-gray-50"
              >
                report
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Post Image */}
      <div className="relative">
        <img
          className="rounded-sm w-full aspect-square object-cover border border-gray-200"
          src={post.image}
          alt="Post content"
          loading="lazy"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between my-3 px-1">
        <div className="flex items-center gap-4">
          <button
            onClick={handleLike}
            className="p-1 hover:bg-gray-100 rounded-full transition-all duration-200"
            aria-label={isLiked ? "Unlike post" : "Like post"}
          >
            {isLiked ? (
              <FaHeart
                size="24"
                className="text-red-500 cursor-pointer animate-pulse"
              />
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
              onClick={() => setOpen(true)}
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
        >
          <Bookmark
            className={`cursor-pointer hover:text-gray-600 w-6 h-6 transition-colors ${
              isBookmarked ? "fill-current" : ""
            }`}
          />
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
          <span className="font-semibold mr-2">{post.author.username}</span>
          {post.caption}
        </p>
      </div>

      {/* Comments */}
      <div className="px-1 mb-2">
        <button
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
          onClick={() => setOpen(true)}
        >
          View all {post.comments} comments
        </button>
      </div>

      <Commentdialog open={open} setOpen={setOpen} />

      {/* Add Comment */}
      <div className="flex items-center border-t pt-3 mt-3">
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment..."
          className="text-sm flex-1 px-3 py-2 focus:outline-none"
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleComment();
            }
          }}
        />
        <button
          onClick={handleComment}
          disabled={!comment.trim()}
          className={`ml-2 text-sm font-semibold px-3 py-2 rounded transition-colors ${
            comment.trim()
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
