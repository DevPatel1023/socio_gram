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
    <div className="relative left-0">
      <section className="flex h-screen">
        {/* Sidebar Panel */}
        <div className="w-1/4 p-4 flex flex-col space-y-4 border-r border-gray-300">
          {/* Username */}
          <h1 className="font-bold text-xl">{user?.username}</h1>

          {/* Search Bar */}
          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
            <Search className="px-3 text-gray-500" />
            <Input
              type="text"
              placeholder="Search"
              className="flex-1 py-2 px-3 outline-none text-sm"
            />
          </div>

          {/* Divider */}
          <hr className="border-gray-300" />

          {/* Inbox Users */}
          <div className="overflow-y-auto h-[70vh] space-y-2 pr-2">
            {inboxUsers.map(({ user, type }) => (
              <div
                key={user?._id}
                className="flex gap-3 items-center p-3 hover:bg-gray-100 cursor-pointer transition-colors rounded"
              >
                <Avatar>
                  <AvatarImage src={user?.profilePicture} alt="profile image" />
                  <AvatarFallback>
                    <img src="/defaultimg.jpg" alt="default avatar" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex items-center text-sm text-gray-700 space-x-2">
                  <span>{user?.username}</span>
                  <span className="text-gray-400">•</span>
                  <span>{type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Panel (Optional placeholder for messages) */}
        <div className="flex-1 p-4">{/* Put chat content here later */}</div>
      </section>
    </div>
  );
};

export default MessagePage;
