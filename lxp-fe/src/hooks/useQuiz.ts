import {
  useMutation,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query";
import { Quiz, QuizQuestion, QuizSubmissionParams } from "../types/quiz";
import { getQuiz, getQuizQuestion, submitQuiz } from "../service/quizService";
import toast from "react-hot-toast";

export const useGetQuiz = (
  meetingId: string | undefined,
  quizId: string | undefined
): UseQueryResult<Quiz, Error> => {
  return useQuery({
    queryKey: ["quiz"],
    queryFn: async () => {
      const response = await getQuiz(meetingId, quizId);
      const quizData = response.data;

      return quizData;
    },
  });
};

export const useGetQuizQuestion = (
  meetingId: string | undefined,
  quizId: string | undefined
): UseQueryResult<QuizQuestion, Error> => {
  return useQuery({
    queryKey: ["quizQuestion"],
    queryFn: async () => {
      const response = await getQuizQuestion(meetingId, quizId);
      const quizQuestionData = response.data;

      return quizQuestionData;
    },
  });
};

export const useSubmitQuiz = () => {
  return useMutation({
    mutationFn: ({ quizId, answers }: QuizSubmissionParams) =>
      submitQuiz(quizId, { answers }),

    onSuccess: () => {
      // Show success notification
      toast.success("Quiz berhasil dikumpulkan");
    },

    onError: (error: Error) => {
      // Show error notification
      console.log(error.message);
      toast.error("Gagal mengumpulkan quiz");
    },

    // Retry configuration
    retry: (failureCount, error) => {
      // Only retry network errors, not validation or not found errors
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
