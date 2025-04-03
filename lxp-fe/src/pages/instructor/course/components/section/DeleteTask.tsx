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
      console.error("Error deleting task:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const isProcessing = isDeleting || isLoading;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-semibold text-lg">Delete Task</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={isProcessing}
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-red-100 rounded-full p-2 text-red-600">
              <AlertTriangle size={24} />
            </div>
            <h4 className="font-medium">Confirm Deletion</h4>
          </div>

          <p className="text-gray-600 mb-2">
            Are you sure you want to delete the task:
          </p>
          <p className="font-medium text-gray-800 mb-4">"{task.title}"</p>

          <div className="bg-yellow-50 p-3 rounded-lg text-yellow-800 text-sm mb-4">
            <p>
              This action will permanently delete this task. This cannot be undone.
            </p>
          </div>
        </div>

        <div className="p-4 border-t flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            disabled={isProcessing}
          >
            {isProcessing ? "Deleting..." : "Delete Task"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteTask;