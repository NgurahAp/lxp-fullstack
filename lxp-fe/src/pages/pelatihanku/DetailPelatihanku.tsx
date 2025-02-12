import { useParams } from "react-router-dom";
import { useGetDetailTrainings } from "../../hooks/useTrainings";

export const PelatihankuDetail: React.FC = () => {
  const { trainingId } = useParams<{ trainingId: string }>();
  const { data, isLoading, error } = useGetDetailTrainings(trainingId);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  console.log(data);

  return (
    <div className="h-screen flex items-center justify-center">
      <h1>{trainingId}</h1>
    </div>
  );
};
