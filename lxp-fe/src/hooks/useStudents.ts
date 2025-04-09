import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { DetailStudentResponse, StudentsResponse } from "../types/students";
import { getDetailStudent, getStudents } from "../service/studentsService";

export const useGetStudents = (): UseQueryResult<StudentsResponse, Error> => {
  return useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      const response = await getStudents();

      return response;
    },
  });
};

export const useGetDetailStudent = (
  studentId: string | undefined
): UseQueryResult<DetailStudentResponse, Error> => {
  return useQuery({
    queryKey: ["detailStudent"],
    queryFn: async () => {
      const response = await getDetailStudent(studentId);

      return response;
    },
  });
};
