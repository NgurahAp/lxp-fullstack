import React, { useState, useEffect } from "react";
import {
  PlusCircle,
  BookOpen,
  Users,
  Calendar,
  FileText,
  CheckSquare,
  Edit,
  Trash2,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { useGetInstructorDetailTrainings } from "../../../hooks/useTrainings";
import LoadingSpinner from "../../../Components/LoadingSpinner";
import { Meeting, Module, Quiz, Task } from "../../../types/training";
import AddMeetingForm from "./components/AddMeeting";
import { useCreateMeeting, useDeleteMeeting, useUpdateMeeting } from "../../../hooks/useMeeting";
import DeleteMeetingConfirm from "./components/DeleteMeeting";
import EditMeetingForm from "./components/EditMeeting";

const DetailCoursePage = () => {
  const { trainingId } = useParams<{ trainingId: string }>();
  const { data, isLoading, error } =
    useGetInstructorDetailTrainings(trainingId);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [activeTab, setActiveTab] = useState("modules");
  const [showAddMeetingModal, setShowAddMeetingModal] =
    useState<boolean>(false);
  const [showEditMeetingModal, setShowEditMeetingModal] =
    useState<boolean>(false);
  const [showDeleteMeetingModal, setShowDeleteMeetingModal] =
    useState<boolean>(false);
  const [meetingToEdit, setMeetingToEdit] = useState<Meeting | null>(null);
  const [meetingToDelete, setMeetingToDelete] = useState<Meeting | null>(null);

  const createMeetingMutation = useCreateMeeting();
  const updateMeetingMutation = useUpdateMeeting();
  const deleteMeetingMutation = useDeleteMeeting();
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

  const handleEditMeeting = (meeting: Meeting) => {
    setMeetingToEdit(meeting);
    setShowEditMeetingModal(true);
  };

  const handleDeleteMeeting = (meeting: Meeting) => {
    setMeetingToDelete(meeting);
    setShowDeleteMeetingModal(true);
  };

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
                <div key={meeting.id} className="relative">
                  <div
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedMeeting && selectedMeeting.id === meeting.id
                        ? "bg-gray-900 text-white"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                    onClick={() => setSelectedMeeting(meeting)}
                  >
                    <h3 className="font-medium text-sm  line-clamp-2">
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
                onClick={() => setShowAddMeetingModal(true)}
              >
                <PlusCircle size={16} /> Add First Meeting
              </button>
            </div>
          )}
        </div>

        {/* Main Content */}
        {selectedMeeting ? (
          <div className="md:col-span-3 bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="font-semibold text-lg">
                  {selectedMeeting.title}
                </h2>
                <div className="flex items-center mt-1 text-sm text-gray-500">
                  <Calendar size={14} className="mr-1" />
                  {new Date(
                    selectedMeeting.meetingDate || Date.now()
                  ).toLocaleDateString()}
                </div>
              </div>

              {/* Meeting actions */}
              <div className="flex gap-2">
                <button
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                  onClick={() => handleEditMeeting(selectedMeeting)}
                >
                  <Edit size={16} />
                </button>
                <button
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-lg"
                  onClick={() => handleDeleteMeeting(selectedMeeting)}
                >
                  <Trash2 size={16} />
                </button>
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
            <button
              className="px-4 py-2 bg-gray-900 text-white rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors"
              onClick={() => setShowAddMeetingModal(true)}
            >
              <PlusCircle size={16} /> Add First Meeting
            </button>
          </div>
        )}
      </div>

      {/* Add Meeting Modal */}
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
              return new Promise<void>((resolve, reject) => {
                createMeetingMutation.mutate(training, {
                  onSuccess: () => {
                    setIsSubmitting(false);
                    resolve();
                  },
                  onError: (error) => {
                    setIsSubmitting(false);
                    console.error("Error creating training:", error);
                    reject(error);
                  },
                });
              });
            } catch (error) {
              setIsSubmitting(false);
              console.error("Error creating training:", error);
              throw error;
            }
          }}
        />
      )}

      {/* Edit Meeting Modal */}
      {showEditMeetingModal && meetingToEdit && (
        <EditMeetingForm
          onClose={() => {
            setShowEditMeetingModal(false);
            setMeetingToEdit(null);
          }}
          isLoading={isSubmitting}
          initialTitle={meetingToEdit.title}
          onSubmit={async (data: { title: string }) => {
            setIsSubmitting(true);
            const updatedMeeting = {
              trainingId: trainingId,
              meetingId: meetingToEdit.id,
              title: data.title,
            };

            try {
              return new Promise<void>((resolve, reject) => {
                updateMeetingMutation.mutate(updatedMeeting, {
                  onSuccess: () => {
                    setIsSubmitting(false);
                    resolve();
                  },
                  onError: (error) => {
                    setIsSubmitting(false);
                    console.error("Error updating meeting:", error);
                    reject(error);
                  },
                });
              });
            } catch (error) {
              setIsSubmitting(false);
              console.error("Error updating meeting:", error);
              throw error;
            }
          }}
        />
      )}

      {/* Delete Meeting Confirmation Modal */}
      {showDeleteMeetingModal && meetingToDelete && (
        <DeleteMeetingConfirm
          onClose={() => {
            setShowDeleteMeetingModal(false);
            setMeetingToDelete(null);
          }}
          isLoading={isSubmitting}
          meetingTitle={meetingToDelete.title}
          onConfirm={async () => {
            setIsSubmitting(true);
            const deleteMeeting = {
              trainingId: trainingId,
              meetingId: meetingToDelete.id,
            };
            try {
              return new Promise<void>((resolve, reject) => {
                deleteMeetingMutation.mutate(deleteMeeting, {
                  onSuccess: () => {
                    setIsSubmitting(false);
                    resolve();
                  },
                  onError: (error) => {
                    setIsSubmitting(false);
                    console.error("Error updating meeting:", error);
                    reject(error);
                  },
                });
              });
            } catch (error) {
              setIsSubmitting(false);
              console.error("Error updating meeting:", error);
              throw error;
            }
          }}
        />
      )}
    </div>
  );
};

export default DetailCoursePage;
