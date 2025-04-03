import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import { SubmitTaskRequest, TaskData, UpdateTaskParams } from "../types/task";
import {
  getInstructorDetailTask,
  getTask,
  submitTaskAnswer,
  updateTask,
} from "../service/taskService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const useGetTask = (
  meetingId: string | undefined,
  taskId: string | undefined
): UseQueryResult<TaskData, Error> => {
  return useQuery({
    queryKey: ["task", meetingId, taskId],
    queryFn: async () => {
      const response = await getTask(meetingId, taskId);
      const taskData = response.data;
      return taskData;
    },
    enabled: !!meetingId && !!taskId,
  });
};

export const useSubmitTaskAnswer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, file }: SubmitTaskRequest) =>
      submitTaskAnswer({ taskId, file }),

    onSuccess: () => {
      // Invalidate related queries to refetch updated data
      queryClient.invalidateQueries({
        queryKey: ["task"],
      });

      // Show success notification
      toast.success("Tugas berhasil dikirim");
    },

    onError: (error: Error) => {
      // Show error notification with specific message
      console.log(error.message);
      toast.error("Terjadi kesalahan saat mengirim rangkuman");
    },

    // Retry configuration
    retry: (failureCount, error) => {
      // Only retry network errors, not validation errors
      if (
        error.message.includes("tidak ditemukan") ||
        error.message.includes("validasi")
      ) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

export const useGetInstructorDetailTask = (
  trainingId: string | undefined,
  meetingId: string | undefined,
  taskId: string | undefined
): UseQueryResult<TaskData, Error> => {
  return useQuery({
    queryKey: ["task", meetingId, taskId],
    queryFn: async () => {
      const response = await getInstructorDetailTask(
        trainingId,
        meetingId,
        taskId
      );
      const taskData = response.data;
      return taskData;
    },
    enabled: !!meetingId && !!taskId,
  });
};

export const useUpdateTask = (trainingId: string | undefined) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({
      trainingId,
      meetingId,
      taskId,
      formData,
    }: UpdateTaskParams) =>
      updateTask({ trainingId, meetingId, taskId, formData }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["detailTrainingInstructor"],
      });

      // Show success notification
      toast.success("Quiz berhasil ditambah");
      navigate(`/instructorCourse/${trainingId}`);
    },

    onError: (error: Error) => {
      // Show error notification with specific message
      console.log(error.message);
      toast.error("Terjadi kesalahan saat mengedit quiz");
    },
  });
};
