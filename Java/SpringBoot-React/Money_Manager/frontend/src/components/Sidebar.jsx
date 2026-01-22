import { useContext } from "react";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { AppContext } from "../context/AppContext";
import { SIDE_BAR_DATA } from "../assets/assets";

const Sidebar = ({ activeMenu }) => {
  const { user } = useContext(AppContext);

  const navigate = useNavigate();

  return (
    <div className="w-64 h-[calc(100vh - 61px)] bg-white border-gray-200/50 p-5 sticky top-[61px] z-20">
      <div className="flex flex-col items-center justify-center gap-3 mt-3 mb-7">
        {user?.profileImageUrl ? (
          <img
            src={user?.profileImageUrl || ""}
            alt="Profile Image"
            className="w-20 h-20 bg-slate-400 rounded-full"
          />
        ) : (
          <User className="w-20 h-20 text-xl" />
        )}
        <h5 className="text-gray-950 font-medium leading-6">
          {user?.fullName || ""}
        </h5>
      </div>

      {SIDE_BAR_DATA.map((item, index) => (
        <button
          className={`w-full flex items-center gap-4 text-[15px] py-3 px-6 rounded-lg mb-3 cursor-pointer
            ${activeMenu == item.label ? "text-white bg-purple-800" : ""}`}
          key={`menu_${index}`}
          onClick={() => navigate(item.path)}
        >
          <item.icon className="text-xl" />
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default Sidebar;
