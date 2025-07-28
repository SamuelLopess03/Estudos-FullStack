import { useNavigate } from "react-router-dom";

import { useUserData } from "../context/UserContext";

import PlayListCard from "./PlayListCard";

const Sidebar = () => {
  const { user } = useUserData();

  const navigate = useNavigate();

  return (
    <div className="w-[25%] h-full p-2 flex-col gap-2 text-white hidden lg:flex">
      <div className="bg-[#121212] h-[15%] rounded flex flex-col justify-around">
        <div
          className="flex items-center gap-3 pl-8 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src="/home.png" alt="" className="w-6" />
          <p className="font-bold">Home</p>
        </div>

        <div className="flex items-center gap-3 pl-8 cursor-pointer">
          <img src="/search.png" alt="" className="w-6" />
          <p className="font-bold">Search</p>
        </div>
      </div>

      <div className="bg-[#121212] h-[85%] rounded">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/stack.png" className="w-8" alt="" />
            <p className="font-semibold">Your Library</p>
          </div>

          <div className="flex items-center gap-3">
            <img src="/arrow.png" className="w-5" alt="" />
            <img src="/plus.png" className="w-5" alt="" />
          </div>
        </div>

        <div onClick={() => navigate("/playlist")} className="cursor-pointer">
          <PlayListCard />
        </div>

        <div className="p-4 m-2 bg-[#121212] rounded font-semibold flex flex-col items-start gap-1 pl-4 mt-4">
          <h1>Let's findsome podcasts to follow</h1>
          <p className="font-light">We'll keep you update on new episodes</p>
          <button className="px-4 py-1.5 bg-white text-black text-[15px] rounded-full mt-4">
            Browse Podcasts
          </button>
        </div>

        {user && user.role === "admin" && (
          <button
            className="px-4 py-1.5 bg-white text-black text-[15px] rounded-full mt-4 ml-5 cursor-pointer font-semibold"
            onClick={() => navigate("/admin/dashboard")}
          >
            Admin Dashboard
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
