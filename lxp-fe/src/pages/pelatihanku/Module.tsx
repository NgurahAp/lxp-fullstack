import { useParams } from "react-router-dom";
import { useGetModule } from "../../hooks/useModule";

export const Module = () => {
  const { meetingId, moduleId } = useParams<{
    meetingId: string;
    moduleId: string;
  }>();

  const { data, isLoading, error } = useGetModule(meetingId, moduleId);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  console.log(data);

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <h1>{meetingId}</h1>
      <h1>{moduleId}</h1>
    </div>
  );
};
