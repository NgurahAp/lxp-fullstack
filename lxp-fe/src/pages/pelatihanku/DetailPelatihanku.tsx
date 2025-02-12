import { useParams } from "react-router-dom";

export const PelatihankuDetail: React.FC = () => {
  const { trainingId } = useParams<{ trainingId: string }>();

  return <h1>{trainingId}</h1>;
};
