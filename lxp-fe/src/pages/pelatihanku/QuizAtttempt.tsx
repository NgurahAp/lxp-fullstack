import { useParams } from "react-router-dom";

export const QuizAttempt = () => {
  const { meetingId, quizId } = useParams<{
    meetingId: string;
    quizId: string;
  }>();

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h1>{meetingId}</h1>
      <h1>{quizId}</h1>
    </div>
  );
};
