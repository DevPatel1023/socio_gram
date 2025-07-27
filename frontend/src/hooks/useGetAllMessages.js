// src/hooks/useGetAllMessages.js
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setMessages } from "@/redux/chatSlice";

const useGetAllMessages = (receiverId) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAllMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/v1/message/all/${receiverId}`,
          { withCredentials: true }
        );

        if (res.data.success) {
          dispatch(setMessages(res.data.messages));
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    if (receiverId) fetchAllMessages();
  }, [receiverId, dispatch]);
};

export default useGetAllMessages;
