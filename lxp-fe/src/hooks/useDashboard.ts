import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { InstructorDashboardData } from "../types/dashboard";
import { getInstructorDashboard } from "../service/dashboardService";

export const useGetInstructorDashboard = (): UseQueryResult<
  InstructorDashboardData,
  Error
> => {
  return useQuery({
    queryKey: ["instructorDashboard"],
    queryFn: async () => {
      const response = await getInstructorDashboard();
      const instructorDashboard = response.data;

      return instructorDashboard;
    },
  });
};
