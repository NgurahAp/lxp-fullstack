import React, { useState, FormEvent } from "react";
import { X, Edit } from "lucide-react";

// Props interface with explicit types
interface CreateTaskProps {
  onClose: () => void;
  onSubmit: (data: { title: string; taskQuestion: string }) => Promise<void>;
  isLoading?: boolean;
}

const CreateTask: React.FC<CreateTaskProps> = ({
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [title, setTitle] = useState("");
  const [taskQuestion, setTaskQuestion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit({
        title,
        taskQuestion,
      });
      onClose(); // Only close after successful completion
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isProcessing = isSubmitting || isLoading;
  const isValid = title.trim() !== "" && taskQuestion.trim() !== "";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 overflow-hidden">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-semibold">Edit Task</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={isProcessing}
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-4 space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Task Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="Enter task title"
                required
                disabled={isProcessing}
              />
            </div>
            <div>
              <label
                htmlFor="taskQuestion"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Task Question
              </label>
              <textarea
                id="taskQuestion"
                value={taskQuestion}
                onChange={(e) => setTaskQuestion(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent h-40"
                placeholder="Enter task question"
                required
                disabled={isProcessing}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 p-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 text-white rounded-lg transition-colors ${
                isProcessing || !isValid
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gray-900 hover:bg-gray-800"
              }`}
              disabled={isProcessing || !isValid}
            >
              {isProcessing ? "Updating..." : "Update Task"}
            </button>
          </div>
        </form>
        <div className="bg-gray-50 p-4 border-t">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 text-blue-700 p-2 rounded-full">
              <Edit size={18} />
            </div>
            <div className="text-sm text-gray-600">
              <p className="font-medium mb-1">Quick Tip</p>
              <p>
                Be clear and specific with your task question to ensure student
                understand exactly what's expected of them.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTask;
