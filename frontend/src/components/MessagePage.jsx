import React from "react";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useUserFriends from "@/hooks/useUserFriends";

const MessagePage = () => {
  const { user } = useSelector((store) => store.auth);
  const { inboxUsers, loading, error } = useUserFriends();

  if (loading) return <p>Loading inbox...</p>;
  if (error) return <p>Error loading inbox.</p>;

  return (
    <div>
      <section className="flex ml-[16%] h-screen">
        <h1 className="font-bold mb-4 px-3 text-xl">{user?.username}</h1>
        <hr className="mb-4 border-gray-500" />
        <div className="overflow-y-auto h-[80vh]">
          {inboxUsers.map(({ user, type }) => {
            return (
              <div key={user?._id}>
                <Avatar>
                  <AvatarImage src={user?.profilePicture} alt="profile image" />
                  <AvatarFallback>
                    {" "}
                    <img src="/defaultimg.jpg" alt="default avatar" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <span>{user?.username}</span>
                  <span>{type}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default MessagePage;
