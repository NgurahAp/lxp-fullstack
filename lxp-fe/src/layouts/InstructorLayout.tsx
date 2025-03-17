import React, { useState } from "react";
import Sidebar from "../Components/instructor/sidebar";
import TopNav from "../Components/instructor/Nav";

interface InstructorLayoutProps {
  children: React.ReactNode;
}

const InstructorLayout: React.FC<InstructorLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        sidebarOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>
    </div>
  );
};

export default InstructorLayout;
