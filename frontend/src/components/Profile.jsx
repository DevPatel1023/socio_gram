import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const Profile = () => {
  const params = useParams();
  const currentUserId = params.id;
  useGetUserProfile(currentUserId);

  const { user } = useSelector((store) => store.auth);

  return (
    <div className="flex max-w-4xl justify-center mx-auto pl-10">
      <div className="flex flex-col gap-20 p-8">

      </div>
      <div className='grid grid-cols-2 '>
        <section className="flex items-center justify-center">
          <Avatar className='h-32 w-32'>
            <AvatarImage src={user?.profilePicture} alt="profile image" />
            <AvatarFallback>{user?.username.slice(0, 1)}</AvatarFallback>
          </Avatar>
        </section>
      </div>
    </div>
  );
};

export default Profile;
