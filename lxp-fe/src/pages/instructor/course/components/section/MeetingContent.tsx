// components/MainContent.tsx
import React, { useState } from "react";
import {
  BookOpen,
  FileText,
  CheckSquare,
  Edit,
  Trash2,
  Calendar,
} from "lucide-react";

// Import sub-components
import { Meeting } from "../../../../../types/training";
import { ModulesTab, QuizzesTab, TasksTab } from "./TabContent";

interface MainContentProps {
  meeting: Meeting;
  onEditMeeting: (meeting: Meeting) => void;
  onDeleteMeeting: (meeting: Meeting) => void;
}

const MainContent: React.FC<MainContentProps> = ({
  meeting,
  onEditMeeting,
  onDeleteMeeting,
}) => {
  const [activeTab, setActiveTab] = useState<string>("modules");

  return (
    <div className="md:col-span-3 bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        <div>
          <h2 className="font-semibold text-lg">{meeting.title}</h2>
          <div className="flex items-center mt-1 text-sm text-gray-500">
            <Calendar size={14} className="mr-1" />
            {new Date(meeting.meetingDate || Date.now()).toLocaleDateString()}
          </div>
        </div>

        {/* Meeting actions */}
        <div className="flex gap-2">
          <button
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
            onClick={() => onEditMeeting(meeting)}
          >
            <Edit size={16} />
          </button>
          <button
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-lg"
            onClick={() => onDeleteMeeting(meeting)}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Custom Tabs */}
      <div className="p-4">
        <div className="flex border-b border-gray-200 mb-4">
          <button
            className={`px-4 py-2 flex items-center gap-1 transition-colors ${
              activeTab === "modules"
                ? "border-b-2 border-gray-900 text-gray-900"
                : "text-gray-600 hover:text-gray-800"
            }`}
            onClick={() => setActiveTab("modules")}
          >
            <BookOpen size={16} /> Modules
          </button>
          <button
            className={`px-4 py-2 flex items-center gap-1 transition-colors ${
              activeTab === "quizzes"
                ? "border-b-2 border-gray-900 text-gray-900"
                : "text-gray-600 hover:text-gray-800"
            }`}
            onClick={() => setActiveTab("quizzes")}
          >
            <FileText size={16} /> Quizzes
          </button>
          <button
            className={`px-4 py-2 flex items-center gap-1 transition-colors ${
              activeTab === "tasks"
                ? "border-b-2 border-gray-900 text-gray-900"
                : "text-gray-600 hover:text-gray-800"
            }`}
            onClick={() => setActiveTab("tasks")}
          >
            <CheckSquare size={16} /> Tasks
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "modules" && (
          <ModulesTab modules={meeting.modules} meetingId={meeting.id} />
        )}
        {activeTab === "quizzes" && <QuizzesTab quizzes={meeting.quizzes} />}
        {activeTab === "tasks" && <TasksTab tasks={meeting.tasks} />}
      </div>
    </div>
  );
};

export default MainContent;
