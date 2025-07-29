import { Grid, PlayCircle, Bookmark, SquareUser } from "lucide-react";

const ProfileIconBar = ({ tabChangeFun, activeTab }) => {
  const iconStyle = (tabName) =>
    `group flex flex-col items-center relative cursor-pointer transition-colors ${
      activeTab === tabName ? "text-black font-semibold" : "text-gray-500"
    }`;

  return (
    <div className="border-t border-gray-300 mt-10 pt-4">
      <div className="flex items-center justify-center gap-20 sm:gap-28 md:gap-40 text-sm relative">

        {/* posts */}
        <div className={iconStyle("posts")} onClick={() => tabChangeFun("posts")}>
          <Grid size={24} />
          <span className="absolute top-[30px] text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Posts
          </span>
        </div>

        {/* reels */}
        <div className={iconStyle("reels")} onClick={() => tabChangeFun("reels")}>
          <PlayCircle size={24} />
          <span className="absolute top-[30px] text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Reels
          </span>
        </div>

        {/* saved */}
        <div className={iconStyle("bookmarks")} onClick={() => tabChangeFun("bookmarks")}>
          <Bookmark size={24} />
          <span className="absolute top-[30px] text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Saved
          </span>
        </div>

        {/* tagged */}
        <div className={iconStyle("tagged")} onClick={() => tabChangeFun("tagged")}>
          <SquareUser size={24} />
          <span className="absolute top-[30px] text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Tagged
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfileIconBar;
