import { useMutation, useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query";
import { SubmitTaskRequest, TaskData } from "../types/task";
import { getTask, submitTaskAnswer } from "../service/taskService";
import toast from "react-hot-toast";

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