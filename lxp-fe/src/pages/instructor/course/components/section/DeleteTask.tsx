import React, { useState } from "react";
import { X, AlertTriangle } from "lucide-react";

interface DeleteTaskProps {
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>;
  isLoading?: boolean;
  task: {
    id: string;
    title: string;
  };
}

const DeleteTask: React.FC<DeleteTaskProps> = ({
  onClose,
  onConfirm,
  isLoading = false,
  task,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm(task.id);
      onClose();
    } catch (error) {
      console.error("Error deleting item:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const isProcessing = isDeleting || isLoading;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Delete {task.title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex items-center mt-4">
          <AlertTriangle className="text-red-500" size={24} />
          <p className="ml-3 text-gray-700 dark:text-gray-300">
            Are you sure you want to delete <strong>{task.title}</strong>? This
            action cannot be undone.
          </p>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-400 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isProcessing}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-red-400"
          >
            {isProcessing ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteTask;
