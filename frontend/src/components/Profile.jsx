import { useParams, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const { id } = useParams(); // Get ID from URL
  const { user } = useSelector((store) => store.auth);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:8000/api/v1/user/${id}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setProfileData(res.data.user);
        } else {
          setError("User not found");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  // Redirect to login if user is not authenticated
  if (!user || !user._id) {
    return <Navigate to="/login" replace />;
  }

  // Handle invalid ID or API error
  if (error) {
    return (
      <div className="text-red-600 text-center mt-10">
        {error}. Please check the URL and try again.
      </div>
    );
  }

  // Show loading state
  if (loading) {
    return <div className="text-center mt-10">Loading profile...</div>;
  }

  // Render profile data
  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h1 className="text-2xl font-bold">{profileData?.username}'s Profile</h1>
      <img
        src={profileData?.profilePicture}
        alt="profile"
        className="w-24 h-24 rounded-full"
      />
      <p>{profileData?.bio}</p>
      <p>Followers: {profileData?.follower?.length || 0}</p>
      <p>Following: {profileData?.following?.length || 0}</p>
      <p>Posts: {profileData?.posts?.length || 0}</p>
    </div>
  );
};

export default Profile;