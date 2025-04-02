import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import {
  CreateQuizParams,
  DetailQuizInstructorData,
  QuizData,
  QuizQuestion,
  QuizSubmissionParams,
} from "../types/quiz";
import {
  createQuiz,
  getDetailQuizInstructor,
  getQuiz,
  getQuizQuestion,
  submitQuiz,
} from "../service/quizService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

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

export const useGetInstructorDetailQuiz = (
  trainingId: string | undefined,
  meetingId: string | undefined,
  quizId: string | undefined
): UseQueryResult<DetailQuizInstructorData, Error> => {
  return useQuery({
    queryKey: ["InstructorDetailQuiz", trainingId, meetingId, quizId],
    queryFn: async () => {
      const response = await getDetailQuizInstructor(
        trainingId,
        meetingId,
        quizId
      );
      const quizData = response.data;
      return quizData;
    },
    enabled: !!trainingId && !!meetingId && !!quizId,
  });
};

export const useSubmitQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ quizId, answers, trainingUserId }: QuizSubmissionParams) =>
      submitQuiz(quizId, { answers, trainingUserId }),

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

export const useCreateQuiz = (trainingId: string | undefined) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ meetingId, formData }: CreateQuizParams) =>
      createQuiz({ meetingId, formData }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["detailTrainingInstructor"],
      });

      // Show success notification
      toast.success("Module berhasil ditambah");
      navigate(`/instructorCourse/${trainingId}`);
    },

    onError: (error: Error) => {
      // Show error notification with specific message
      console.log(error.message);
      toast.error("Terjadi kesalahan saat menambah modul");
    },
  });
};
