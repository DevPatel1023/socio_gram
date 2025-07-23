import React from "react";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const EditProfile = () => {
  const { user } = useSelector((store) => store.auth);
  return (
    <div className="flex max-w-2xl mx-auto">
      <section>
        <h1 className="font-bold text-xl">Edit profile</h1>
        <div>
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Avatar className="w-14 h-14">
                <AvatarImage src={user?.profilePicture} alt={user?.username} />
                <AvatarFallback className="text-lg font-semibold bg-gray-200 text-gray-700">
                  {user?.username?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col ">
                <h1 className="font-semibold text-sm">{user?.username}</h1>

                <span className="text-sm text-gray-500">
                  {user?.bio || user?.username}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EditProfile;
