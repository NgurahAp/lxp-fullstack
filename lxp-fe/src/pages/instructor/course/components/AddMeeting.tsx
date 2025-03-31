import React, { useState, FormEvent } from "react";
import { X, Calendar } from "lucide-react";

// Interface for the meeting data
interface MeetingFormData {
  title: string;
}

// Props interface with explicit types
interface AddMeetingFormProps {
  onClose: () => void;
  onSubmit: (data: MeetingFormData) => void;
}

const AddMeetingForm: React.FC<AddMeetingFormProps> = ({
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      onSubmit({ title });
      setIsSubmitting(false);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="font-semibold text-lg">Add New Meeting</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-8">
            <label
              htmlFor="meeting-title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Meeting Title
            </label>
            <input
              id="meeting-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              placeholder="Enter meeting title"
              required
            />
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500 flex items-center">
              <Calendar size={16} className="mr-2" />
              Today's date will be set as default
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!title.trim() || isSubmitting}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Adding..." : "Add Meeting"}
              </button>
            </div>
          </div>
        </form>

        <div className="bg-gray-50 p-6 rounded-b-lg border-t border-gray-200">
          <div className="flex items-start">
            <div className="bg-blue-100 rounded-full p-2 text-blue-500 mr-3">
              <Calendar size={16} />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900">Quick Tip</h3>
              <p className="text-sm text-gray-500 mt-1">
                You'll be able to add modules, quizzes, and tasks after creating
                the meeting.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMeetingForm;
