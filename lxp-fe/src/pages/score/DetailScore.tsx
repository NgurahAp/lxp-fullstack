import { useParams } from "react-router-dom";
import { useGetScore } from "../../hooks/useScore";
import LoadingSpinner from "../../Components/LoadingSpinner";

export const DetailScore = () => {
  const { trainingId } = useParams<{ trainingId: string }>();
  const { data, isLoading, error } = useGetScore(trainingId);

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
    <div className="h-screen flex items-center justify-center">
      <h1>{trainingId}</h1>
    </div>
  );
};
