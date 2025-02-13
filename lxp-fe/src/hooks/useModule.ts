import { useMutation, useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query";
import { Module } from "../types/module";
import { getModule, submitModuleAnswer } from "../service/moduleService";
import toast from "react-hot-toast";

export const useGetModule = (
  meetingId: string | undefined,
  moduleId: string | undefined
): UseQueryResult<Module, Error> => {
  return useQuery({
    queryKey: ["module"],
    queryFn: async () => {
      const response = await getModule(meetingId, moduleId);
      const moduleData = response.data;

      return moduleData;
    },
  });
};

interface SubmitModuleAnswerParams {
  moduleId: string;
  moduleAnswer: string;
}

export const useSubmitModuleAnswer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ moduleId, moduleAnswer }: SubmitModuleAnswerParams) =>
      submitModuleAnswer(moduleId, moduleAnswer),

    onSuccess: (data, variables) => {
      // Invalidate related queries to refetch updated data
      queryClient.invalidateQueries({
        queryKey: ["module", variables.moduleId],
      });

      // Show success notification
      toast.success("Rangkuman berhasil dikirim");
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