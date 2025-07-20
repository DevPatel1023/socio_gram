import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const useFollowUser = (initialFollowStatus = {}) => {
    const [followedUser, setFollowedUser] = useState(() => {
        const stored = localStorage.getItem("followedUser");
        return stored ? JSON.parse(stored) : initialFollowStatus;
    }); 

    useEffect(() => { 
        localStorage.setItem("followedUser",JSON.stringify(followedUser));
    },[followedUser]);
    const toggleFollow = async (userId) => {
        try {
            const res = await axios.post(`http://localhost:8000/api/v1/user/followorunfollow/${userId}`, {}, {
                withCredentials: true
            });

            if (res.data.success) {
                // toggle the follow user
                setFollowedUser((prev) => ({
                    ...prev,
                    [userId]: !prev[userId],
                }))
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message || 'follow successful');
        }
    };
    const isFollowed = (userId) => !!followedUser[userId];

    return { toggleFollow, isFollowed };
}

export default useFollowUser;