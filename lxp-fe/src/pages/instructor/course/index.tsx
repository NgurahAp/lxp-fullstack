import React, { useState } from "react";
import {
  PlusCircle,
  Search,
  Book,
  Users,
  Calendar,
  Filter,
} from "lucide-react";

// Mock data for courses
const coursesData = [
  {
    id: "1",
    title: "Professional Debt Collection Skill",
    description:
      "Learn advanced techniques for debt collection management and communication strategies.",
    image: "/api/placeholder/400/200",
    instructor: "Tirta S.Kom",
    createdAt: "2025-01-15T08:30:00Z",
    updatedAt: "2025-03-10T14:45:00Z",
    totalStudents: 12,
    totalMeetings: 6,
    status: "active",
  },
  {
    id: "2",
    title:
      "Level Up Pencegahan dan Deteksi Dini Terhadap Potensi Fraud Untuk Pegawai RBC",
    description:
      "Training untuk meningkatkan kesadaran dan kemampuan mendeteksi fraud pada tahap awal.",
    image: "/api/placeholder/400/200",
    instructor: "Tirta S.Kom",
    createdAt: "2025-02-05T10:15:00Z",
    updatedAt: "2025-03-05T09:30:00Z",
    totalStudents: 8,
    totalMeetings: 4,
    status: "active",
  },
  {
    id: "3",
    title: "Risk Management Fundamentals",
    description:
      "Comprehensive course covering risk identification, assessment, and mitigation strategies.",
    image: "/api/placeholder/400/200",
    instructor: "Tirta S.Kom",
    createdAt: "2024-11-10T13:45:00Z",
    updatedAt: "2025-02-20T11:20:00Z",
    totalStudents: 15,
    totalMeetings: 8,
    status: "completed",
  },
  {
    id: "4",
    title: "Financial Analysis for Banking Professionals",
    description:
      "Deep dive into financial statement analysis and credit assessment techniques.",
    image: "/api/placeholder/400/200",
    instructor: "Tirta S.Kom",
    createdAt: "2024-12-01T09:00:00Z",
    updatedAt: "2025-01-25T16:40:00Z",
    totalStudents: 10,
    totalMeetings: 5,
    status: "draft",
  },
];

const CoursePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter courses based on search term and status
  const filteredCourses = coursesData.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || course.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Status badge style helper
  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-500";
      case "completed":
        return "bg-gray-900";
      case "draft":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Your Courses</h1>
        <button className="mt-4 md:mt-0 px-5 py-2.5 bg-gray-900 text-white rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors">
          <PlusCircle size={18} /> Create New Course
        </button>
      </div>

      {/* Filters */}
      <div className="mb-8 bg-white p-5 rounded-xl shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search courses..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative md:w-48">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="w-full flex items-center justify-between px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none hover:border-gray-300"
            >
              <span className="flex items-center gap-2">
                <Filter size={16} className="text-gray-500" />
                {statusFilter === "all"
                  ? "All Status"
                  : statusFilter.charAt(0).toUpperCase() +
                    statusFilter.slice(1)}
              </span>
            </button>

            {isFilterOpen && (
              <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setStatusFilter("all");
                    setIsFilterOpen(false);
                  }}
                >
                  All Status
                </div>
                <div
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setStatusFilter("active");
                    setIsFilterOpen(false);
                  }}
                >
                  Active
                </div>
                <div
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setStatusFilter("completed");
                    setIsFilterOpen(false);
                  }}
                >
                  Completed
                </div>
                <div
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setStatusFilter("draft");
                    setIsFilterOpen(false);
                  }}
                >
                  Draft
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
          >
            {/* Course Image */}
            <div className="h-48 bg-gray-200 relative">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-full object-cover"
              />
              <div
                className={`absolute top-3 right-3 px-3 py-1 text-xs font-medium rounded-full text-white ${getStatusBadgeStyle(
                  course.status
                )}`}
              >
                {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
              </div>
            </div>

            {/* Course Info */}
            <div className="p-5">
              <h2 className="font-semibold text-lg text-gray-900 line-clamp-2 h-14">
                {course.title}
              </h2>
              <p className="text-sm text-gray-600 mt-3 line-clamp-2 h-10">
                {course.description}
              </p>

              <div className="flex items-center justify-between mt-5 text-sm text-gray-500">
                <div className="flex items-center gap-1.5">
                  <Users size={16} className="text-gray-400" />
                  <span>{course.totalStudents} students</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar size={16} className="text-gray-400" />
                  <span>{course.totalMeetings} meetings</span>
                </div>
              </div>

              <div className="mt-4 text-xs text-gray-500">
                Last updated: {new Date(course.updatedAt).toLocaleDateString()}
              </div>

              {/* Action Buttons */}
              <div className="mt-5 grid grid-cols-2 gap-3">
                <button className="px-4 py-2 border border-gray-900 text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                  View
                </button>
                <button className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCourses.length === 0 && (
        <div className="text-center py-16 px-6 bg-white rounded-xl shadow-sm">
          <Book size={56} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-medium text-gray-800">
            No courses found
          </h3>
          <p className="text-gray-500 mt-2 max-w-md mx-auto">
            Try adjusting your search or filters, or create a new course to get
            started.
          </p>
          <button className="mt-6 px-5 py-2.5 bg-gray-900 text-white rounded-lg flex items-center gap-2 mx-auto hover:bg-gray-800 transition-colors">
            <PlusCircle size={18} /> Create New Course
          </button>
        </div>
      )}
    </div>
  );
};

export default CoursePage;
