// useFollowUser.js
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { toggleFollowState } from "../redux/authSlide.js";

const useFollowUser = () => {
  const dispatch = useDispatch();
  const { suggestedUsers } = useSelector((store) => store.auth);

  // Toggle follow status via API and update redux state
  const toggleFollow = async (userId) => {
    // Validate userId before making API call
    if (!userId || userId === 'undefined') {
      toast.error("Invalid user ID");
      return;
    }

    try {
      console.log('Toggling follow for userId:', userId);
      
      const res = await axios.post(
        `http://localhost:8000/api/v1/user/followorunfollow/${userId}`,
        {},
        { withCredentials: true }
      );

      console.log('Follow toggle response:', res.data);

      if (res.data.success) {
        dispatch(toggleFollowState(userId)); // Update redux state
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message || "Follow action failed");
      }
    } catch (error) {
      console.error('Follow toggle error:', error);
      toast.error(error?.response?.data?.message || "Follow failed");
    }
  };

  // Read follow state from redux
  const isFollowed = (userId) => {
    if (!userId || userId === 'undefined') {
      return false;
    }
    
    const user = suggestedUsers?.find((u) => u._id === userId);
    return user?.isFollowing || false;
  };

  return { toggleFollow, isFollowed };
};

export default useFollowUser;