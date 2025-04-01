import React, { useState, FormEvent, useEffect } from "react";
import { X, Calendar } from "lucide-react";

// Interface for the meeting data
interface MeetingFormData {
  title: string;
}

// Props interface with explicit types
interface EditMeetingFormProps {
  onClose: () => void;
  onSubmit: (data: MeetingFormData) => Promise<void>;
  isLoading?: boolean;
  initialTitle: string; // Added to receive the existing title
}

const EditMeetingForm: React.FC<EditMeetingFormProps> = ({
  onClose,
  onSubmit,
  isLoading = false,
  initialTitle,
}) => {
  const [title, setTitle] = useState(initialTitle); // Pre-populate with existing title
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update title if initialTitle changes
  useEffect(() => {
    setTitle(initialTitle);
  }, [initialTitle]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit({ title });
      onClose();
    } catch (error) {
      console.error("Error updating meeting:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isProcessing = isSubmitting || isLoading;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-semibold text-lg">Edit Meeting</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={isProcessing}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meeting Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              placeholder="Enter meeting title"
              required
              disabled={isProcessing}
            />
          </div>

          <div className="p-4 bg-gray-50 flex items-center gap-2 text-sm text-gray-500 rounded-b-lg">
            <Calendar size={16} />
            <span>Original meeting date will be preserved</span>
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
              type="submit"
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              disabled={isProcessing}
            >
              {isProcessing ? "Updating..." : "Update Meeting"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMeetingForm;
