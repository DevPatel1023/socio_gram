// src/components/Profile.jsx
import { useParams, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import useGetUserProfile from "../hooks/useGetUserProfile";
import useFollowUser from "../hooks/useFollowUser";

const Profile = () => {
  const { id } = useParams();
  const { user, userProfile } = useSelector((store) => store.auth);
  const { toggleFollow, isFollowed } = useFollowUser();
  const [status, setStatus] = useState({ loading: true, error: null });

  useGetUserProfile(id);

  useEffect(() => {
    if (!id || id === "undefined" || id === "null") {
      setStatus({ loading: false, error: "Invalid user ID." });
      return;
    }
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      setStatus({ loading: false, error: "Invalid ID format." });
      return;
    }
    if (userProfile === undefined) {
      // still fetching
      return;
    }
    if (userProfile === null) {
      setStatus({ loading: false, error: "User not found." });
    } else if (userProfile._id === id) {
      setStatus({ loading: false, error: null });
    } else {
      setStatus({ loading: false, error: "User not found." });
    }
  }, [id, userProfile]);

  if (!user || !user._id) {
    return <Navigate to="/login" replace />;
  }

  if (status.error) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-6 text-center">
        <p className="text-red-600 font-semibold">{status.error}</p>
      </div>
    );
  }

  if (status.loading) {
    return (
      <div className="text-center mt-10">
        <div className="animate-spin h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading profile…</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center mb-6">
        <img
          src={userProfile.profilePicture || "/default-avatar.png"}
          alt="Profile"
          className="w-24 h-24 rounded-full border-4 border-purple-200"
          onError={(e) => (e.target.src = "/default-avatar.png")}
        />
        <div className="ml-4">
          <h1 className="text-2xl font-bold text-gray-900">{userProfile.username}</h1>
          <p className="text-gray-600">{userProfile.bio || "No bio available."}</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 text-center mb-6">
        <div>
          <p className="text-xl font-bold text-purple-600">{userProfile.posts.length}</p>
          <p className="text-gray-600">Posts</p>
        </div>
        <div>
          <p className="text-xl font-bold text-purple-600">{userProfile.follower.length}</p>
          <p className="text-gray-600">Followers</p>
        </div>
        <div>
          <p className="text-xl font-bold text-purple-600">{userProfile.following.length}</p>
          <p className="text-gray-600">Following</p>
        </div>
      </div>
      {user._id !== id && (
        <div className="text-center">
          <button
            onClick={() => toggleFollow(id)}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
              isFollowed(id) ? "bg-gray-300 text-gray-800" : "bg-purple-600 text-white"
            }`}
          >
            {isFollowed(id) ? "Unfollow" : "Follow"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
