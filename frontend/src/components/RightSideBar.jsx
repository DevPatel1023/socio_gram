// RightSideBar Component
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SuggestedUser from "./SuggestedUser";

const RightSideBar = () => {
  const { user } = useSelector((store) => store.auth);

  return (
    <div className="hidden lg:block w-80 fixed right-0 top-0 h-screen bg-white border-l border-gray-200">
      <div className="p-8 pt-6">
        {/* Current User */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-4">
            <Link to={`/profile/${user._id}`}>
              <Avatar className="w-14 h-14">
                <AvatarImage src={user?.profilePicture} alt={user?.username} />
                <AvatarFallback className="text-lg font-semibold bg-gray-200 text-gray-700">
                  {user?.username?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Link>
            
            <div className="flex flex-col">
              <Link 
                to={`/profile/${user._id}`}
                className="text-sm font-semibold text-gray-900 hover:text-gray-600"
              >
                {user?.username}
              </Link>
              <span className="text-sm text-gray-500">{user?.bio || user?.username}</span>
            </div>
          </div>
          
          <button className="text-xs font-semibold text-blue-500 hover:text-blue-700">
            Switch
          </button>
        </div>

        {/* Suggested Users */}
        <SuggestedUser />

        {/* Footer Links */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="text-xs text-gray-400 leading-4">
            <p className="mb-2">
              <a href="#" className="hover:underline">About</a> • 
              <a href="#" className="hover:underline ml-1">Help</a> • 
              <a href="#" className="hover:underline ml-1">Press</a> • 
              <a href="#" className="hover:underline ml-1">API</a> • 
              <a href="#" className="hover:underline ml-1">Jobs</a> • 
              <a href="#" className="hover:underline ml-1">Privacy</a> • 
              <a href="#" className="hover:underline ml-1">Terms</a>
            </p>
            <p className="text-gray-300">© 2024 Instagram from Meta</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSideBar;
