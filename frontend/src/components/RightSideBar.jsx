import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SuggestedUser from "./SuggestedUser";

const RightSideBar = () => {
  const { user } = useSelector((store) => store.auth);

  return (
    <div className="hidden lg:block w-80 fixed right-0 top-0 h-full border-l border-gray-200 bg-white">
      <div className="p-6 mt-4">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${user._id}`}>
            <Avatar className="w-12 h-12">
              <AvatarImage src={user?.profilePicture} />
              <AvatarFallback className="text-lg font-semibold">
                {user?.username?.slice(0, 1)}
              </AvatarFallback>
            </Avatar>
          </Link>
          
          <div className="flex-1">
            <h1 className="font-semibold text-sm">{user?.username}</h1>
            <span className="text-gray-500 text-xs">{user?.bio || "Bio here..."}</span>
          </div>
        </div>
        
        {/* Additional sidebar content can go here */}
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-gray-500 mb-4">Suggestions for you</h3>
          {/*  suggested users, */}
          <SuggestedUser />
        </div>
      </div>
    </div>
  );
};

export default RightSideBar;
