import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { StudentsResponse } from "../types/students";
import { getStudents } from "../service/studentsService";

export const useGetStudents = (): UseQueryResult<StudentsResponse, Error> => {
  return useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      const response = await getStudents();

      return response;
    },
  });
};
