import React from "react";
import { Bell, ChevronDown } from "lucide-react";

const TopNav: React.FC = () => {
  return (
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
  );
};

export default TopNav;
