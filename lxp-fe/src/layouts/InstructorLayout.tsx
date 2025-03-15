// Create a new file: src/layouts/InstructorLayout.tsx
import React, { useState } from "react";
import {
  Users,
  BookOpen,
  Home,
  Menu,
  X,
  Bell,
  Settings,
  ChevronDown,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface InstructorLayoutProps {
  children: React.ReactNode;
}

// Props for helper components
interface NavItemProps {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
  collapsed?: boolean;
  path: string;
}

const InstructorLayout: React.FC<InstructorLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-gray-900 text-white transition-all duration-300 ease-in-out flex flex-col`}
      >
        {/* Logo */}
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-xl font-bold">LXP M-Knows</h1>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-800"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Menu Items */}
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

        {/* User Profile */}
        <div
          className={`p-4 border-t border-gray-800 ${
            sidebarOpen ? "flex items-center" : "flex flex-col items-center"
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold">
            DI
          </div>
          {sidebarOpen && (
            <div className="ml-3">
              <div className="font-medium">Dosen Instructor</div>
              <div className="text-xs text-gray-400">instructor@edu.com</div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm">
          <div className="px-4 py-3 flex items-center justify-between">
            <h2 className="text-lg font-medium">Dashboard Instructor</h2>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-gray-200">
                <Bell size={20} />
              </button>
              <button className="flex items-center space-x-1 text-sm hover:bg-gray-200 p-2 rounded">
                <span>Dosen Instructor</span>
                <ChevronDown size={16} />
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>
    </div>
  );
};

// Helper Components with types
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

export default InstructorLayout;
