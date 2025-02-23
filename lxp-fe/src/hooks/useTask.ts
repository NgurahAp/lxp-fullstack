import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { TaskData } from "../types/task";
import { getTask } from "../service/taskService";

export const useGetTask = (
  meetingId: string | undefined,
  taskId: string | undefined
): UseQueryResult<TaskData, Error> => {
  return useQuery({
    queryKey: ["task", meetingId, taskId],
    queryFn: async () => {
      const response = await getTask(meetingId, taskId);
      const taskData = response.data;
      return taskData;
    },
    enabled: !!meetingId && !!taskId,
  });
};
