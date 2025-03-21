import React, { useEffect, useState } from "react";
import { Users, BookOpen, Home, Settings, Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserData } from "../../types/auth";

interface SidebarProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, toggleSidebar }) => {
  const location = useLocation();
  const [profileData, setProfileData] = useState<UserData | null>(null);

  useEffect(() => {
    const getUserProfile = () => {
      try {
        const storedUser = localStorage.getItem("user_data");
        if (storedUser) {
          const userData: UserData = JSON.parse(storedUser);
          setProfileData(userData);
        } else {
          console.log("Data profil tidak ditemukan di localStorage");
        }
      } catch (error) {
        console.error("Error parsing user profile:", error);
      }
    };

    getUserProfile();
  }, []);

  return (
    <div
      className={`${
        sidebarOpen ? "w-64" : "w-20"
      } bg-gray-900 text-white transition-all duration-300 ease-in-out flex flex-col`}
    >
      <div className="p-4 flex items-center justify-between">
        {sidebarOpen && (
          <h1 className="text-xl font-bold line-clamp-1">LXP M-Knows</h1>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-800"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div className="flex-1 py-4 ">
        <NavItem
          icon={<Home size={20} />}
          text="Dashboard"
          path="/instructorDashboard"
          active={location.pathname === "/instructorDashboard"}
          collapsed={!sidebarOpen}
        />
        <NavItem
          icon={<BookOpen size={20} />}
          text="Courses"
          path="/instructorCourse"
          active={
            location.pathname.includes("/instructorCourse") ||
            location.pathname.includes("/detailCourse")
          }
          collapsed={!sidebarOpen}
        />
        <NavItem
          icon={<Users size={20} />}
          text="Students"
          path="/instructor/students"
          active={location.pathname.includes("/instructor/students")}
          collapsed={!sidebarOpen}
        />
        <NavItem
          icon={<Settings size={20} />}
          text="Settings"
          path="/instructor/settings"
          active={location.pathname.includes("/instructor/settings")}
          collapsed={!sidebarOpen}
        />
      </div>
      {/* User Profile */}
      <div
        className={`p-4 border-t border-gray-800 ${
          sidebarOpen ? "flex items-center" : "flex flex-col items-center"
        }`}
      >
        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold">
          {profileData?.avatar ? (
            <img
              src={profileData.avatar}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center  rounded-full ">
              {profileData?.name
                ? profileData.name
                    .split(" ")
                    .slice(0, 2) // Ambil maksimal 2 kata pertama
                    .map((word) => word[0]) // Ambil huruf pertama setiap kata
                    .join("")
                    .toUpperCase() // Ubah ke huruf besar
                : "?"}
            </div>
          )}
        </div>
        {sidebarOpen && (
          <div className="ml-3">
            <div className="font-medium">{profileData?.name}</div>
            <div className="text-xs text-gray-400">{profileData?.email}</div>
          </div>
        )}
      </div>
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
  collapsed?: boolean;
  path: string;
}

const NavItem: React.FC<NavItemProps> = ({
  icon,
  text,
  active = false,
  collapsed = false,
  path,
}) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(path)}
      className={`px-4 pl-6 py-3 flex items-center ${
        active
          ? "bg-gray-800 text-white"
          : "text-gray-400 hover:bg-gray-800 hover:text-white"
      } transition-colors duration-200 cursor-pointer`}
    >
      <div className="w-6 flex items-center justify-center">{icon}</div>
      {!collapsed && <div className="ml-3">{text}</div>}
    </div>
  );
};

export default Sidebar;
