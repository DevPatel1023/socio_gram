import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "@/redux/chatSlice";

const useGetRealTimeMsg = () => {
  const dispatch = useDispatch();
  const socketio = useSelector((state) => state.socketio);
  const socket = socketio?.socket;
  const messages = useSelector((state) => state.chat.messages);

  useEffect(() => {
    if (!socket) {
      console.log("Socket not available");
      return;
    }

    console.log("Setting up real-time message listener");

    const handleNewMessage = (newMessage) => {
      console.log("Received new message:", newMessage);
      
      // Get current messages from state to avoid stale closure
      dispatch((dispatch, getState) => {
        const currentMessages = getState().chat.messages || [];
        dispatch(setMessages([...currentMessages, newMessage]));
      });
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      console.log("Cleaning up real-time message listener");
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, dispatch]); // Remove messages from dependencies to avoid stale closure

  // Add connection status logging
  useEffect(() => {
    if (socket) {
      console.log("Socket connected:", socket.connected);
      console.log("Socket ID:", socket.id);
    }
  }, [socket]);
};

export default useGetRealTimeMsg;