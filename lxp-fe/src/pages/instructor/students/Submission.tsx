import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  User,
  FileText,
  HelpCircle,
  CheckCircle,
  Clock,
  BookOpen,
  Award,
  Calendar,
} from "lucide-react";
import { useGetDetailStudent } from "../../../hooks/useStudents";
import LoadingSpinner from "../../../Components/LoadingSpinner";

// Define parameters type for useParams

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

  console.log(data);

  // Dummy student data

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

  // Component for module submissions
  const ModuleSubmissions: React.FC = () => {
    const [editingScoreId, setEditingScoreId] = useState<string | null>(null);
    const [newScore, setNewScore] = useState<string>("");

    const handleSaveScore = (submissionId: string): void => {
      if (
        newScore !== "" &&
        !isNaN(Number(newScore)) &&
        Number(newScore) >= 0 &&
        Number(newScore) <= 100
      ) {
        updateScore(submissionId, "module", newScore);
        setEditingScoreId(null);
        setNewScore("");
      }
    };

    return (
      <div className="space-y-6">
        {data?.data.modules.map((submission) => (
          <div
            key={submission.id}
            className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm"
          >
            <div className="flex flex-col md:flex-row justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {submission.moduleTitle}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                  <BookOpen size={16} />
                  <span className="truncate w-72">
                    {submission.trainingTitle}
                  </span>
                  <span className="text-gray-400">|</span>
                  <Calendar size={16} />
                  <span className="truncate w-72">
                    {submission.moduleTitle}
                  </span>
                </div>
              </div>
              <div className="mt-3 md:mt-0 flex items-center">
                {submission.score != 0 ? (
                  <div className="flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    <CheckCircle size={16} />
                    <span>Scored: {submission.score}/100</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm">
                    <Clock size={16} />
                    <span>Pending Review</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg my-3">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Student's Answer:
              </h4>
              {submission.answer ? (
                <p className="text-gray-800">{submission.answer}</p>
              ) : (
                <p className="text-gray-500 italic">
                  Student hasn't submitted an answer yet.
                </p>
              )}
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center pt-3 border-t border-gray-100">
              <div className="text-sm text-gray-500">
                Submitted on{" "}
                {new Date(submission.updatedAt).toLocaleDateString()} at{" "}
                {new Date(submission.updatedAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>

              <div className="mt-3 md:mt-0 flex items-center gap-2">
                {editingScoreId === submission.id ? (
                  <>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={newScore}
                      onChange={(e) => setNewScore(e.target.value)}
                      className="w-16 px-2 py-1 border border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-500">/ 100</span>
                    <button
                      onClick={() => handleSaveScore(submission.id)}
                      className="ml-2 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingScoreId(null)}
                      className="px-3 py-1 border border-gray-300 text-gray-600 text-sm rounded hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setEditingScoreId(submission.id);
                      setNewScore(submission.score?.toString() || "");
                    }}
                    className="px-4 py-1.5 bg-gray-900 text-white text-sm rounded hover:bg-gray-800"
                  >
                    {submission.score != 0
                      ? "Update Score"
                      : "Grade Submission"}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {data?.data.modules.length === 0 && (
          <div className="text-center py-10 bg-white rounded-lg border border-gray-200">
            <FileText size={48} className="mx-auto text-gray-300 mb-3" />
            <h3 className="text-lg font-medium text-gray-800">
              No module submissions
            </h3>
            <p className="text-gray-500 mt-1">
              This student hasn't submitted any module assignments yet.
            </p>
          </div>
        )}
      </div>
    );
  };

  // Component for quiz submissions
  const QuizSubmissions: React.FC = () => {
    return (
      <div className="space-y-6">
        {data?.data.quizzes.map((submission) => (
          <div
            key={submission.id}
            className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm"
          >
            <div className="flex flex-col md:flex-row justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {submission.quizTitle}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                  <BookOpen size={16} />
                  <span className="truncate w-72">
                    {submission.trainingTitle}
                  </span>
                  <span className="text-gray-400">|</span>
                  <Calendar size={16} />
                  <span className="truncate w-72">
                    {submission.meetingTitle}
                  </span>
                </div>
              </div>
              <div className="mt-3 md:mt-0">
                <div className="flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  <Award size={16} />
                  <span>Score: {submission.score}/100</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center pt-3 border-t border-gray-100">
              <div className="text-sm text-gray-500">
                Submitted on{" "}
                {new Date(submission.updatedAt).toLocaleDateString()} at{" "}
                {new Date(submission.updatedAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>

              <div className="mt-3 md:mt-0">
                <Link
                  to={`/quiz-details/${submission.id}`}
                  className="px-4 py-1.5 bg-gray-100 text-gray-800 text-sm rounded hover:bg-gray-200"
                >
                  View Quiz Details
                </Link>
              </div>
            </div>
          </div>
        ))}

        {data?.data.quizzes.length === 0 && (
          <div className="text-center py-10 bg-white rounded-lg border border-gray-200">
            <HelpCircle size={48} className="mx-auto text-gray-300 mb-3" />
            <h3 className="text-lg font-medium text-gray-800">
              No quiz submissions
            </h3>
            <p className="text-gray-500 mt-1">
              This student hasn't submitted any quizzes yet.
            </p>
          </div>
        )}
      </div>
    );
  };

  // Component for task submissions
  const TaskSubmissions: React.FC = () => {
    const [editingScoreId, setEditingScoreId] = useState<string | null>(null);
    const [newScore, setNewScore] = useState<string>("");

    const handleSaveScore = (submissionId: string): void => {
      if (
        newScore !== "" &&
        !isNaN(Number(newScore)) &&
        Number(newScore) >= 0 &&
        Number(newScore) <= 100
      ) {
        updateScore(submissionId, "task", newScore);
        setEditingScoreId(null);
        setNewScore("");
      }
    };

    return (
      <div className="space-y-6">
        {data?.data.tasks.map((submission) => (
          <div
            key={submission.id}
            className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm"
          >
            <div className="flex flex-col md:flex-row justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {submission.taskTitle}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                  <BookOpen size={16} />
                  <span className="truncate w-72">
                    {submission.trainingTitle}
                  </span>
                  <span className="text-gray-400">|</span>
                  <Calendar size={16} />
                  <span className="truncate w-72">
                    {submission.meetingTitle}
                  </span>
                </div>
              </div>
              <div className="mt-3 md:mt-0 flex items-center">
                {submission.score != 0 ? (
                  <div className="flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    <CheckCircle size={16} />
                    <span>Scored: {submission.score}/100</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm">
                    <Clock size={16} />
                    <span>Pending Review</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg my-3">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Student's Answer:
              </h4>
              {submission.answer ? (
                <p className="text-gray-800">{submission.answer}</p>
              ) : (
                <p className="text-gray-500 italic">
                  Student hasn't submitted an answer yet.
                </p>
              )}
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center pt-3 border-t border-gray-100">
              <div className="text-sm text-gray-500">
                Submitted on{" "}
                {new Date(submission.updatedAt).toLocaleDateString()} at{" "}
                {new Date(submission.updatedAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>

              <div className="mt-3 md:mt-0 flex items-center gap-2">
                {editingScoreId === submission.id ? (
                  <>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={newScore}
                      onChange={(e) => setNewScore(e.target.value)}
                      className="w-16 px-2 py-1 border border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-500">/ 100</span>
                    <button
                      onClick={() => handleSaveScore(submission.id)}
                      className="ml-2 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingScoreId(null)}
                      className="px-3 py-1 border border-gray-300 text-gray-600 text-sm rounded hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setEditingScoreId(submission.id);
                      setNewScore(submission.score?.toString() || "");
                    }}
                    className="px-4 py-1.5 bg-gray-900 text-white text-sm rounded hover:bg-gray-800"
                  >
                    {submission.score != 0
                      ? "Update Score"
                      : "Grade Submission"}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {data?.data.tasks.length === 0 && (
          <div className="text-center py-10 bg-white rounded-lg border border-gray-200">
            <FileText size={48} className="mx-auto text-gray-300 mb-3" />
            <h3 className="text-lg font-medium text-gray-800">
              No task submissions
            </h3>
            <p className="text-gray-500 mt-1">
              This student hasn't submitted any tasks yet.
            </p>
          </div>
        )}
      </div>
    );
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
          {activeTab === "modules" && <ModuleSubmissions />}
          {activeTab === "quizzes" && <QuizSubmissions />}
          {activeTab === "tasks" && <TaskSubmissions />}
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
