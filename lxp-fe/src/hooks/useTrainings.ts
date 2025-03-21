import { useQuery, UseQueryResult } from "@tanstack/react-query";
import {
  DetailTrainingData,
  GetTrainingInstructorResponse,
  TrainingResponse,
} from "../types/training";
import {
  getDetailTraining,
  getTrainings,
  getTrainingsInstructor,
} from "../service/trainingService.ts";

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

export const useGetTrainingsInstructor = (): UseQueryResult<
  GetTrainingInstructorResponse,
  Error
> => {
  return useQuery({
    queryKey: ["trainingInstructor"],
    queryFn: async () => {
      const response = await getTrainingsInstructor();
      const trainingData = response;
      return trainingData;
    },
  });
};

export const useGetDetailTrainings = (
  trainingId: string | undefined
): UseQueryResult<DetailTrainingData, Error> => {
  return useQuery({
    queryKey: ["detailTraining"],
    queryFn: async () => {
      const response = await getDetailTraining(trainingId);
      const detailTrainingData = response.data;

      return detailTrainingData;
    },
  });
};
