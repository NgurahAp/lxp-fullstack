import { useParams } from "react-router-dom";

export const DetailScore = () => {
  const { trainingId } = useParams<{ trainingId: string }>();

  return (
    <div className="h-screen flex items-center justify-center">
      <h1>{trainingId}</h1>
    </div>
  );
};
