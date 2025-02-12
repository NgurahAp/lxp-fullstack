import { useParams } from "react-router-dom";

export const Module = () => {
  const { meetingId, moduleId } = useParams<{
    meetingId: string;
    moduleId: string;
  }>();

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <h1>{meetingId}</h1> 
      <h1>{moduleId}</h1>
    </div>
  );
};
