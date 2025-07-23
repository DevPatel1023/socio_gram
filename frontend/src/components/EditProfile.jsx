import React, { useRef } from "react";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const EditProfile = () => {
  const imgRef = useRef();
  const { user } = useSelector((store) => store.auth);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <section className="flex flex-col gap-6">
        {/* Avatar + change image */}
        <div className="flex items-center w-full space-x-4 bg-gray-100 rounded-xl p-4">
          <Avatar className="w-14 h-14">
            <AvatarImage src={user?.profilePicture} alt={user?.username} />
            <AvatarFallback className="text-lg font-semibold bg-gray-200 text-gray-700">
              {user?.username?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex justify-between items-center w-full">
            <div className="flex flex-col">
              <h1 className="font-semibold text-sm">{user?.username}</h1>
              <span className="text-sm text-gray-500">
                {user?.bio || user?.username}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Input ref={imgRef} type="file" className="hidden" />
              <Button
                onClick={() => imgRef?.current.click()}
                variant="primary"
                className="bg-blue-500 text-white hover:bg-blue-600"
              >
                Change image
              </Button>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="flex flex-col gap-3">
          <label className="font-bold text-sm">Bio</label>
          <Textarea
            className="focus-visible:ring-transparent"
            placeholder="Write something about yourself..."
          />
        </div>

        {/* gender */}
        <div className="flex flex-col gap-3">
          <label className="font-bold text-sm">Gender</label>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Button className='' />
        </div>
      </section>
    </div>
  );
};

export default EditProfile;
