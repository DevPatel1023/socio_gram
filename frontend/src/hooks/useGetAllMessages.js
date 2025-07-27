import { setMessages } from "@/redux/chatSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAllMessages = () => {
  const dispatch = useDispatch();
  const { selectedUserInbox } = useSelector((store) => store.auth);

  useEffect(() => {
    const fetchAllMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/v1/message/all/${selectedUserInbox?._id}`,
          { withCredentials: true }
        );

        if (res.data.success) {
          dispatch(setMessages(res.data.messages)); // ✅ Fix this
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (selectedUserInbox?._id) {
      fetchAllMessages();
    }
  }, [selectedUserInbox, dispatch]);
};

export default useGetAllMessages;
