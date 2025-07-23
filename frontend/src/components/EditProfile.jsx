import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { setAuthUser } from "@/redux/authSlide";

const EditProfile = () => {
  const imgRef = useRef();
  const { user } = useSelector((store) => store.auth);
  const [input, setInput] = useState({
    profilePicture: user?.profilePicture,
    bio: user?.bio,
    gender: user?.gender,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput({ ...input, profilePicture: file });
    }
  };

  const selectChangeHandler = (value) => {
    setInput({ ...input, gender: value });
  };
  const editProfileHandler = async () => {
    const formData = new FormData();
    formData.append("bio", input.bio);
    formData.append("gender", input.gender);
    if (input.profilePicture) {
      formData.append("profilePicture", input.profilePicture);
    }
    try {
      setLoading(true);
      const res = await axios.patch(
        "http://localhost:8000/api/v1/user/profile/edit",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const updatedUserData = {
          ...user,
          bio: res.data.user?.bio,
          profilePicture: res.data.user?.profilePicture,
          gender: res.data.user?.gender,
        };
        dispatch(setAuthUser(updatedUserData));
        navigate(`/profile/${user?._id}`);
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

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
              <Input
                onChange={fileChangeHandler}
                ref={imgRef}
                type="file"
                className="hidden"
              />
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
            value={input.bio}
            name="bio"
            onChange={(e) => setInput({ ...input, bio: e.target.value })}
          />
        </div>

        {/* gender */}
        <div className="flex flex-col gap-3">
          <label className="font-bold text-sm">Gender</label>

          <Select
            defaultValue={input.gender}
            onValueChange={selectChangeHandler}
          >
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

        <div className="flex justify-end">
          {loading ? (
            <Button className="w-fit bg-[#0095F6] hover:bg-[#2a8ccd]">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait...
            </Button>
          ) : (
            <Button
              onClick={editProfileHandler}
              className="w-fit bg-[#0095F6] hover:bg-[#2a8ccd]"
            >
              Submit
            </Button>
          )}
        </div>
      </section>
    </div>
  );
};

export default EditProfile;
