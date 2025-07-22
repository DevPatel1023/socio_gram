import { setUserProfile } from "@/redux/authSlide";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetUserProfile = (userId) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) return;

      try {
        const res = await axios.get(
          `http://localhost:8000/api/v1/user/${userId}/profile`, 
          { withCredentials: true }
        );
        if (res.data.success) {
          dispatch(setUserProfile(res.data.user));
        } else {
          console.log("User not found in hook");
        }
      } catch (error) {
        console.error("useGetUserProfile error:", error.response?.data || error.message);
      }
    };

    fetchUserProfile();
  }, [dispatch, userId]);
};

export default useGetUserProfile;
