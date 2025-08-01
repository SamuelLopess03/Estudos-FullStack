import { FaMusic } from "react-icons/fa";

import { useUserData } from "../context/UserContext";

const PlayListCard = () => {
  const { user, isAuth } = useUserData();

  return (
    <div className="flex items-center p-4 rounded-lg shadow-md cursor-pointer hover:bg-[#ffffff26]">
      <div className="w-10 h-10 bg-gray-600 flex items-center justify-center rounded-md">
        <FaMusic className="text-white text-xl" />
      </div>
      <div className="ml-4">
        <h2>My Playlist</h2>
        <p className="text-gray-400 text-sm">
          Playlist •{" "}
          {isAuth ? <span>{user?.name}</span> : <span>{"User"}</span>}
        </p>
      </div>
    </div>
  );
};

export default PlayListCard;
