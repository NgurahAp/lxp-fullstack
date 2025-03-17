import React, { useState } from "react";
import { PlusCircle, Search, Book, Users, Calendar } from "lucide-react";

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

  // Filter courses based on search term and status
  const filteredCourses = coursesData.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || course.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Courses</h1>
        <button className="mt-4 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded flex items-center gap-2 hover:bg-blue-700">
          <PlusCircle size={16} /> Create New Course
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search courses..."
            className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="md:w-48">
          <select
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Course Image */}
            <div className="h-40 bg-gray-200 relative">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-full object-cover"
              />
              <div
                className={`absolute top-2 right-2 px-2 py-1 text-xs rounded text-white ${
                  course.status === "active"
                    ? "bg-green-500"
                    : course.status === "completed"
                    ? "bg-blue-500"
                    : "bg-gray-500"
                }`}
              >
                {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
              </div>
            </div>

            {/* Course Info */}
            <div className="p-4">
              <h2 className="font-semibold text-lg line-clamp-2 h-14">
                {course.title}
              </h2>
              <p className="text-sm text-gray-600 mt-2 line-clamp-2 h-10">
                {course.description}
              </p>

              <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Users size={14} />
                  <span>{course.totalStudents} students</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>{course.totalMeetings} meetings</span>
                </div>
              </div>

              <div className="mt-4 text-xs text-gray-500">
                Last updated: {new Date(course.updatedAt).toLocaleDateString()}
              </div>

              {/* Action Buttons */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button className="px-3 py-1.5 border border-blue-600 text-blue-600 rounded text-sm hover:bg-blue-50">
                  View
                </button>
                <button className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCourses.length === 0 && (
        <div className="text-center py-12 border rounded-lg bg-gray-50">
          <Book size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-600">
            No courses found
          </h3>
          <p className="text-gray-500 mt-1">
            Try adjusting your search or filters
          </p>
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded flex items-center gap-2 mx-auto hover:bg-blue-700">
            <PlusCircle size={16} /> Create New Course
          </button>
        </div>
      )}
    </div>
  );
};

export default CoursePage;
