import React from "react";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useUserFriends from "@/hooks/useUserFriends";
import { Input } from "./ui/input";
import { Search } from "lucide-react";

const MessagePage = () => {
  const { user } = useSelector((store) => store.auth);
  const { inboxUsers, loading, error } = useUserFriends();
  
  if (loading) return <p>Loading inbox...</p>;
  if (error) return <p>Error loading inbox.</p>;
  
  return (
    // Break out of MainLayout's content wrapper constraints
    <div className="absolute inset-2 left-30 -mx-4 -my-4 bg-white">
      <section className="flex h-screen">
        {/* Sidebar Panel - fixed width for proper messaging layout */}
        <div className="w-80 flex-shrink-0 p-4 flex flex-col space-y-4 border-r border-gray-300 bg-white">
          {/* Username */}
          <h1 className="font-bold text-xl truncate">{user?.username}</h1>
          
          {/* Search Bar */}
          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
            <Search className="px-3 text-gray-500 flex-shrink-0" size={16} />
            <Input
              type="text"
              placeholder="Search"
              className="flex-1 py-2 px-3 outline-none text-sm border-none focus:ring-0"
            />
          </div>
          
          {/* Divider */}
          <hr className="border-gray-300" />
          
          {/* Inbox Users */}
          <div className="overflow-y-auto flex-1 space-y-2 pr-2">
            {inboxUsers.map(({ user, type }) => (
              <div
                key={user?._id}
                className="flex gap-3 items-center p-3 hover:bg-gray-100 cursor-pointer transition-colors rounded"
              >
                <Avatar className="flex-shrink-0">
                  <AvatarImage src={user?.profilePicture} alt="profile image" />
                  <AvatarFallback>
                    <img src="/defaultimg.jpg" alt="default avatar" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex items-center text-sm text-gray-700 space-x-2 min-w-0 flex-1">
                  <span className="truncate">{user?.username}</span>
                  <span className="text-gray-400 flex-shrink-0">•</span>
                  <span className="flex-shrink-0">{type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Main Panel - takes remaining space */}
        <div className="flex-1 flex items-center justify-center p-4 bg-gray-50">
          <p className="text-gray-500">Select a conversation to start messaging.</p>
        </div>
      </section>
    </div>
  );
};

export default MessagePage;