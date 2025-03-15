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

// Definisi tipe data
interface Course {
  id: number;
  title: string;
  students: number;
  progress: number;
}

interface DashboardData {
  courses: number;
  activeStudents: number;
  pendingAssignments: number;
  completionRate: number;
  recentCourses: Course[];
}

// Props untuk komponen helper
interface NavItemProps {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
  collapsed?: boolean;
}

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  bgColor: string;
}

const InstructorDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  // Data contoh untuk dashboard
  const dashboardData: DashboardData = {
    courses: 5,
    activeStudents: 243,
    pendingAssignments: 12,
    completionRate: 78,
    recentCourses: [
      { id: 1, title: "Dasar Pemrograman Web", students: 56, progress: 75 },
      {
        id: 2,
        title: "React dan TypeScript Fundamental",
        students: 48,
        progress: 60,
      },
      { id: 3, title: "UI/UX Design Principles", students: 35, progress: 90 },
    ],
  };

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
            active={true}
            collapsed={!sidebarOpen}
          />
          <NavItem
            icon={<BookOpen size={20} />}
            text="Courses"
            collapsed={!sidebarOpen}
          />
          <NavItem
            icon={<Users size={20} />}
            text="Students"
            collapsed={!sidebarOpen}
          />
          <NavItem
            icon={<Settings size={20} />}
            text="Settings"
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
        <main className="flex-1 overflow-y-auto p-4">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome back, Arya!
            </h1>
            <p className="text-gray-600">
              Here's an overview of your teaching activity
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-6">
            <StatsCard
              title="Total Courses"
              value={dashboardData.courses}
              icon={<BookOpen className="text-blue-600" />}
              bgColor="bg-blue-100"
            />
            <StatsCard
              title="Active Students"
              value={dashboardData.activeStudents}
              icon={<Users className="text-green-600" />}
              bgColor="bg-green-100"
            />
          </div>

          {/* Recent Courses */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">Your Courses</h2>
              <button className="text-sm text-blue-600 hover:text-blue-800">
                Edit Courses
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Students
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dashboardData.recentCourses.map((course) => (
                    <tr key={course.id}>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {course.title}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {course.students} students
                        </div>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <button className="text-blue-600 hover:text-blue-800 mr-2">
                          Edit
                        </button>
                        <button className="text-gray-600 hover:text-gray-800">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// Helper Components dengan tipe data
const NavItem: React.FC<NavItemProps> = ({
  icon,
  text,
  active = false,
  collapsed = false,
}) => {
  return (
    <div
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

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  bgColor,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 flex items-center">
      <div className={`${bgColor} p-3 rounded-lg`}>{icon}</div>
      <div className="ml-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <div className="text-2xl font-bold">{value}</div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
