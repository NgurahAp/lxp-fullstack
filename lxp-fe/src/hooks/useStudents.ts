import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import {
  DetailStudentResponse,
  ModuleScoreSubmission,
  StudentsResponse,
  TaskScoreSubmission,
} from "../types/students";
import {
  getDetailStudent,
  getStudents,
  submitModuleScore,
  submitTaskScore,
} from "../service/studentsService";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ModuleResponse } from "../types/module";
import { TaskResponse } from "../types/task";

export const useGetStudents = (): UseQueryResult<StudentsResponse, Error> => {
  return useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      const response = await getStudents();

      return response;
    },
  });
};

export const useGetDetailStudent = (
  studentId: string | undefined
): UseQueryResult<DetailStudentResponse, Error> => {
  return useQuery({
    queryKey: ["detailStudent"],
    queryFn: async () => {
      const response = await getDetailStudent(studentId);

      return response;
    },
  });
};

export const useSubmitModuleScore = (userId: string | undefined) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation<ModuleResponse, Error, ModuleScoreSubmission>({
    mutationFn: (params) => submitModuleScore(params),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["detailStudent"],
      });

      toast.success("Module berhasil dinilai");
      navigate(`/instructorStudent/submission/${userId}`);
    },

    onError: (error: Error) => {
      console.log(error.message);
      toast.error("Terjadi kesalahan saat mengedit quiz");
    },
  });
};

export const useSubmitTaskScore = (userId: string | undefined) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation<TaskResponse, Error, TaskScoreSubmission>({
    mutationFn: (params) => submitTaskScore(params),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["detailStudent"],
      });

      toast.success("Module berhasil dinilai");
      navigate(`/instructorStudent/submission/${userId}`);
    },

    onError: (error: Error) => {
      console.log(error.message);
      toast.error("Terjadi kesalahan saat mengedit quiz");
    },
  });
};
