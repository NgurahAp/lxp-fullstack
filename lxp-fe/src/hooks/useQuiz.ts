import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { Quiz, QuizQuestion } from "../types/quiz";
import { getQuiz, getQuizQuestion } from "../service/quizService";

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
