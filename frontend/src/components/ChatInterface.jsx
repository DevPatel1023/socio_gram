import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useParams } from "react-router-dom";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import { useSelector } from "react-redux";
import { Phone, Video, Info, Smile, Image, Mic, Send } from "lucide-react";

const ChatInterface = () => {
  const { id } = useParams();
  useGetUserProfile(id);
  const { userProfile } = useSelector((state) => state.auth);
  const [message, setMessage] = useState("");

  if (!userProfile) return (
    <div className="flex items-center justify-center h-full">
      <p className="text-gray-500">Loading chat...</p>
    </div>
  );

  // Helper function to get safe image src
  const getSafeImageSrc = (src) => {
    return src && src.trim() !== "" ? src : null;
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="w-10 h-10">
              <AvatarImage
                src={getSafeImageSrc(userProfile?.profilePicture)}
                alt={userProfile?.username}
              />
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-semibold">
                {userProfile?.username?.charAt(0)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          
          <div>
            <h1 className="font-semibold text-gray-900">{userProfile?.username}</h1>
            <p className="text-sm text-gray-500">Active now</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Phone size={20} className="text-gray-600 cursor-pointer hover:text-gray-800 transition-colors" />
          <Video size={20} className="text-gray-600 cursor-pointer hover:text-gray-800 transition-colors" />
          <Info size={20} className="text-gray-600 cursor-pointer hover:text-gray-800 transition-colors" />
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4 bg-gray-50">
        <div className="space-y-4">
          {/* Welcome Message */}
          <div className="text-center py-8">
            <Avatar className="w-16 h-16 mx-auto mb-4">
              <AvatarImage
                src={getSafeImageSrc(userProfile?.profilePicture)}
                alt={userProfile?.username}
              />
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-semibold text-xl">
                {userProfile?.username?.charAt(0)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h3 className="font-semibold text-gray-900 mb-1">{userProfile?.username}</h3>
            <p className="text-sm text-gray-500 mb-2">
              {userProfile?.bio || "No bio available"}
            </p>
            <p className="text-xs text-gray-400">You're friends on Instagram</p>
          </div>

          {/* Sample Messages */}
          <div className="space-y-3">
            {/* Received Message */}
            <div className="flex items-start gap-2">
              <Avatar className="w-6 h-6 mt-2">
                <AvatarImage src={getSafeImageSrc(userProfile?.profilePicture)} />
                <AvatarFallback className="text-xs bg-gray-300">
                  {userProfile?.username?.charAt(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="bg-gray-200 rounded-2xl rounded-tl-md px-4 py-2 max-w-xs">
                <p className="text-gray-900">Hey! How are you doing?</p>
              </div>
            </div>

            {/* Sent Message */}
            <div className="flex justify-end">
              <div className="bg-blue-500 rounded-2xl rounded-tr-md px-4 py-2 max-w-xs">
                <p className="text-white">I'm doing great! Thanks for asking 😊</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Message Input */}
      <div className="px-6 py-4 border-t border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Message..."
              className="w-full px-4 py-2.5 pr-20 bg-gray-100 border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
              <Smile size={16} className="text-gray-500 cursor-pointer hover:text-gray-700" />
              <Image size={16} className="text-gray-500 cursor-pointer hover:text-gray-700" />
            </div>
          </div>
          
          {message.trim() ? (
            <button className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors">
              <Send size={16} />
            </button>
          ) : (
            <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
              <Mic size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;