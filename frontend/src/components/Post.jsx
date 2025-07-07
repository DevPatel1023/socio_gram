import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import React from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { BookMarked, MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { MessageCircle, Send } from "lucide-react";
import Commentdialog from "./Commentdialog";

const Post = () => {
  return (
    <div className="my-8 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src="" alt="post_image" />
            <AvatarFallback>cv</AvatarFallback>
          </Avatar>
          <h1>username</h1>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm text-center">
            <Button
              variant="ghost"
              className="cursor-pointer w-fit text-[#ED4956] font-bold"
            >
              unfollow
            </Button>
            <Button variant="ghost" className="cursor-pointer w-fit ">
              Add to favorites
            </Button>
            <Button variant="ghost" className="cursor-pointer w-fit">
              delete
            </Button>
          </DialogContent>
        </Dialog>
      </div>
      <img
        className="rounded-sm my-2 w-full aspect-square object-cover"
        src="https://images.unsplash.com/photo-1484406566174-9da000fda645?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGFuaW1hbHN8ZW58MHx8MHx8fDA%3D"
        alt="post_img"
      />
        <div className="flex items-center justify-between my-2">
          <div className="flex items-center gap-3">
            <FaRegHeart
              size={"22px"}
              className="cursor-pointer hover:text-gray-600"
            />
            <MessageCircle className="cursor-pointer hover:text-gray-600" />
            <Send className="cursor-pointer hover:text-gray-600" />
          </div>

          <BookMarked className="cursor-pointer hover:text-gray-600" />
        </div>
        <span className="font-medium block mb-2">1k likes</span>
        <p>
          <span className="font-medium mr-2">username</span>
          postcaption
        </p>
        <span>View all 10 comments</span>
        <Commentdialog />
        <div>
          <input type="text" placeholder="add a comment" className="outline-none text-sm w-full" />
          <span className="text-[#3BADF8]">Post </span>
        </div>
      </div>
  );
};

export default Post;
