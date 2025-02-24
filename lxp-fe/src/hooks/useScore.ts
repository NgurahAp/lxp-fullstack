import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ScoreData } from "../types/score";
import { getScore } from "../service/scoreService";

export const useGetScore = (
  trainingId: string | undefined
): UseQueryResult<ScoreData, Error> => {
  return useQuery({
    queryKey: ["score", trainingId],
    queryFn: async () => {
      const response = await getScore(trainingId);
      const quizData = response.data;
      return quizData;
    },
    enabled: !!trainingId,
  });
};
