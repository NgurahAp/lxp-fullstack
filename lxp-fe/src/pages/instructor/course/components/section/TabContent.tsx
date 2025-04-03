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
import { useDeleteQuiz } from "../../../../../hooks/useQuiz";
import DeleteQuizConfirm from "./DeleteQuiz";
import ViewTaskDialog from "./ViewTask";
import EditTaskForm from "./EditTask";
import { useCreateTask, useUpdateTask } from "../../../../../hooks/useTask";
import CreateTask from "./CreateTask";

interface ModulesTabProps {
  modules?: Module[];
  meetingId: string;
  trainingId: string;
  onAddModule?: (data: FormData) => Promise<void>;
}

interface QuizzesTabProps {
  quizzes?: Quiz[];
  meetingId: string;
  trainingId: string;
}

interface TasksTabProps {
  tasks?: Task[];
  meetingId: string;
  trainingId: string;
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
const QuizzesTab: React.FC<QuizzesTabProps> = ({
  quizzes = [],
  meetingId,
  trainingId,
}) => {
  const deleteQuizMutation = useDeleteQuiz(trainingId);
  const [quizToDelete, setQuizToDelete] = useState<Quiz | null>(null);

  const handleDeleteClick = (quiz: Quiz) => {
    setQuizToDelete(quiz);
  };

  const handleConfirmDelete = async (quizId: string) => {
    const deletePayload = {
      trainingId: trainingId,
      meetingId: meetingId,
      quizId: quizId,
    };

    try {
      return new Promise<void>((resolve, reject) => {
        deleteQuizMutation.mutate(deletePayload, {
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

  const handleCloseDeleteModal = () => {
    setQuizToDelete(null);
  };

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
                to={`/instructorCourse/${trainingId}/${meetingId}/${quiz.id}`}
                className="text-gray-900 hover:underline flex items-center"
              >
                <FileText size={14} className="mr-1" /> View Quiz
              </Link>
            </div>
            <div className="mt-4 flex gap-2">
              <Link
                to={`/instructorCourse/${trainingId}/${meetingId}/updateQuiz/${quiz.id}`}
                className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Edit
              </Link>
              <button
                className="px-3 py-1 text-sm border border-red-100 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                onClick={() => handleDeleteClick(quiz)}
              >
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
        <Link
          to={`/instructorCourse/${trainingId}/${meetingId}/addQuiz`}
          className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 text-gray-700 transition-colors"
        >
          <PlusCircle size={16} /> Add Quiz
        </Link>
      </div>
      {quizToDelete && (
        <DeleteQuizConfirm
          quiz={quizToDelete}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
};

// components/TabContent/TasksTab.tsx
const TasksTab: React.FC<TasksTabProps> = ({
  tasks = [],
  meetingId,
  trainingId,
}) => {
  const [viewingTask, setViewingTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const updateTaskMutation = useUpdateTask(trainingId);
  const createTaskMutation = useCreateTask(trainingId);

  const openViewTask = (task: Task) => {
    setViewingTask(task);
  };

  const openEditTask = (task: Task) => {
    setEditingTask(task);
  };

  // Mock function to handle task updates
  const handleUpdateTask = async (data: {
    id: string;
    title: string;
    taskQuestion: string;
  }): Promise<void> => {
    const task = {
      trainingId: trainingId,
      meetingId: meetingId,
      taskId: data.id,
      formData: { title: data.title, taskQuestion: data.taskQuestion },
    };

    try {
      return new Promise<void>((resolve, reject) => {
        updateTaskMutation.mutate(task, {
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

  const handleCreateTask = async (data: {
    title: string;
    taskQuestion: string;
  }): Promise<void> => {
    const task = {
      meetingId: meetingId,
      formData: { title: data.title, taskQuestion: data.taskQuestion },
    };

    console.log(task);

    try {
      return new Promise<void>((resolve, reject) => {
        createTaskMutation.mutate(task, {
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
              <button
                onClick={() => openViewTask(task)}
                className="text-gray-900 hover:underline flex items-center"
              >
                <FileText size={14} className="mr-1" /> View Task
              </button>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => openEditTask(task)}
              >
                Edit
              </button>
              <button className="px-3 py-1 text-sm border border-red-100 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
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
        <button
          className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 text-gray-700 transition-colors"
          onClick={() => setShowAddForm(true)}
        >
          <PlusCircle size={16} /> Add Task
        </button>
      </div>

      {viewingTask && (
        <ViewTaskDialog
          onClose={() => setViewingTask(null)}
          task={viewingTask}
        />
      )}

      {editingTask && (
        <EditTaskForm
          onClose={() => setEditingTask(null)}
          onSubmit={handleUpdateTask}
          task={editingTask}
        />
      )}
      {showAddForm && (
        <CreateTask
          onClose={() => setShowAddForm(false)}
          onSubmit={handleCreateTask}
        />
      )}
    </div>
  );
};

export { ModulesTab, QuizzesTab, TasksTab };
