import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import {
  createModule,
  deleteModule,
  getModule,
  submitModuleAnswer,
  updateModule,
} from "../service/moduleService";
import toast from "react-hot-toast";
import {
  CreateModuleParams,
  DeleteModuleParams,
  ModuleData,
  ModuleResponse,
  UpdateModuleParams,
} from "../types/module";

export const useGetModule = (
  meetingId: string | undefined,
  moduleId: string | undefined
): UseQueryResult<ModuleData, Error> => {
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
  answer: string;
}

export const useSubmitModuleAnswer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ moduleId, answer }: SubmitModuleAnswerParams) =>
      submitModuleAnswer(moduleId, answer),

    onSuccess: (_, variables) => {
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

export const useCreateModule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ meetingId, payload }: CreateModuleParams) =>
      createModule({ meetingId, payload }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["detailTrainingInstructor"],
      });

      // Show success notification
      toast.success("Module berhasil ditambah");
    },

    onError: (error: Error) => {
      // Show error notification with specific message
      console.log(error.message);
      toast.error("Terjadi kesalahan saat menambah modul");
    },
  });
};

export const useUpdateModule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      trainingId,
      meetingId,
      moduleId,
      payload,
    }: UpdateModuleParams) =>
      updateModule({ trainingId, meetingId, moduleId, payload }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["detailTrainingInstructor"],
      });
      toast.success("Module berhasil diedit");
    },

    onError: (error: Error) => {
      console.log(error.message);
      toast.error("Terjadi kesalahan saat mengedit modul");
    },
  });
};

export const useDeleteModule = () => {
  const queryClient = useQueryClient();

  return useMutation<ModuleResponse, Error, DeleteModuleParams>({
    mutationFn: (params) => deleteModule(params),

    onSuccess: () => {
      // Invalidate related queries to refetch updated data
      queryClient.invalidateQueries({
        queryKey: ["detailTrainingInstructor"],
      });

      // Show success notification
      toast.success("Module berhasi dihapus");
    },

    onError: (error: Error) => {
      console.log(error.message);
      toast.error("Gagal menghapus module");
    },
  });
};
