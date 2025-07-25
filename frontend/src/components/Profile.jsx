// src/components/Profile.jsx
import { useParams, Navigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import useGetUserProfile from "../hooks/useGetUserProfile";
import useFollowUser from "../hooks/useFollowUser";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { AtSign, Heart, MessageCircle, Settings, UserPlus } from "lucide-react";
import { FiMoreHorizontal } from "react-icons/fi";
import { Badge } from "./ui/badge";
import ProfileIconBar from "./ProfileIconBar";

const Profile = () => {
  const { id } = useParams();
  const { user, userProfile } = useSelector((store) => store.auth);
  const { toggleFollow, isFollowed } = useFollowUser();
  const [status, setStatus] = useState({ loading: true, error: null });
  const [activeTab, setActiveTab] = useState("posts");

  useGetUserProfile(id);
  const isUserOwner = user?._id === id;
  const isFollowing = isFollowed(id);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const displayedContent =
    activeTab === "posts"
      ? userProfile?.posts
      : activeTab === "bookmarks"
      ? userProfile?.bookmarks
      : [];


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
          <section className="flex flex-col justify-center gap-4">
            {/* Username + Buttons */}
            <div className="flex items-center flex-wrap gap-4">
              <h1 className="text-2xl font-semibold">
                {userProfile?.username}
              </h1>

              {isUserOwner ? (
                <div className="flex flex-row flex-wrap gap-2">
                  <Link to="/profile/edit">
                    <Button
                      variant="secondary"
                      className="bg-gray-900 hover:bg-gray-800 h-8 text-white"
                    >
                      Edit profile
                    </Button>
                  </Link>
                  <Button
                    variant="secondary"
                    className="bg-gray-900 hover:bg-gray-800 h-8 text-white"
                  >
                    View archives
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="bg-gray-900 hover:bg-gray-800 h-8 text-white"
                  >
                    <Settings />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-row flex-wrap gap-2">
                  <Button
                    variant={isFollowing ? "outline" : "default"}
                    onClick={() => toggleFollow(id)}
                    className={`${
                      isFollowing
                        ? "text-red-500 hover:bg-red-500 hover:text-white"
                        : "text-white bg-blue-500 hover:bg-blue-600"
                    } h-8`}
                  >
                    {isFollowing ? "Unfollow" : "Follow"}
                  </Button>
                  {isFollowing && (
                    <section className="flex gap-2">
                      <Button
                        variant="secondary"
                        className="bg-gray-900 hover:bg-gray-800 h-8 text-white"
                      >
                        Message
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="bg-gray-900 hover:bg-gray-800 h-8 text-white"
                      >
                        <UserPlus />
                      </Button>
                    </section>
                  )}
                  <Button variant="secondary" size="icon" className="h-8">
                    <FiMoreHorizontal />
                  </Button>
                </div>
              )}
            </div>

            {/* Posts, Followers, Following */}
            <div className="flex flex-row gap-6 mt-2 text-sm text-gray-800">
              <p>
                <span className="font-semibold">
                  {userProfile?.posts.length}
                </span>{" "}
                posts
              </p>
              <p>
                <span className="font-semibold">
                  {userProfile?.following.length}
                </span>{" "}
                following
              </p>
              <p>
                <span className="font-semibold">
                  {userProfile?.follower.length}
                </span>{" "}
                followers
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-semibold whitespace-pre-line">
                {userProfile?.bio || "add bio here..."}
              </span>
              <Badge className="w-fit" variant="secondary">
                <AtSign /> {userProfile?.username}
              </Badge>

              {/* additional details -> profession , about , links */}
              {/* <div>
                  {}
                </div> */}
            </div>
          </section>
        </div>

        {/* iconbar */}
        <ProfileIconBar tabChangeFun={handleTabChange} activeTab={activeTab} />
        {/* posts,reels,saved,tagged */}
        <div className="grid grid-cols-3 gap-4">
          {displayedContent?.length > 0 ? (
            displayedContent.map((post) => (
              <div className="relative group cursor-pointer"
              key={post._id}>
                <img
                  key={post._id}
                  src={post.image}
                  alt={post.caption}
                  className="w-full h-60 object-cover rounded"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center text-white space-x-4">
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 text-current hover:text-gray-400 hover:bg-transparent"
                    >
                      <Heart />
                      <span>{post?.likes?.length}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 text-current hover:text-gray-400 hover:bg-transparent"
                    >
                      <MessageCircle />
                      <span>{post?.comments?.length}</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center col-span-3 text-gray-500 mt-6">
              {activeTab === "saved"
                ? "No saved posts yet."
                : activeTab === "reels" || activeTab === "tagged"
                ? "This feature is coming soon!"
                : "No posts available."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
