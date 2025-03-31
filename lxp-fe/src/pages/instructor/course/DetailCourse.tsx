import React, { useState, useEffect } from "react";
import {
  PlusCircle,
  BookOpen,
  Users,
  Calendar,
  FileText,
  CheckSquare,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { useGetInstructorDetailTrainings } from "../../../hooks/useTrainings";
import LoadingSpinner from "../../../Components/LoadingSpinner";
import { Meeting, Module, Quiz, Task } from "../../../types/training";
import AddMeetingForm from "./components/AddMeeting";
import { useCreateMeeting } from "../../../hooks/useMeeting";

const DetailCoursePage = () => {
  const { trainingId } = useParams<{ trainingId: string }>();
  const { data, isLoading, error } =
    useGetInstructorDetailTrainings(trainingId);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [activeTab, setActiveTab] = useState("modules");
  const [showAddMeetingModal, setShowAddMeetingModal] =
    useState<boolean>(false);
  const createMeetingMutation = useCreateMeeting();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update selectedMeeting when data is loaded
  useEffect(() => {
    if (data && data.meetings && data.meetings.length > 0) {
      setSelectedMeeting(data.meetings[0]);
    }
  }, [data]);

  if (isLoading) {
    return <LoadingSpinner text="Loading..." />;
  }

  if (error) {
    return (
      <div className="min-h-[85vh] w-screen flex items-center justify-center">
        Error loading data
      </div>
    );
  }

  // If data is not loaded, return a loading state
  if (!data) {
    return (
      <div className="min-h-[85vh] w-screen flex items-center justify-center">
        No course data available
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      {/* Course Header - Always visible even without meetings */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start">
          <div className="w-full md:w-[65%]">
            <h1 className="text-2xl font-bold mb-2">{data.title}</h1>
            <p className="text-gray-600 mb-4 line-clamp-1">
              {data.description}
            </p>
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
              onClick={() => setShowAddMeetingModal(true)}
            >
              <PlusCircle size={16} /> Add Meeting
            </button>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar - Meetings Section */}
        <div className="md:col-span-1 bg-white rounded-lg shadow-sm p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-800">Meetings</h2>
            <button
              className="p-1 text-gray-700 hover:text-gray-900"
              onClick={() => setShowAddMeetingModal(true)}
            >
              <PlusCircle size={16} />
            </button>
          </div>

          {data.meetings && data.meetings.length > 0 ? (
            <div className="space-y-2">
              {data.meetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedMeeting && selectedMeeting.id === meeting.id
                      ? "bg-gray-900 text-white"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                  onClick={() => setSelectedMeeting(meeting)}
                >
                  <h3 className="font-medium text-sm">{meeting.title}</h3>
                  <div
                    className={`flex items-center mt-1 text-xs ${
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
              ))}
            </div>
          ) : (
            <div className="py-6 text-center text-gray-500">
              <p>No meetings available</p>
              <button className="mt-3 px-4 py-2 border border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 text-gray-700 transition-colors mx-auto">
                <PlusCircle size={16} /> Add First Meeting
              </button>
            </div>
          )}
        </div>

        {/* Main Content */}
        {selectedMeeting ? (
          <div className="md:col-span-3 bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b border-gray-100">
              <h2 className="font-semibold text-lg">{selectedMeeting.title}</h2>
              <div className="flex items-center mt-1 text-sm text-gray-500">
                <Calendar size={14} className="mr-1" />
                {new Date(
                  selectedMeeting.meetingDate || Date.now()
                ).toLocaleDateString()}
              </div>
            </div>

            {/* Custom Tabs */}
            <div className="p-4">
              <div className="flex border-b border-gray-200 mb-4">
                <button
                  className={`px-4 py-2 flex items-center gap-1 transition-colors ${
                    activeTab === "modules"
                      ? "border-b-2 border-gray-900 text-gray-900"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                  onClick={() => setActiveTab("modules")}
                >
                  <BookOpen size={16} /> Modules
                </button>
                <button
                  className={`px-4 py-2 flex items-center gap-1 transition-colors ${
                    activeTab === "quizzes"
                      ? "border-b-2 border-gray-900 text-gray-900"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                  onClick={() => setActiveTab("quizzes")}
                >
                  <FileText size={16} /> Quizzes
                </button>
                <button
                  className={`px-4 py-2 flex items-center gap-1 transition-colors ${
                    activeTab === "tasks"
                      ? "border-b-2 border-gray-900 text-gray-900"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                  onClick={() => setActiveTab("tasks")}
                >
                  <CheckSquare size={16} /> Tasks
                </button>
              </div>

              {/* Modules Tab Content */}
              {activeTab === "modules" && (
                <div className="space-y-4">
                  {selectedMeeting.modules &&
                  selectedMeeting.modules.length > 0 ? (
                    selectedMeeting.modules.map((module: Module) => (
                      <div
                        key={module.id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                      >
                        <h3 className="font-medium">{module.title}</h3>
                        <div className="flex items-center mt-2 text-sm">
                          <a
                            href="#"
                            className="text-gray-900 hover:underline flex items-center"
                          >
                            <FileText size={14} className="mr-1" /> View Module
                          </a>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            Edit
                          </button>
                          <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
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
                    <button className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 text-gray-700 transition-colors">
                      <PlusCircle size={16} /> Add Module
                    </button>
                  </div>
                </div>
              )}

              {/* Quizzes Tab Content */}
              {activeTab === "quizzes" && (
                <div className="space-y-4">
                  {selectedMeeting.quizzes &&
                  selectedMeeting.quizzes.length > 0 ? (
                    selectedMeeting.quizzes.map((quiz: Quiz) => (
                      <div
                        key={quiz.id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                      >
                        <h3 className="font-medium">{quiz.title}</h3>
                        <div className="flex items-center mt-2 text-sm">
                          <a
                            href="#"
                            className="text-gray-900 hover:underline flex items-center"
                          >
                            <FileText size={14} className="mr-1" /> View Quiz
                          </a>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            Edit
                          </button>
                          <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
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
                    <button className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 text-gray-700 transition-colors">
                      <PlusCircle size={16} /> Add Quiz
                    </button>
                  </div>
                </div>
              )}

              {/* Tasks Tab Content */}
              {activeTab === "tasks" && (
                <div className="space-y-4">
                  {selectedMeeting.tasks && selectedMeeting.tasks.length > 0 ? (
                    selectedMeeting.tasks.map((task: Task) => (
                      <div
                        key={task.id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                      >
                        <h3 className="font-medium">{task.title}</h3>
                        <div className="flex items-center mt-2 text-sm">
                          <a
                            href="#"
                            className="text-gray-900 hover:underline flex items-center"
                          >
                            <FileText size={14} className="mr-1" /> View Quiz
                          </a>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            Edit
                          </button>
                          <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
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
                    <button className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 text-gray-700 transition-colors">
                      <PlusCircle size={16} /> Add Task
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="md:col-span-3 bg-white rounded-lg shadow-sm p-10 flex flex-col items-center justify-center text-center">
            <div className="text-gray-500 mb-4">
              <Calendar size={48} />
            </div>
            <h3 className="text-lg font-medium mb-2">No Meeting Selected</h3>
            <p className="text-gray-500 mb-6">
              Please add a meeting to this course or select an existing one to
              view its content.
            </p>
            <button className="px-4 py-2 bg-gray-900 text-white rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors">
              <PlusCircle size={16} /> Add First Meeting
            </button>
          </div>
        )}
      </div>
      {showAddMeetingModal && (
        <AddMeetingForm
          onClose={() => setShowAddMeetingModal(false)}
          isLoading={isSubmitting}
          onSubmit={async (data: { title: string }) => {
            setIsSubmitting(true);
            const training = {
              trainingId: trainingId || "",
              title: data.title,
            };

            try {
              // Return a promise that the modal can await
              return new Promise<void>((resolve, reject) => {
                createMeetingMutation.mutate(training, {
                  onSuccess: () => {
                    setIsSubmitting(false);
                    resolve(); // Resolve the promise on success
                  },
                  onError: (error) => {
                    setIsSubmitting(false);
                    console.error("Error creating training:", error);
                    reject(error); // Reject the promise on error
                  },
                });
              });
            } catch (error) {
              setIsSubmitting(false);
              console.error("Error creating training:", error);
              throw error; // Re-throw to be caught by the form's error handler
            }
          }}
        />
      )}
    </div>
  );
};

export default DetailCoursePage;
