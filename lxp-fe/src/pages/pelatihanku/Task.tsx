import { useParams } from "react-router-dom";

export const Task = () => {
  const { meetingId, taskId } = useParams<{
    meetingId: string;
    taskId: string;
  }>();

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h1>{meetingId}</h1>
      <h1>{taskId}</h1>
    </div>
  );
};
