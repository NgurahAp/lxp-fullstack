import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { Quiz } from "../types/quiz";
import { getQuiz } from "../service/quizService";

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
