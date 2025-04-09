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

// Define TypeScript interfaces for our data structures
interface Student {
  id: string;
  name: string;
  email: string;
  enrolledCourses: number;
  completedCourses: number;
  pendingAssignments: number;
  status: "enrolled" | "completed" | "dropped";
  lastActive: string;
}

interface BaseSubmission {
  id: string;
  trainingName: string;
  submittedOn: string;
  score: number | null;
  maxScore: number;
  status: "scored" | "pending";
  meetingTitle: string;
}

interface ModuleSubmission extends BaseSubmission {
  moduleId: string;
  moduleName: string;
  answer: string;
}

interface QuizSubmission extends BaseSubmission {
  quizId: string;
  quizName: string;
}

interface TaskSubmission extends BaseSubmission {
  taskId: string;
  taskName: string;
  answer: string;
}

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
  const student: Student = {
    id: "",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    enrolledCourses: 3,
    completedCourses: 1,
    pendingAssignments: 4,
    status: "enrolled",
    lastActive: "2025-04-01T14:30:00",
  };

  // Dummy submission data
  const moduleSubmissions: ModuleSubmission[] = [
    {
      id: "ms1",
      moduleId: "m1",
      moduleName: "Introduction to React",
      trainingName: "Web Development Fundamentals",
      submittedOn: "2025-03-28T15:30:00",
      answer:
        "React is a JavaScript library for building user interfaces. It's declarative, efficient, and flexible. React lets you compose complex UIs from small and isolated pieces of code called 'components'.",
      score: 85,
      maxScore: 100,
      status: "scored",
      meetingTitle: "Frontend Basics",
    },
    {
      id: "ms2",
      moduleId: "m2",
      moduleName: "State Management",
      trainingName: "Web Development Fundamentals",
      submittedOn: "2025-03-29T09:15:00",
      answer:
        "State management in React can be handled using useState hooks, Context API, or external libraries like Redux. The choice depends on the complexity of your application and the state-sharing requirements.",
      score: null,
      maxScore: 100,
      status: "pending",
      meetingTitle: "Advanced Concepts",
    },
    {
      id: "ms3",
      moduleId: "m3",
      moduleName: "Database Design",
      trainingName: "Backend Development",
      submittedOn: "2025-03-30T16:45:00",
      answer:
        "Database normalization is the process of structuring a relational database in accordance with a series of normal forms in order to reduce data redundancy and improve data integrity.",
      score: 92,
      maxScore: 100,
      status: "scored",
      meetingTitle: "Database Foundations",
    },
  ];

  const quizSubmissions: QuizSubmission[] = [
    {
      id: "qs1",
      quizId: "q1",
      quizName: "React Fundamentals Quiz",
      trainingName: "Web Development Fundamentals",
      submittedOn: "2025-03-28T16:20:00",
      score: 8,
      maxScore: 10,
      status: "scored",
      meetingTitle: "Frontend Basics",
    },
    {
      id: "qs2",
      quizId: "q2",
      quizName: "State Management Quiz",
      trainingName: "Web Development Fundamentals",
      submittedOn: "2025-03-29T10:30:00",
      score: 7,
      maxScore: 10,
      status: "scored",
      meetingTitle: "Advanced Concepts",
    },
  ];

  const taskSubmissions: TaskSubmission[] = [
    {
      id: "ts1",
      taskId: "t1",
      taskName: "Build a Todo App",
      trainingName: "Web Development Fundamentals",
      submittedOn: "2025-03-28T18:45:00",
      answer: "https://github.com/sarah-j/todo-app",
      score: null,
      maxScore: 100,
      status: "pending",
      meetingTitle: "Frontend Basics",
    },
    {
      id: "ts2",
      taskId: "t2",
      taskName: "Create an API",
      trainingName: "Backend Development",
      submittedOn: "2025-03-31T14:20:00",
      answer: "https://github.com/sarah-j/rest-api",
      score: 90,
      maxScore: 100,
      status: "scored",
      meetingTitle: "API Development",
    },
  ];

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
        {moduleSubmissions.map((submission) => (
          <div
            key={submission.id}
            className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm"
          >
            <div className="flex flex-col md:flex-row justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {submission.moduleName}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                  <BookOpen size={16} />
                  <span>{submission.trainingName}</span>
                  <span className="text-gray-400">|</span>
                  <Calendar size={16} />
                  <span>{submission.meetingTitle}</span>
                </div>
              </div>
              <div className="mt-3 md:mt-0 flex items-center">
                {submission.status === "scored" ? (
                  <div className="flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    <CheckCircle size={16} />
                    <span>
                      Scored: {submission.score}/{submission.maxScore}
                    </span>
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
              <p className="text-gray-800">{submission.answer}</p>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center pt-3 border-t border-gray-100">
              <div className="text-sm text-gray-500">
                Submitted on{" "}
                {new Date(submission.submittedOn).toLocaleDateString()} at{" "}
                {new Date(submission.submittedOn).toLocaleTimeString([], {
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
                    <span className="text-sm text-gray-500">
                      / {submission.maxScore}
                    </span>
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
                    {submission.status === "scored"
                      ? "Update Score"
                      : "Grade Submission"}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {moduleSubmissions.length === 0 && (
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
        {quizSubmissions.map((submission) => (
          <div
            key={submission.id}
            className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm"
          >
            <div className="flex flex-col md:flex-row justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {submission.quizName}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                  <BookOpen size={16} />
                  <span>{submission.trainingName}</span>
                  <span className="text-gray-400">|</span>
                  <Calendar size={16} />
                  <span>{submission.meetingTitle}</span>
                </div>
              </div>
              <div className="mt-3 md:mt-0">
                <div className="flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  <Award size={16} />
                  <span>
                    Score: {submission.score}/{submission.maxScore}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center pt-3 border-t border-gray-100">
              <div className="text-sm text-gray-500">
                Submitted on{" "}
                {new Date(submission.submittedOn).toLocaleDateString()} at{" "}
                {new Date(submission.submittedOn).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>

              <div className="mt-3 md:mt-0">
                <Link
                  to={`/quiz-details/${submission.quizId}`}
                  className="px-4 py-1.5 bg-gray-100 text-gray-800 text-sm rounded hover:bg-gray-200"
                >
                  View Quiz Details
                </Link>
              </div>
            </div>
          </div>
        ))}

        {quizSubmissions.length === 0 && (
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
        {taskSubmissions.map((submission) => (
          <div
            key={submission.id}
            className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm"
          >
            <div className="flex flex-col md:flex-row justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {submission.taskName}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                  <BookOpen size={16} />
                  <span>{submission.trainingName}</span>
                  <span className="text-gray-400">|</span>
                  <Calendar size={16} />
                  <span>{submission.meetingTitle}</span>
                </div>
              </div>
              <div className="mt-3 md:mt-0 flex items-center">
                {submission.status === "scored" ? (
                  <div className="flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    <CheckCircle size={16} />
                    <span>
                      Scored: {submission.score}/{submission.maxScore}
                    </span>
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
                Submission Link:
              </h4>
              <a
                href={submission.answer}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {submission.answer}
              </a>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center pt-3 border-t border-gray-100">
              <div className="text-sm text-gray-500">
                Submitted on{" "}
                {new Date(submission.submittedOn).toLocaleDateString()} at{" "}
                {new Date(submission.submittedOn).toLocaleTimeString([], {
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
                    <span className="text-sm text-gray-500">
                      / {submission.maxScore}
                    </span>
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
                    {submission.status === "scored"
                      ? "Update Score"
                      : "Grade Submission"}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {taskSubmissions.length === 0 && (
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
            <h1 className="text-2xl font-bold text-gray-900">{student.name}</h1>
            <p className="text-gray-600">{student.email}</p>
            <div className="mt-1 flex items-center gap-3">
              {getStatusBadge(student.status)}
              <span className="text-sm text-gray-500">
                Last active: {new Date(student.lastActive).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="mt-4 md:mt-0 grid grid-cols-2 md:grid-cols-3 gap-3 text-center">
            <div className="bg-gray-50 px-4 py-2 rounded-lg">
              <div className="text-2xl font-semibold text-gray-900">
                {student.enrolledCourses}
              </div>
              <div className="text-xs text-gray-500">Enrolled Courses</div>
            </div>
            <div className="bg-gray-50 px-4 py-2 rounded-lg">
              <div className="text-2xl font-semibold text-gray-900">
                {student.completedCourses}
              </div>
              <div className="text-xs text-gray-500">Completed</div>
            </div>
            <div className="bg-gray-50 px-4 py-2 rounded-lg">
              <div className="text-2xl font-semibold text-gray-900">
                {student.pendingAssignments}
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
const getStatusBadge = (
  status: "enrolled" | "completed" | "dropped"
): React.ReactNode => {
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
