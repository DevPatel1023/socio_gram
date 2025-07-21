import React from "react";
import Feed from "./Feed.jsx";
import { Outlet } from "react-router-dom";
import RightSideBar from "./RightSideBar.jsx";
import useGetAllPost from "@/hooks/useGetAllPost.js";
import useSuggestedUsers from "@/hooks/useGetSuggestedUsers.js";

const Home = () => {
  useGetAllPost();
  useSuggestedUsers();
  return (
    <div className="flex w-full mx-auto max-w-7xl">

        <div className="flex-1 min-w-0 px-4">
        <Feed />
        <Outlet />
        </div>

      <div className="hidden xl:block w-72 shrink-0 pl-4">
      <RightSideBar />
      </div>
    </div>
  );
};

export default Home;
