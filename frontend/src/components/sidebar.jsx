import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const sidebarItems = [
  {
    icon: <Home />,
    text: "Home",
  },
  {
    icon: <Search />,
    text: "Search",
  },
  {
    icon: <TrendingUp />,
    text: "Explore",
  },
  {
    icon: <MessageCircle />,
    text: "Messages",
  },
  {
    icon: <Heart />,
    text: "Notification",
  },
  {
    icon: <PlusSquare />,
    text: "create",
  },
  {
    icon: (
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    ),
    text: "Profile",
  },
  {
    icon: <LogOut />,
    text: "Logout",
  },
];
const Sidebar = () => {
  return (
    <div className="fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen">
      <div className="flex flex-col">
        <h1></h1>
        {sidebarItems.map((item, index) => {
          return (
            <div key={index}>
              <span className="flex py-3 px-3 mx-2 cursor-pointer">
                {item.icon}
                {item.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
