import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import {  QuizData, QuizQuestion, QuizSubmissionParams } from "../types/quiz";
import { getQuiz, getQuizQuestion, submitQuiz } from "../service/quizService";
import toast from "react-hot-toast";

export const useGetQuiz = (
  meetingId: string | undefined,
  quizId: string | undefined
): UseQueryResult<QuizData, Error> => {
  return useQuery({
    queryKey: ["quiz", meetingId, quizId],
    queryFn: async () => {
      const response = await getQuiz(meetingId, quizId);
      const quizData = response.data;
      return quizData;
    },
    enabled: !!meetingId && !!quizId,
  });
};

export const useGetQuizQuestion = (
  meetingId: string | undefined,
  quizId: string | undefined
): UseQueryResult<QuizQuestion, Error> => {
  return useQuery({
    queryKey: ["quizQuestion", meetingId, quizId],
    queryFn: async () => {
      const response = await getQuizQuestion(meetingId, quizId);
      const quizQuestionData = response.data;
      return quizQuestionData;
    },
    enabled: !!meetingId && !!quizId,
  });
};

export const useSubmitQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ quizId, answers }: QuizSubmissionParams) =>
      submitQuiz(quizId, { answers }),

    onSuccess: () => {
      // Invalidate related queries to refetch updated data
      queryClient.invalidateQueries({
        queryKey: ["quiz"],
      });

      // Show success notification
      toast.success("Quiz berhasil dikumpulkan");
    },

    onError: (error: Error) => {
      console.log(error.message);
      toast.error("Gagal mengumpulkan quiz");
    },

    retry: (failureCount, error) => {
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
