import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { TrainingResponse } from "../types/training";
import { getTrainings } from "../service/trainingService.ts";

export const useGetTrainings = (): UseQueryResult<TrainingResponse, Error> => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await getTrainings();
      const userData = response.data;

      return userData;
    },
  });
};
  