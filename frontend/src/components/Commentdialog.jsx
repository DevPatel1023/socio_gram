import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";

const Commentdialog = ({ open, setOpen }) => {
  const [text , setText] = useState("");

  const changeEventHandler = (e)=>{
    const inputText = e.target.value;
    if(inputText.trim()){
      setText(inputText);
    }
    else{
      setText("");
    }
  }

  const sendCommentHandler = async() => {
    alert(text);
  }
  return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="max-w-5xl p-0 flex flex-1"
      >
        <div className="flex flex-1">
          <div className="w-1/2">
            <img
              src="https://images.unsplash.com/photo-1484406566174-9da000fda645?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGFuaW1hbHN8ZW58MHx8MHx8fDA%3D"
              alt="random img"
              className="w-full h-full object-cover rounded-l-lg"
            />
          </div>

          <div className="w-1/2 flex flex-col justify-between">
            <div className="flex items-center justify-between p-4">
              <div className="flex gap-3 items-center">
                <Link>
                  <Avatar>
                    <AvatarImage src="" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link className="font-semibold text-sm">username</Link>
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className="cursor-pointer" />
                </DialogTrigger>
                <DialogContent>
                  <div className="cursor-pointer w-full text-[#ED4956] text-center hover:bg-gray-200">
                    UnFollow
                  </div>
                  <div className="cursor-pointer w-full text-center hover:bg-gray-200">
                    Add to favourites
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <hr />
            {/* comments */}
            <div className="flex-1 overflow-y-auto max-h-96 p-4 flex-row">
              cccc
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2">
                <input type="text" placeholder="add a comment..." className="w-full outline-none border focus:border-gray-500 p-2 rounded" onChange={changeEventHandler} value={text} />
                <Button disabled={!text.trim()} onClick={sendCommentHandler} variant="outline">Send</Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Commentdialog;
