import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useUserFriends from "@/hooks/useUserFriends";
import { Input } from "./ui/input";
import { Search, MoreHorizontal } from "lucide-react";
import { setSelectedUserInbox } from "../redux/authSlide";
import { Outlet, useNavigate } from "react-router-dom";

const MessagePage = () => {
  const dispatch = useDispatch();
  const { user, selectedUserInbox } = useSelector((store) => store.auth);
  const { inboxUsers, loading, error } = useUserFriends();
  const { onlineUsers } = useSelector((store) => store.chat);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setSelectedUserInbox(null));
  }, [dispatch]);

  const handleUserSelect = (userId) => {
    dispatch(setSelectedUserInbox(userId));
    navigate(`/inbox/${userId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">Loading inbox...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">Error loading inbox.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-white overflow-hidden md:absolute md:inset-2 md:pl-14">
      <section className="flex flex-col md:flex-row h-full">
        {/* Sidebar */}
        <div className="md:w-80 w-full flex flex-col bg-white border-r border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="flex-shrink-0 p-6 border-b border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h1 className="font-semibold text-2xl text-gray-900">
                {user?.username}
              </h1>
              <MoreHorizontal
                size={20}
                className="text-gray-600 cursor-pointer hover:text-gray-800"
              />
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <Input
                type="text"
                placeholder="Search"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
              />
            </div>
          </div>

          {/* User List */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-2 py-2">
              {inboxUsers.map(({ user }) => {
                const isOnline = onlineUsers?.includes(user?._id);

                return (
                  <div
                    key={user?._id}
                    onClick={() => handleUserSelect(user._id)}
                    className={`flex items-center gap-3 p-3 mx-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                      selectedUserInbox === user._id
                        ? "bg-blue-50 border-l-4 border-blue-500"
                        : ""
                    }`}
                  >
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        <AvatarImage
                          src={user?.profilePicture}
                          alt="profile image"
                        />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-semibold">
                          {user?.username?.charAt(0)?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900 truncate">
                          {user?.username}
                        </h3>
                        <span className="text-xs text-gray-500">&nbsp;</span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-sm text-gray-500 truncate">
                          {isOnline ? "Active now" : "\u00A0"}
                        </p>
                        {isOnline && (
                          <span className="inline-flex items-center justify-center w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Chat Panel */}
        <div className="md:flex hidden flex-1 flex-col bg-white">
          {selectedUserInbox ? (
            <Outlet />
          ) : (
            <div className="flex flex-col items-center justify-center h-full bg-gray-50">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Your Messages
                </h2>
                <p className="text-gray-500 max-w-sm">
                  Send private photos and messages to a friend or group.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default MessagePage;
