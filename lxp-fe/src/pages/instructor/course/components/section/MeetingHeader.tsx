// components/MeetingHeader.tsx
import React from "react";
import { PlusCircle, Users } from "lucide-react";
import { DetailTrainingData } from "../../../../../types/training";

interface MeetingHeaderProps {
  data: DetailTrainingData;
  onAddMeeting: () => void;
}

const MeetingHeader: React.FC<MeetingHeaderProps> = ({ data, onAddMeeting }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start">
        <div className="w-full md:w-[65%]">
          <h1 className="text-2xl font-bold mb-2">{data.title}</h1>
          <p className="text-gray-600 mb-4 line-clamp-1">{data.description}</p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Instructor: {data.instructor?.name || "Not assigned"}</span>
            <span>•</span>
            <span>
              Last updated: {new Date(data.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <button className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50 text-gray-700 transition-colors">
            <Users size={16} /> Students ({data._count?.users || 0})
          </button>
          <button
            className="px-4 py-2 bg-gray-900 text-white rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors"
            onClick={onAddMeeting}
          >
            <PlusCircle size={16} /> Add Meeting
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeetingHeader;
