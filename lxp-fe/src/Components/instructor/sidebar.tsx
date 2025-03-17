import React from "react";
import { Users, BookOpen, Home, Settings, Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface SidebarProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, toggleSidebar }) => {
  const location = useLocation();

  return (
    <div
      className={`${
        sidebarOpen ? "w-64" : "w-20"
      } bg-gray-900 text-white transition-all duration-300 ease-in-out flex flex-col`}
    >
      <div className="p-4 flex items-center justify-between">
        {sidebarOpen && <h1 className="text-xl font-bold">LXP M-Knows</h1>}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-800"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div className="flex-1 py-4">
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
          path="/instructor/courses"
          active={location.pathname.includes("/instructor/courses")}
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
      className={`px-4 py-3 flex items-center ${
        active
          ? "bg-gray-800 text-white"
          : "text-gray-400 hover:bg-gray-800 hover:text-white"
      } transition-colors duration-200 cursor-pointer ${
        collapsed ? "justify-center" : ""
      }`}
    >
      <div>{icon}</div>
      {!collapsed && <div className="ml-3">{text}</div>}
    </div>
  );
};

export default Sidebar;
