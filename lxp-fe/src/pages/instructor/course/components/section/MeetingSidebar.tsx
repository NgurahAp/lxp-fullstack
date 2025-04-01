// components/MeetingSidebar.tsx
import React from "react";
import { PlusCircle, Calendar } from "lucide-react";
import { Meeting } from "../../../../../types/training";

interface MeetingSidebarProps {
  meetings: Meeting[];
  selectedMeeting: Meeting | null;
  onSelectMeeting: (meeting: Meeting) => void;
  onAddMeeting: () => void;
}

const MeetingSidebar: React.FC<MeetingSidebarProps> = ({
  meetings = [],
  selectedMeeting,
  onSelectMeeting,
  onAddMeeting,
}) => {
  return (
    <div className="md:col-span-1 bg-white rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-gray-800">Meetings</h2>
        <button
          className="p-1 text-gray-700 hover:text-gray-900"
          onClick={onAddMeeting}
        >
          <PlusCircle size={16} />
        </button>
      </div>

      {meetings && meetings.length > 0 ? (
        <div className="space-y-2">
          {meetings.map((meeting) => (
            <div key={meeting.id} className="relative">
              <div
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedMeeting && selectedMeeting.id === meeting.id
                    ? "bg-gray-900 text-white"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
                onClick={() => onSelectMeeting(meeting)}
              >
                <h3 className="font-medium text-sm line-clamp-2">
                  {meeting.title}
                </h3>
                <div
                  className={`flex items-center mt-3 text-xs ${
                    selectedMeeting && selectedMeeting.id === meeting.id
                      ? "text-gray-300"
                      : "text-gray-500"
                  }`}
                >
                  <Calendar size={12} className="mr-1" />
                  {new Date(
                    meeting.meetingDate || Date.now()
                  ).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-6 text-center text-gray-500">
          <p>No meetings available</p>
          <button
            className="mt-3 px-4 py-2 border border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 text-gray-700 transition-colors mx-auto"
            onClick={onAddMeeting}
          >
            <PlusCircle size={16} /> Add First Meeting
          </button>
        </div>
      )}
    </div>
  );
};

export default MeetingSidebar;
