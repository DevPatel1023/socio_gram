import React from "react";
import Feed from "./Feed.jsx";
import { Outlet } from "react-router-dom";
import RightSideBar from "./RightSideBar.jsx";
import useGetAllPost from "@/hooks/useGetAllPost.jsx";

const Home = () => {
  useGetAllPost();
  return (
    <div className="flex">
      <div className="flex-grow">
        <Feed />
        <Outlet />
      </div>
      <RightSideBar />
    </div>
  );
};

export default Home;
