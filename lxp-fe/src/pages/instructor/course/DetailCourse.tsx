// DetailCoursePage.tsx - Main Component
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGetInstructorDetailTrainings } from "../../../hooks/useTrainings";
import {
  useCreateMeeting,
  useDeleteMeeting,
  useUpdateMeeting,
} from "../../../hooks/useMeeting";
import LoadingSpinner from "../../../Components/LoadingSpinner";
import { Meeting } from "../../../types/training";
import AddMeetingForm from "./components/AddMeeting";
import EditMeetingForm from "./components/EditMeeting";
import DeleteMeetingConfirm from "./components/DeleteMeeting";
import EmptyMeetingState from "./components/section/EmptyMeetingState";
import MainContent from "./components/section/MeetingContent";
import MeetingSidebar from "./components/section/MeetingSidebar";
import MeetingHeader from "./components/section/MeetingHeader";

interface AddMeetingData {
  title: string;
}

const DetailCoursePage: React.FC = () => {
  const { trainingId } = useParams<{ trainingId: string }>();
  const { data, isLoading, error } =
    useGetInstructorDetailTrainings(trainingId);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [showAddMeetingModal, setShowAddMeetingModal] =
    useState<boolean>(false);
  const [showEditMeetingModal, setShowEditMeetingModal] =
    useState<boolean>(false);
  const [showDeleteMeetingModal, setShowDeleteMeetingModal] =
    useState<boolean>(false);
  const [meetingToEdit, setMeetingToEdit] = useState<Meeting | null>(null);
  const [meetingToDelete, setMeetingToDelete] = useState<Meeting | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Mutations
  const createMeetingMutation = useCreateMeeting();
  const updateMeetingMutation = useUpdateMeeting();
  const deleteMeetingMutation = useDeleteMeeting();

  // Select first meeting when data loads
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

  if (!data) {
    return (
      <div className="min-h-[85vh] w-screen flex items-center justify-center">
        No course data available
      </div>
    );
  }

  const handleEditMeeting = (meeting: Meeting): void => {
    setMeetingToEdit(meeting);
    setShowEditMeetingModal(true);
  };

  const handleDeleteMeeting = (meeting: Meeting): void => {
    setMeetingToDelete(meeting);
    setShowDeleteMeetingModal(true);
  };

  const handleAddMeeting = async (formData: AddMeetingData): Promise<void> => {
    setIsSubmitting(true);
    const meeting = {
      trainingId: trainingId || "",
      title: formData.title,
    };

    try {
      return new Promise<void>((resolve, reject) => {
        createMeetingMutation.mutate(meeting, {
          onSuccess: () => {
            setIsSubmitting(false);
            resolve();
          },
          onError: (error) => {
            setIsSubmitting(false);
            console.error("Error creating meeting:", error);
            reject(error);
          },
        });
      });
    } catch (error) {
      setIsSubmitting(false);
      console.error("Error creating meeting:", error);
      throw error;
    }
  };

  const handleUpdateMeeting = async (
    formData: AddMeetingData
  ): Promise<void> => {
    if (!meetingToEdit) return;

    setIsSubmitting(true);
    const updatedMeeting = {
      trainingId,
      meetingId: meetingToEdit.id,
      title: formData.title,
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
  };

  const handleConfirmDelete = async (): Promise<void> => {
    if (!meetingToDelete) return;

    setIsSubmitting(true);
    const deleteMeeting = {
      trainingId,
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
            console.error("Error deleting meeting:", error);
            reject(error);
          },
        });
      });
    } catch (error) {
      setIsSubmitting(false);
      console.error("Error deleting meeting:", error);
      throw error;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      {/* Course Header */}
      <MeetingHeader
        data={data}
        onAddMeeting={() => setShowAddMeetingModal(true)}
      />

      {/* Course Content */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar - Meetings Section */}
        <MeetingSidebar
          meetings={data.meetings}
          selectedMeeting={selectedMeeting}
          onSelectMeeting={setSelectedMeeting}
          onAddMeeting={() => setShowAddMeetingModal(true)}
        />

        {/* Main Content */}
        {selectedMeeting ? (
          <MainContent
            meeting={selectedMeeting}
            onEditMeeting={handleEditMeeting}
            onDeleteMeeting={handleDeleteMeeting}
          />
        ) : (
          <EmptyMeetingState
            onAddMeeting={() => setShowAddMeetingModal(true)}
          />
        )}
      </div>

      {/* Modals */}
      {showAddMeetingModal && (
        <AddMeetingForm
          onClose={() => setShowAddMeetingModal(false)}
          isLoading={isSubmitting}
          onSubmit={handleAddMeeting}
        />
      )}

      {showEditMeetingModal && meetingToEdit && (
        <EditMeetingForm
          onClose={() => {
            setShowEditMeetingModal(false);
            setMeetingToEdit(null);
          }}
          isLoading={isSubmitting}
          initialTitle={meetingToEdit.title}
          onSubmit={handleUpdateMeeting}
        />
      )}

      {showDeleteMeetingModal && meetingToDelete && (
        <DeleteMeetingConfirm
          onClose={() => {
            setShowDeleteMeetingModal(false);
            setMeetingToDelete(null);
          }}
          isLoading={isSubmitting}
          meetingTitle={meetingToDelete.title}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
};

export default DetailCoursePage;
