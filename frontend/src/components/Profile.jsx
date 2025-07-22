// src/components/Profile.jsx
import { useParams, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import useGetUserProfile from "../hooks/useGetUserProfile";
import useFollowUser from "../hooks/useFollowUser";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Settings, UserPlus } from "lucide-react";

const Profile = () => {
  const { id } = useParams();
  const { user, userProfile } = useSelector((store) => store.auth);
  const { toggleFollow, isFollowed } = useFollowUser();
  const [status, setStatus] = useState({ loading: true, error: null });

  useGetUserProfile(id);
  const isUserOwner = user?._id === id;
  const isFollowing = isFollowed(id);

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
    <div className="flex justify-center max-w-5xl mx-auto mt-10 p-6">
      <div className="flex flex-col gap-20 mb-6 ">
        <div className="grid grid-cols-2">
          <section>
            <Avatar className="w-32 h-32">
              <AvatarImage
                src={userProfile?.profilePicture}
                alt="profile image"
              />
              <AvatarFallback>
                <img src="/defaultimg.jpg" alt="default avatar" />
              </AvatarFallback>
            </Avatar>
          </section>
          <section>
            <div className="flex items-center justify-center md:flex-row flex-col gap-2">
              <h1 className="text-xl">{userProfile?.username}</h1>

              {/* buttons */}

              {isUserOwner ? (
                <div className="flex md:flex-row flex-col gap-2">
                  <Button
                    variant="secondary"
                    className="bg-gray-900 hover:bg-gray-800 h-8 text-white cursor-pointer"
                  >
                    Edit profile
                  </Button>
                  <Button
                    variant="secondary"
                    className="bg-gray-900 hover:bg-gray-800 h-8 text-white cursor-pointer"
                  >
                    view archives
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="bg-gray-900 hover:bg-gray-800 h-8 text-white cursor-pointer"
                  >
                    <Settings />
                  </Button>
                </div>
              ) : (
                <div className="flex md:flex-row flex-col gap-2">
                  <Button
                    variant={ isFollowing ? "outline" : "default"}
                    onClick = {()=> toggleFollow(id)}
                    className={`${ isFollowing ? "text-red-500 hover:text-red-600 hover:border-red-500 cursor-pointer" : "text-white bg-blue-500 hover:bg-blue-600 hover:text-white cursor-pointer"}`}
                  >
                    {isFollowing ? "unfollow" : "follow"}
                  </Button>
                  <Button
                    variant="secondary"
                    className="bg-gray-900 hover:bg-gray-800 h-8 text-white cursor-pointer"
                  >
                    Message
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="bg-gray-900 hover:bg-gray-800 h-8 text-white cursor-pointer"
                  >
                    <UserPlus />
                  </Button>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Profile;
