import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const SuggestedUser = () => {
  const { suggestedUsers = [] } = useSelector((store) => store.auth); 
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium cursor-pointer">see all...</span>
      </div>

      {suggestedUsers.map((user) => (
        <div key={user._id} className="flex items-center gap-3 mt-2">
          <Link to={`/profile/${user._id}`}>
            <Avatar className="w-12 h-12">
              <AvatarImage src={user?.profilePicture || "https://placehold.co/"} />
              <AvatarFallback className="text-lg font-semibold">
                {user?.username?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div className="text-sm font-medium">{user.username}</div>
        </div>
      ))}
    </div>
  );
};

export default SuggestedUser;
