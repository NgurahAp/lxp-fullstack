import React, { useState } from "react";
import {
  Search,
  UserPlus,
  FileText,
  CheckCircle,
  AlertCircle,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useGetStudents } from "../../../hooks/useStudents";
import LoadingSpinner from "../../../Components/LoadingSpinner";

const AdminStudentPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const { data, isLoading, error } = useGetStudents();

  if (isLoading) {
    return <LoadingSpinner text="Loading..." />;
  }

  if (error) {
    return (
      <div className="min-h-[85vh] w-screen flex items-center justify-center">
        Error loading data
      </div>
    );
  }

  // Filter students based on search term and status
  const filteredStudents =
    data?.data.students?.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        filterStatus === "all" || student.status === filterStatus;

      return matchesSearch && matchesStatus;
    }) || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "enrolled":
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Enrolled
          </span>
        );
      case "completed":
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Completed
          </span>
        );
      case "dropped":
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Dropped
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="mb-8 bg-white p-5 rounded-md shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-center mb-5">
          <h1 className="text-2xl font-bold text-gray-900">
            Student Management
          </h1>
          <Link
            to="/add-student"
            className="mt-4 md:mt-0 px-5 py-2.5 bg-gray-900 text-white rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors"
          >
            <UserPlus size={18} /> Add New Student
          </Link>
        </div>
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search students by name or email..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-auto flex gap-3">
            <select
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="enrolled">Enrolled</option>
              <option value="completed">Completed</option>
              <option value="dropped">Dropped</option>
            </select>
            <button className="px-5 py-2.5 border border-gray-900 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors">
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-md shadow-sm overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-800">
            Students ({filteredStudents.length})
          </h2>
          <div className="flex gap-2 text-sm">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>Enrolled</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>Dropped</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Courses
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pending
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Active
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User size={20} className="text-gray-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {student.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {student.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {student.enrolledCourses} Enrolled
                    </div>
                    <div className="text-sm text-gray-500">
                      {student.completedCourses} Completed
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {student.pendingAssignments > 0 ? (
                        <>
                          <AlertCircle
                            size={16}
                            className="text-amber-500 mr-1"
                          />
                          <span className="text-sm text-gray-900">
                            {student.pendingAssignments} items
                          </span>
                        </>
                      ) : (
                        <>
                          <CheckCircle
                            size={16}
                            className="text-green-500 mr-1"
                          />
                          <span className="text-sm text-gray-900">
                            All done
                          </span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(student.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(student.lastActive).toLocaleDateString()} at{" "}
                    {new Date(student.lastActive).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link
                        to={`/instructorStudent/submission`}
                        className="pr-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-xs flex items-center gap-1 hover:bg-gray-200 transition-colors"
                      >
                        <FileText size={14} />
                        <span>Submissions</span>
                      </Link>
                      {/* <Link
                        to={`/student/${student.id}`}
                        className="px-3 py-1.5 bg-gray-900 text-white rounded-md text-xs flex items-center gap-1 hover:bg-gray-800 transition-colors"
                      >
                        <span>View Profile</span>
                      </Link> */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-16">
            <User size={56} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-800">
              No students found
            </h3>
            <p className="text-gray-500 mt-2 max-w-md mx-auto">
              Try adjusting your search or filters, or add new students to get
              started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminStudentPage;
