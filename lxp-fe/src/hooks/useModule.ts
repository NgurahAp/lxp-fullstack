import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { Module } from "../types/module";
import { getModule } from "../service/moduleService";

export const useGetModule = (
  meetingId: string | undefined,
  moduleId: string | undefined
): UseQueryResult<Module, Error> => {
  return useQuery({
    queryKey: ["module"],
    queryFn: async () => {
      const response = await getModule(meetingId, moduleId);
      const moduleData = response.data;

      return moduleData;
    },
  });
};
