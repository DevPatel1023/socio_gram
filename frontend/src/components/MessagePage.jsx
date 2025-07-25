import React from "react";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useUserFriends from "@/hooks/useUserFriends";
import { Input } from "./ui/input";
import { Search } from "lucide-react";

const MessagePage = () => {
  const { user } = useSelector((store) => store.auth);
  const { inboxUsers, loading, error } = useUserFriends();
  const isOnline = true;

  if (loading) return <p>Loading inbox...</p>;
  if (error) return <p>Error loading inbox.</p>;

  return (
    // Break out of MainLayout's content wrapper constraints
    <div className="w-full h-screen bg-white overflow-hidden md:absolute md:inset-2 md:left-30 md:-mx-4 md:-my-4">
      <section className="flex flex-col md:flex-row h-full">
        {/* Sidebar Panel */}
        <div className="md:w-80 w-full p-4 flex flex-col space-y-4 border-r border-gray-300 bg-white">
          <h1 className="font-bold text-xl truncate">{user?.username}</h1>

          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
            <Search className="px-3 text-gray-500 flex-shrink-0" size={16} />
            <Input
              type="text"
              placeholder="Search"
              className="flex-1 py-2 px-3 outline-none text-sm border-none focus:ring-0"
            />
          </div>

          <hr className="border-gray-300" />

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
                  <span
                    className={`${
                      isOnline ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    •
                  </span>
                  <span className="flex-shrink-0">{type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Panel */}
        <div className="md:flex hidden flex-1 items-center justify-center p-4 bg-gray-50">
          <p className="text-gray-500">
            Select a conversation to start messaging.
          </p>
        </div>
      </section>
    </div>
  );
};

export default MessagePage;
