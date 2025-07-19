import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const SuggestedUser = () => {
  const { suggestedUsers = [] } = useSelector((store) => store.auth);

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-gray-500 font-semibold text-sm">Suggested for you</h2>
        <button className="text-xs font-semibold text-gray-900 hover:text-gray-600">
          See All
        </button>
      </div>

      <div className="space-y-3">
        {suggestedUsers.map((user) => (
          <div key={user._id} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link to={`/profile/${user._id}`}>
                <Avatar className="w-8 h-8">
                  <AvatarImage 
                    src={user?.profilePicture} 
                    alt={user?.username}
                  />
                  <AvatarFallback className="text-xs font-medium bg-gray-200 text-gray-700">
                    {user?.username?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>
              
              <div className="flex flex-col">
                <Link 
                  to={`/profile/${user._id}`}
                  className="text-sm font-semibold text-gray-900 hover:text-gray-600"
                >
                  {user.username}
                </Link>
                <span className="text-xs text-gray-500">Suggested for you</span>
              </div>
            </div>
            
            <button className="text-xs font-semibold text-blue-500 hover:text-blue-700">
              Follow
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestedUser;