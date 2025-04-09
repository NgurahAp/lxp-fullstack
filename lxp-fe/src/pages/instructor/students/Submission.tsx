import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  User,
} from "lucide-react";
import { useGetDetailStudent } from "../../../hooks/useStudents";
import LoadingSpinner from "../../../Components/LoadingSpinner";
import QuizSubmissions, { ModuleSubmissions, TaskSubmissions } from "./components/studentSubmission";


const StudentSubmissionsPage: React.FC = () => {
  const { studentId } = useParams<{
    studentId: string;
  }>();
  const { data, isLoading, error } = useGetDetailStudent(studentId);
  const [activeTab, setActiveTab] = useState<"modules" | "quizzes" | "tasks">(
    "modules"
  );

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

  // Score updating function (would connect to API)
  const updateScore = (
    submissionId: string,
    submissionType: string,
    newScore: string
  ): void => {
    console.log(
      `Updating ${submissionType} submission ${submissionId} with score: ${newScore}`
    );
    // Would call API here to update the score
  };

  return (
    <div className="min-h-screen p-6">
      <div className="mb-6">
        <Link
          to="/admin/students"
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={18} className="mr-1" />
          <span>Back to Students</span>
        </Link>
      </div>

      <div className="mb-8 bg-white p-5 rounded-md shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <User size={24} className="text-gray-500" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">
              {data?.data.profile.name}
            </h1>
            <p className="text-gray-600">{data?.data.profile.email}</p>
            <div className="mt-1 flex items-center gap-3">
              {getStatusBadge(data?.data.profile.status)}
              <span className="text-sm text-gray-500">
                Last active:{" "}
                {data?.data.profile.lastActive ? (
                  <>
                    {new Date(
                      data.data.profile.lastActive
                    ).toLocaleDateString()}{" "}
                    at{" "}
                    {new Date(data.data.profile.lastActive).toLocaleTimeString(
                      [],
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </>
                ) : (
                  "Not available"
                )}
              </span>
            </div>
          </div>
          <div className="mt-4 md:mt-0 grid grid-cols-2 md:grid-cols-3 gap-3 text-center">
            <div className="bg-gray-50 px-4 py-2 rounded-lg">
              <div className="text-2xl font-semibold text-gray-900">
                {data?.data.profile.enrolledCourses}
              </div>
              <div className="text-xs text-gray-500">Enrolled Courses</div>
            </div>
            <div className="bg-gray-50 px-4 py-2 rounded-lg">
              <div className="text-2xl font-semibold text-gray-900">
                {data?.data.profile.completedCourses}
              </div>
              <div className="text-xs text-gray-500">Completed</div>
            </div>
            <div className="bg-gray-50 px-4 py-2 rounded-lg">
              <div className="text-2xl font-semibold text-gray-900">
                {data?.data.profile.pendingAssignments}
              </div>
              <div className="text-xs text-gray-500">Pending</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-md shadow-sm overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex flex-nowrap overflow-x-auto">
            <button
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === "modules"
                  ? "border-b-2 border-gray-900 text-gray-900"
                  : "text-gray-500 hover:text-gray-800"
              }`}
              onClick={() => setActiveTab("modules")}
            >
              Module Submissions
            </button>
            <button
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === "quizzes"
                  ? "border-b-2 border-gray-900 text-gray-900"
                  : "text-gray-500 hover:text-gray-800"
              }`}
              onClick={() => setActiveTab("quizzes")}
            >
              Quiz Submissions
            </button>
            <button
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === "tasks"
                  ? "border-b-2 border-gray-900 text-gray-900"
                  : "text-gray-500 hover:text-gray-800"
              }`}
              onClick={() => setActiveTab("tasks")}
            >
              Task Submissions
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "modules" && (
            <ModuleSubmissions
              modules={data?.data.modules || []}
              updateScore={updateScore}
            />
          )}
          {activeTab === "quizzes" && (
            <QuizSubmissions quizzes={data?.data.quizzes || []} />
          )}
          {activeTab === "tasks" && (
            <TaskSubmissions
              tasks={data?.data.tasks || []}
              updateScore={updateScore}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Helper function for status badges
const getStatusBadge = (status: string | undefined): React.ReactNode => {
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

export default StudentSubmissionsPage;
