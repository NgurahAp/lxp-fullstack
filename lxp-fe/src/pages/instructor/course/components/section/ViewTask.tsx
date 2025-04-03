import React from "react";
import { X, FileText } from "lucide-react";
import { Task } from "../../../../../types/training";

interface ViewTaskDialogProps {
  onClose: () => void;
  task: Task;
}

const ViewTaskDialog: React.FC<ViewTaskDialogProps> = ({ onClose, task }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-semibold text-lg">Task Details</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 rounded-full p-2 text-blue-600">
              <FileText size={24} />
            </div>
            <h4 className="font-medium">{task.title}</h4>
          </div>

          <div className="mb-6">
            <h5 className="text-sm font-medium text-gray-700 mb-2">
              Task Question:
            </h5>
            <div className="bg-gray-50 p-4 rounded-lg text-gray-800">
              {task.taskQuestion}
            </div>
          </div>
        </div>

        <div className="p-4 border-t flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewTaskDialog;
