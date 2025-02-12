import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { DetailTrainingResponse, TrainingResponse } from "../types/training";
import { getDetailTraining, getTrainings } from "../service/trainingService.ts";

export const useGetTrainings = (): UseQueryResult<TrainingResponse, Error> => {
  return useQuery({
    queryKey: ["training"],
    queryFn: async () => {
      const response = await getTrainings();
      const trainingData = response.data;

      return trainingData;
    },
  });
};

export const useGetDetailTrainings = (
  trainingId: string | undefined
): UseQueryResult<DetailTrainingResponse, Error> => {
  return useQuery({
    queryKey: ["detailTraining"],
    queryFn: async () => {
      const response = await getDetailTraining(trainingId);
      const detailTrainingData = response.data;

      return detailTrainingData;
    },
  });
};
