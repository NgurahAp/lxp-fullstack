import { useNavigate, useParams } from "react-router-dom";
import { NavbarQuiz } from "./components/NavbarQuiz";
import { useState } from "react";
import CountdownTimer from "./components/CountdownTimer";
import { ConfirmAttemptQuizDialog } from "./components/ConfirmAttemptDialog";
import LoadingSpinner from "../../../Components/LoadingSpinner";
import { useGetQuizQuestion, useSubmitQuiz } from "../../../hooks/useQuiz";

export const QuizAttempt = () => {
  const { meetingId, quizId } = useParams<{
    meetingId: string;
    quizId: string;
  }>();
  const { data, isLoading, error } = useGetQuizQuestion(meetingId, quizId);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: number;
  }>({});
  const [isDialogOpen, setDialogOpen] = useState(false);
  const submitQuizMutation = useSubmitQuiz();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Early returns for loading and error states
  if (isLoading) {
    return <LoadingSpinner text="Loading..." />;
  }

  if (error) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center">
        Error loading data
      </div>
    );
  }

  // Safely access questions array
  const questions = data?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  const navigateToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const handleAnswerSelect = (answerId: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: answerId,
    }));
  };

  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstQuestion) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleTimesUp = () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const answers = questions.map((_, index) => ({
        questionIndex: index,
        selectedAnswer: selectedAnswers[index] ?? null, // Handle undefined case
      }));

      // Use await here if you're using async/await
      submitQuizMutation.mutate({
        quizId: quizId!,
        answers,
        trainingUserId: data?.trainingUserId,
      });

      navigate(`/quiz/${meetingId}/${quizId}`);
    } catch (error) {
      console.error("Error submitting quiz:", error);
      setIsSubmitting(false); // Reset on error
    }
  };

  const handleQuizSubmit = () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const answers = questions.map((_, index) => ({
        questionIndex: index,
        ...(selectedAnswers[index] !== undefined && {
          selectedAnswer: selectedAnswers[index],
        }),
      }));

      submitQuizMutation.mutate({
        quizId: quizId!,
        answers,
        trainingUserId: data?.trainingUserId,
      });

      setDialogOpen(false);
      navigate(`/quiz/${meetingId}/${quizId}`);
    } catch (error) {
      console.error("Error submitting quiz:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <NavbarQuiz />
      <div className="min-h-[85vh] w-screen flex flex-col md:pt-36 pt-24 md:px-24 px-8 bg-gray-100">
        {/* Quiz Info */}
        <div className="bg-white flex flex-col mt-5 px-4 md:px-8 md:h-36 md:py-0 py-4 justify-center rounded-lg">
          <h1 className="text-xl md:text-2xl font-semibold pb-3">
            {data?.title}
          </h1>
          <p className="text-sm md:text-base">Tipe: Quiz</p>
          <p className="text-sm md:text-base">Durasi: 5 menit</p>
        </div>

        {/* Question List with Answer Status */}
        <div className="bg-white flex flex-col mt-5 px-4 md:px-8 md:h-28 h-full py-4 md:py-0 justify-center rounded-lg">
          <h1 className="font-bold mb-3">Daftar Soal</h1>
          <div className="flex flex-wrap md:justify-normal justify-center gap-1 md:gap-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => navigateToQuestion(index)}
                className={`w-8 h-8 text-sm flex items-center justify-center border rounded
          ${
            selectedAnswers[index] !== undefined
              ? "bg-blue-500 text-white"
              : "bg-white text-gray-700"
          } ${index === currentQuestionIndex ? "ring-1 ring-blue-500" : ""}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Quiz Question */}
        <div className="bg-white p-6 mt-5 rounded-lg shadow-lg">
          <h1 className="text-end text-red-500 font-bold text-xs pb-3">
            Sisa waktu:{" "}
            <CountdownTimer initialDuration={6000} onTimeUp={handleTimesUp} />
          </h1>
          <h2 className="text-lg font-semibold">{currentQuestion.question}</h2>
          <p className="md:pt-2 pb-4 md:pb-7 text-xs text-gray-500">
            *Pilih satu
          </p>
          <div className="space-y-4 md:space-y-5">
            {currentQuestion.options.map((answer, index) => (
              <label key={index} className="block p-3 border rounded">
                <input
                  type="radio"
                  name="answer"
                  value={index}
                  checked={selectedAnswers[currentQuestionIndex] === index}
                  onChange={() => handleAnswerSelect(index)}
                  className="mr-2 text-sm"
                />
                <span className="text-sm">{answer}</span>
              </label>
            ))}
          </div>
          <div className="flex justify-between md:justify-end gap-5 pt-5 md:pt-10">
            <button
              onClick={handlePrevious}
              className={`px-6 py-2 rounded-lg ${
                isFirstQuestion
                  ? "hidden"
                  : "bg-white border-blue-500 border text-sm text-blue-500 hover:bg-blue-500 hover:text-white"
              }`}
            >
              Sebelumnya
            </button>
            {isLastQuestion ? (
              <button
                onClick={() => setDialogOpen(true)}
                className="bg-green-500 px-6 py-2 text-sm rounded-lg text-white hover:bg-green-600"
              >
                Selesai
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="bg-blue-500 px-6 py-2 text-sm rounded-lg text-white hover:bg-blue-600"
              >
                Selanjutnya
              </button>
            )}
          </div>
        </div>

        {isDialogOpen && (
          <ConfirmAttemptQuizDialog
            onClose={() => setDialogOpen(false)}
            onSubmit={handleQuizSubmit}
          />
        )}
      </div>
    </>
  );
};
