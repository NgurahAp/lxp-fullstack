// components/TabContent/index.tsx
import React, { useState } from "react";
import { FileText, PlusCircle } from "lucide-react";
import { Module, Quiz, Task } from "../../../../../types/training";
import AddModuleForm from "./AddModule";
import {
  useCreateModule,
  useDeleteModule,
  useUpdateModule,
} from "../../../../../hooks/useModule";
import EditModuleForm from "./EditModule";
import DeleteModuleConfirm from "./DeleteModule";
import { Link } from "react-router-dom";

interface ModulesTabProps {
  modules?: Module[];
  meetingId: string;
  trainingId: string;
  onAddModule?: (data: FormData) => Promise<void>;
}

interface QuizzesTabProps {
  quizzes?: Quiz[];
}

interface TasksTabProps {
  tasks?: Task[];
}

// components/TabContent/ModulesTab.tsx
interface ModulesTabProps {
  modules?: Module[];
  meetingId: string;
  trainingId: string;
}

const ModulesTab: React.FC<ModulesTabProps> = ({
  modules = [],
  meetingId,
  trainingId,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);

  const createModuleMutation = useCreateModule();
  const updateModuleMutation = useUpdateModule();
  const deleteModuleMutation = useDeleteModule();

  const handleAddModule = async (formData: FormData): Promise<void> => {
    const module = {
      meetingId: meetingId,
      payload: formData,
    };

    try {
      return new Promise<void>((resolve, reject) => {
        createModuleMutation.mutate(module, {
          onSuccess: () => {
            resolve();
          },
          onError: (error) => {
            console.error("Error creating module:", error);
            reject(error);
          },
        });
      });
    } catch (error) {
      console.error("Error creating module:", error);
      throw error;
    }
  };

  const handleEditModule = async (
    formData: FormData,
    moduleId: string
  ): Promise<void> => {
    const module = {
      trainingId: trainingId,
      meetingId: meetingId,
      moduleId: moduleId,
      payload: formData,
    };

    try {
      return new Promise<void>((resolve, reject) => {
        updateModuleMutation.mutate(module, {
          onSuccess: () => {
            resolve();
          },
          onError: (error) => {
            console.error("Error updating module:", error);
            reject(error);
          },
        });
      });
    } catch (error) {
      console.error("Error updating module:", error);
      throw error;
    }
  };

  const handleDeleteModule = async (moduleId: string): Promise<void> => {
    const deletePayload = {
      trainingId: trainingId,
      meetingId: meetingId,
      moduleId: moduleId,
    };

    try {
      return new Promise<void>((resolve, reject) => {
        deleteModuleMutation.mutate(deletePayload, {
          onSuccess: () => {
            resolve();
          },
          onError: (error) => {
            console.error("Error deleting module:", error);
            reject(error);
          },
        });
      });
    } catch (error) {
      console.error("Error deleting module:", error);
      throw error;
    }
  };

  const openEditForm = (module: Module) => {
    setSelectedModule(module);
    setShowEditForm(true);
  };

  const openDeleteConfirm = (module: Module) => {
    setSelectedModule(module);
    setShowDeleteConfirm(true);
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
              <button
                className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => openEditForm(module)}
              >
                Edit
              </button>
              <button
                className="px-3 py-1 text-sm border border-red-100 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                onClick={() => openDeleteConfirm(module)}
              >
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

      {showEditForm && selectedModule && (
        <EditModuleForm
          onClose={() => {
            setShowEditForm(false);
            setSelectedModule(null);
          }}
          onSubmit={handleEditModule}
          module={selectedModule}
        />
      )}

      {showDeleteConfirm && selectedModule && (
        <DeleteModuleConfirm
          onClose={() => {
            setShowDeleteConfirm(false);
            setSelectedModule(null);
          }}
          onConfirm={handleDeleteModule}
          module={selectedModule}
        />
      )}
    </div>
  );
};

export default ModulesTab;

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
              <Link
                to={`/instructorCourse/quiz`}
                className="text-gray-900 hover:underline flex items-center"
              >
                <FileText size={14} className="mr-1" /> View Quiz
              </Link>
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
