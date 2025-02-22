import { useParams } from "react-router-dom";
import { useGetQuizQuestion } from "../../hooks/useQuiz";
import LoadingSpinner from "../../Components/LoadingSpinner";

export const QuizAttempt = () => {
  const { meetingId, quizId } = useParams<{
    meetingId: string;
    quizId: string;
  }>();

  const { data, isLoading, error } = useGetQuizQuestion(meetingId, quizId);

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

  // console.log(data);

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h1>{meetingId}</h1>
      <h1>{quizId}</h1>
    </div>
  );
};
