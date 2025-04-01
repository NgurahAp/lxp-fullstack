// components/EmptyMeetingState.tsx
import React from "react";
import { Calendar, PlusCircle } from "lucide-react";

interface EmptyMeetingStateProps {
  onAddMeeting: () => void;
}

const EmptyMeetingState: React.FC<EmptyMeetingStateProps> = ({
  onAddMeeting,
}) => {
  return (
    <div className="md:col-span-3 bg-white rounded-lg shadow-sm p-10 flex flex-col items-center justify-center text-center">
      <div className="text-gray-500 mb-4">
        <Calendar size={48} />
      </div>
      <h3 className="text-lg font-medium mb-2">No Meeting Selected</h3>
      <p className="text-gray-500 mb-6">
        Please add a meeting to this course or select an existing one to view
        its content.
      </p>
      <button
        className="px-4 py-2 bg-gray-900 text-white rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors"
        onClick={onAddMeeting}
      >
        <PlusCircle size={16} /> Add First Meeting
      </button>
    </div>
  );
};

export default EmptyMeetingState;
