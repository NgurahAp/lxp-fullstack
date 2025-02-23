import { useParams } from "react-router-dom";
import { useGetTask } from "../../hooks/useTask";
import LoadingSpinner from "../../Components/LoadingSpinner";

export const Task = () => {
  const { meetingId, taskId } = useParams<{
    meetingId: string;
    taskId: string;
  }>();

  const { data, isLoading, error } = useGetTask(meetingId, taskId);

  if (isLoading) {
    return <LoadingSpinner text="Loading..." />;
  }

  if (error) {
    return (
      <div className="min-h-[85vh] w-screen flex items-center justify-center">
        Error loading data
      </div>
    );
  }

  console.log(data);

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h1>{meetingId}</h1>
      <h1>{taskId}</h1>
    </div>
  );
};
