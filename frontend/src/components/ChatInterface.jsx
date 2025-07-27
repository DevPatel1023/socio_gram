import React, { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useParams } from "react-router-dom";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import { useDispatch, useSelector } from "react-redux";
import { Phone, Video, Info, Smile, Image, Mic, Send } from "lucide-react";
import axios from "axios";
import { setMessages } from "@/redux/chatSlice";
import useGetAllMessages from "@/hooks/useGetAllMessages";

const ChatInterface = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  // Fetch user profile based on URL id
  useGetUserProfile(id);

  // Fetch all messages for selectedUserInbox from Redux
  useGetAllMessages();

  const { userProfile, user, selectedUserInbox } = useSelector((state) => state.auth);
  const { messages } = useSelector((state) => state.chat);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Optional: If you want to stop loading when profile and messages are ready
  useEffect(() => {
    if (userProfile && messages) setLoading(false);
  }, [userProfile, messages]);

  // Safe image source
  const getSafeImageSrc = (src) => (src && src.trim() !== "" ? src : null);

  const sendMessageHandler = async (receiverId) => {
    if (!message.trim()) return;

    const originalMessage = message;
    setMessage(""); 

    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/message/send/${receiverId}`,
        { message: originalMessage },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data?.success) {
        const currentMessages = Array.isArray(messages) ? messages : [];
        dispatch(setMessages([...currentMessages, res.data.newMessage]));
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessage(originalMessage); // restore on error
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessageHandler(id);
    }
  };

  if (loading || !userProfile) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-gray-500">Loading chat...</p>
        </div>
      </div>
    );
  }

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
            <h1 className="font-semibold text-gray-900">
              {userProfile?.username}
            </h1>
            <p className="text-sm text-gray-500">Active now</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Phone size={20} className="text-gray-600 cursor-pointer hover:text-gray-800 transition-colors" />
          <Video size={20} className="text-gray-600 cursor-pointer hover:text-gray-800 transition-colors" />
          <Info size={20} className="text-gray-600 cursor-pointer hover:text-gray-800 transition-colors" />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 bg-gray-50">
        <div className="space-y-4">
          {(!messages || messages.length === 0) && (
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
              <p className="text-sm text-gray-500 mb-2">{userProfile?.bio || "No bio available"}</p>
              <p className="text-xs text-gray-400">Start your conversation</p>
            </div>
          )}

          {Array.isArray(messages) &&
            messages.map((msg, index) => {
              if (typeof msg === "string") {
                // skip malformed message
                return null;
              }

              let isCurrentUser = false;

              if (msg.senderId) {
                if (typeof msg.senderId === "object" && msg.senderId._id) {
                  isCurrentUser = msg.senderId._id.toString() === user?._id?.toString();
                } else if (typeof msg.senderId === "string") {
                  isCurrentUser = msg.senderId.toString() === user?._id?.toString();
                }
              }

              return (
                <div key={msg._id || `msg-${index}`} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                  <div className={`px-4 py-2 rounded-2xl max-w-xs break-words ${
                    isCurrentUser ? "bg-blue-500 text-white rounded-tr-md" : "bg-gray-200 text-gray-900 rounded-tl-md"
                  }`}>
                    <p className="text-sm">{msg.messages || "No content"}</p>
                  </div>
                </div>
              );
            })}

          <div ref={messagesEndRef} />
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
              onKeyPress={handleKeyPress}
              placeholder="Message..."
              className="w-full px-4 py-2.5 pr-20 bg-gray-100 border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
              <Smile size={16} className="text-gray-500 cursor-pointer hover:text-gray-700" />
              <Image size={16} className="text-gray-500 cursor-pointer hover:text-gray-700" />
            </div>
          </div>

          {message.trim() ? (
            <button
              className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
              onClick={() => sendMessageHandler(id)}
            >
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
