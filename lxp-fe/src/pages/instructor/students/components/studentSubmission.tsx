import {
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Award,
  HelpCircle,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Module, Quiz, Task } from "../../../../types/students";

interface ModuleSubmissionsProps {
  modules: Module[];
  updateScore: (
    submissionId: string,
    trainingUserId: string,
    newScore: string
  ) => void;
}

const ModuleSubmissions: React.FC<ModuleSubmissionsProps> = ({
  modules,
  updateScore,
}) => {
  const [editingScoreId, setEditingScoreId] = useState<string | null>(null);
  const [newScore, setNewScore] = useState<string>("");

  const handleSaveScore = (
    submissionId: string,
    trainingUserId: string
  ): void => {
    if (
      newScore !== "" &&
      !isNaN(Number(newScore)) &&
      Number(newScore) >= 0 &&
      Number(newScore) <= 100
    ) {
      updateScore(submissionId, trainingUserId, newScore);
      setEditingScoreId(null);
      setNewScore("");
    }
  };

  return (
    <div className="space-y-6">
      {modules?.map((submission) => (
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
                <span className="truncate w-72">{submission.meetingTitle}</span>
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
              Submitted on {new Date(submission.updatedAt).toLocaleDateString()}{" "}
              at{" "}
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
                    onClick={() =>
                      handleSaveScore(submission.id, submission.trainingUserId)
                    }
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
                  {submission.score != 0 ? "Update Score" : "Grade Submission"}
                </button>
              )}
            </div>
          </div>
        </div>
      ))}

      {modules?.length === 0 && (
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

interface QuizSubmissionsProps {
  quizzes: Quiz[];
}

const QuizSubmissions: React.FC<QuizSubmissionsProps> = ({ quizzes }) => {
  return (
    <div className="space-y-6">
      {quizzes?.map((submission) => (
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
                <span className="truncate w-72">{submission.meetingTitle}</span>
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
              Submitted on {new Date(submission.updatedAt).toLocaleDateString()}{" "}
              at{" "}
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

      {quizzes?.length === 0 && (
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

export default QuizSubmissions;

interface TaskSubmissionsProps {
  tasks: Task[];
  updateScore: (
    submissionId: string,
    submissionType: string,
    newScore: string
  ) => void;
}

const TaskSubmissions: React.FC<TaskSubmissionsProps> = ({
  tasks,
  updateScore,
}) => {
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
      {tasks?.map((submission) => (
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
                <span className="truncate w-72">{submission.meetingTitle}</span>
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
              Submitted on {new Date(submission.updatedAt).toLocaleDateString()}{" "}
              at{" "}
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
                  {submission.score != 0 ? "Update Score" : "Grade Submission"}
                </button>
              )}
            </div>
          </div>
        </div>
      ))}

      {tasks?.length === 0 && (
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

export { ModuleSubmissions, QuizSubmissions, TaskSubmissions };
