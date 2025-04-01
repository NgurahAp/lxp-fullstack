// components/TabContent/index.tsx
import React, { useState } from "react";
import { FileText, PlusCircle } from "lucide-react";
import { Module, Quiz, Task } from "../../../../../types/training";
import AddModuleForm from "./AddModule";
import { useCreateModule } from "../../../../../hooks/useModule";

interface ModulesTabProps {
  modules?: Module[];
  meetingId: string;
  onAddModule?: (data: FormData) => Promise<void>;
}

interface QuizzesTabProps {
  quizzes?: Quiz[];
}

interface TasksTabProps {
  tasks?: Task[];
}

// components/TabContent/ModulesTab.tsx
const ModulesTab: React.FC<ModulesTabProps> = ({
  modules = [],
  meetingId,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const createModuleMutation = useCreateModule();

  const handleAddModule = async (formData: FormData): Promise<void> => {
    const module = {
      meetingId: meetingId,
      payload: formData,
    };

    try {
      return new Promise<void>((resolve, reject) => {
        createModuleMutation.mutate(module, {
          onSuccess: () => {
            // setIsSubmitting(false);
            resolve();
          },
          onError: (error) => {
            // setIsSubmitting(false);
            console.error("Error creating meeting:", error);
            reject(error);
          },
        });
      });
    } catch (error) {
      // setIsSubmitting(false);
      console.error("Error creating meeting:", error);
      throw error;
    }
  };

  return (
    <div className="space-y-4">
      {modules.length > 0 ? (
        modules.map((module) => (
          <div
            key={module.id}
            className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
          >
            <h3 className="font-medium">{module.title}</h3>
            <div className="flex items-center mt-2 text-sm">
              <a
                href={`http://localhost:3001/public/${module.content}`}
                target="_blank"
                className="text-gray-900 hover:underline flex items-center"
              >
                <FileText size={14} className="mr-1" /> View Module
              </a>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Edit
              </button>
              <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Delete
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-6 text-gray-500">
          No modules available for this meeting
        </div>
      )}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 text-gray-700 transition-colors"
        >
          <PlusCircle size={16} /> Add Module
        </button>
      </div>
      {showAddForm && (
        <AddModuleForm
          onClose={() => setShowAddForm(false)}
          onSubmit={handleAddModule}
        />
      )}
    </div>
  );
};

// components/TabContent/QuizzesTab.tsx
const QuizzesTab: React.FC<QuizzesTabProps> = ({ quizzes = [] }) => {
  return (
    <div className="space-y-4">
      {quizzes.length > 0 ? (
        quizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
          >
            <h3 className="font-medium">{quiz.title}</h3>
            <div className="flex items-center mt-2 text-sm">
              <a
                href="#"
                className="text-gray-900 hover:underline flex items-center"
              >
                <FileText size={14} className="mr-1" /> View Quiz
              </a>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Edit
              </button>
              <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Delete
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-6 text-gray-500">
          No quizzes available for this meeting
        </div>
      )}
      <div className="flex justify-center mt-4">
        <button className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 text-gray-700 transition-colors">
          <PlusCircle size={16} /> Add Quiz
        </button>
      </div>
    </div>
  );
};

// components/TabContent/TasksTab.tsx
const TasksTab: React.FC<TasksTabProps> = ({ tasks = [] }) => {
  return (
    <div className="space-y-4">
      {tasks.length > 0 ? (
        tasks.map((task) => (
          <div
            key={task.id}
            className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
          >
            <h3 className="font-medium">{task.title}</h3>
            <div className="flex items-center mt-2 text-sm">
              <a
                href="#"
                className="text-gray-900 hover:underline flex items-center"
              >
                <FileText size={14} className="mr-1" /> View Task
              </a>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Edit
              </button>
              <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Delete
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-6 text-gray-500">
          No tasks available for this meeting
        </div>
      )}
      <div className="flex justify-center mt-4">
        <button className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 text-gray-700 transition-colors">
          <PlusCircle size={16} /> Add Task
        </button>
      </div>
    </div>
  );
};

export { ModulesTab, QuizzesTab, TasksTab };
