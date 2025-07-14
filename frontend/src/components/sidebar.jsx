import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
  User,
} from "lucide-react";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlide";
import CreatePost from "./CreatePost";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const {user} = useSelector((store)=>store.auth);
  const dispatch = useDispatch();
  const[open,setOpen] = useState(false);

  const createPostHandler = (e) => {
    e.preventDefault(); // Prevent any default behavior
    setOpen(true); // Open the dialog
  }

  const logoutHandler = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const res = await axios.get("http://localhost:8000/api/v1/user/logout", {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAuthUser(null));
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    } finally {
      setIsLoading(false);
    }
  };

  const navItems = [
    {
      icon: <Home size={24} />,
      text: "Home",
      link: "/",
      type: "link"
    },
    {
      icon: <Search size={24} />,
      text: "Search",
      link: "/search",
      type: "link"
    },
    {
      icon: <TrendingUp size={24} />,
      text: "Explore",
      link: "/explore",
      type: "link"
    },
    {
      icon: <MessageCircle size={24} />,
      text: "Messages",
      link: "/messages",
      type: "link"
    },
    {
      icon: <Heart size={24} />,
      text: "Notifications",
      link: "/notifications",
      type: "link"
    },
    {
      icon: <PlusSquare size={24} />,
      text: "Create",
      onClick: createPostHandler,
      type: "button" // This is a button, not a link
    },
    {
      icon: (
        <Avatar className="w-6 h-6">
          <AvatarImage src={user?.profilePicture} className='w-6 h-6' alt="profilepic" />
          <AvatarFallback>
            <User size={16} />
          </AvatarFallback>
        </Avatar>
      ),
      text: user?.username || "Profile",
      link: "/profile",
      type: "link"
    },
  ];

  const isActiveLink = (link) => {
    if (link === "/" && location.pathname === "/") return true;
    if (link !== "/" && location.pathname.startsWith(link)) return true;
    return false;
  };

  // Shared base classes for both links and buttons
  const getBaseClasses = (item) => {
    return `group flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 w-full ${
      item.type === "link" && isActiveLink(item.link)
        ? "bg-gradient-to-r from-purple-50 to-pink-50 text-purple-600 shadow-sm"
        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
    }`;
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col bg-white border-r border-gray-200 h-screen fixed top-0 left-0 z-30 transition-all duration-300 ease-in-out w-16 lg:w-64 shadow-sm">
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-center lg:justify-start">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center lg:mr-3">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 hidden lg:block">
              Sociogram
            </h1>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-6 space-y-2">
          {navItems.map((item, index) => {
            const baseClasses = getBaseClasses(item);

            if (item.type === "link") {
              return (
                <Link
                  key={index}
                  to={item.link}
                  className={baseClasses}
                >
                  <span
                    className={`flex-shrink-0 transition-colors duration-200 ${
                      isActiveLink(item.link) ? "text-purple-600" : "text-gray-500"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="ml-3 hidden lg:block truncate">
                    {item.text}
                  </span>
                  {isActiveLink(item.link) && (
                    <div className="ml-auto w-2 h-2 bg-purple-600 rounded-full hidden lg:block" />
                  )}
                </Link>
              );
            } else {
              // For button items like "Create" - now has consistent spacing
              return (
                <button
                  key={index}
                  onClick={item.onClick}
                  className={baseClasses}
                >
                  <span className="flex-shrink-0 text-gray-500 transition-colors duration-200 group-hover:text-gray-900">
                    {item.icon}
                  </span>
                  <span className="ml-3 hidden lg:block truncate">
                    {item.text}
                  </span>
                </button>
              );
            }
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-3 border-t border-gray-100">
          <button
            onClick={logoutHandler}
            disabled={isLoading}
            className="group w-full flex items-center px-3 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="flex-shrink-0 text-gray-500 group-hover:text-red-600 transition-colors duration-200">
              <LogOut size={24} />
            </span>
            <span className="ml-3 hidden lg:block">
              {isLoading ? "Logging out..." : "Logout"}
            </span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-30 px-2 py-2 shadow-lg">
        <div className="flex justify-around items-center max-w-md mx-auto">
          {navItems.slice(0, 5).map((item, index) => {
            const baseClasses = `flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 ${
              item.type === "link" && isActiveLink(item.link)
                ? "text-purple-600"
                : "text-gray-500 hover:text-gray-700"
            }`;

            if (item.type === "link") {
              return (
                <Link
                  key={index}
                  to={item.link}
                  className={baseClasses}
                >
                  <span className="mb-1 scale-90">{item.icon}</span>
                  <span className="text-xs font-medium leading-none">
                    {item.text}
                  </span>
                  {isActiveLink(item.link) && (
                    <div className="absolute -top-1 w-1 h-1 bg-purple-600 rounded-full" />
                  )}
                </Link>
              );
            } else {
              return (
                <button
                  key={index}
                  onClick={item.onClick}
                  className={baseClasses}
                >
                  <span className="mb-1 scale-90">{item.icon}</span>
                  <span className="text-xs font-medium leading-none">
                    {item.text}
                  </span>
                </button>
              );
            }
          })}
          
          {/* Mobile Profile Menu */}
          <Link
            to="/profile"
            className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 ${
              isActiveLink("/profile")
                ? "text-purple-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <span className="mb-1 scale-90">
              <Avatar className="w-6 h-6">
                <AvatarImage src={user?.profilePicture} className='w-6 h-6' alt="profilepic" />
                <AvatarFallback>
                  <User size={14} />
                </AvatarFallback>
              </Avatar>
            </span>
            <span className="text-xs font-medium leading-none">Profile</span>
            {isActiveLink("/profile") && (
              <div className="absolute -top-1 w-1 h-1 bg-purple-600 rounded-full" />
            )}
          </Link>
        </div>
      </nav>

      {/* Mobile spacing for bottom nav */}
      <div className="h-16 md:hidden" />

      {/* CreatePost Dialog - This will show when open=true */}
      <CreatePost open={open} setOpen={setOpen} />
    </>
  );
};

export default Sidebar;