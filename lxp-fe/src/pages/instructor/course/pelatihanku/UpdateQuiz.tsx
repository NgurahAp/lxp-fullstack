import { PlusCircle } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { QuizForm } from "../../../../types/quiz";
import {
  useGetInstructorDetailQuiz,
  useUpdateQuiz,
} from "../../../../hooks/useQuiz";
import LoadingSpinner from "../../../../Components/LoadingSpinner";

const UpdateQuiz: React.FC = () => {
  const { trainingId, meetingId, quizId } = useParams<{
    trainingId: string;
    meetingId: string;
    quizId: string;
  }>();
  const navigate = useNavigate();
  const updateQuizMutation = useUpdateQuiz(trainingId);
  const {
    data: quiz,
    isLoading,
    error,
  } = useGetInstructorDetailQuiz(trainingId, meetingId, quizId);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<QuizForm>({
    title: "",
    questions: [
      { question: "", options: ["", "", "", ""], correctAnswer: 0 },
      { question: "", options: ["", "", "", ""], correctAnswer: 0 },
      { question: "", options: ["", "", "", ""], correctAnswer: 0 },
      { question: "", options: ["", "", "", ""], correctAnswer: 0 },
      { question: "", options: ["", "", "", ""], correctAnswer: 0 },
    ],
  });

  // Populate form data with quiz data when it's loaded
  useEffect(() => {
    if (quiz) {
      setFormData({
        title: quiz.title,
        questions: quiz.questions.map((q) => ({
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
        })),
      });
    }
  }, [quiz]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      title: e.target.value,
    });
  };

  const handleQuestionChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      question: e.target.value,
    };
    setFormData({
      ...formData,
      questions: updatedQuestions,
    });
  };

  const handleOptionChange = (
    questionIndex: number,
    optionIndex: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const updatedQuestions = [...formData.questions];
    const updatedOptions = [...updatedQuestions[questionIndex].options];
    updatedOptions[optionIndex] = e.target.value;
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      options: updatedOptions,
    };
    setFormData({
      ...formData,
      questions: updatedQuestions,
    });
  };

  const handleCorrectAnswerChange = (
    questionIndex: number,
    optionIndex: number
  ) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      correctAnswer: optionIndex,
    };
    setFormData({
      ...formData,
      questions: updatedQuestions,
    });
  };

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        {
          question: "",
          options: ["", "", "", ""],
          correctAnswer: 0,
        },
      ],
    });
  };

  const removeQuestion = (index: number) => {
    if (formData.questions.length > 1) {
      const updatedQuestions = formData.questions.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        questions: updatedQuestions,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      updateQuizMutation.mutate({ trainingId, meetingId, quizId, formData });
    } catch (error) {
      console.error("Error creating training:", error);
    }
  };

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

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Header */}
      <div className="bg-white shadow mx-4">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Edit Quiz</h1>
              <p className="text-gray-600 mt-1">
                Edit pertanyaan dan pilihan jawaban
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50 text-gray-700 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Kembali
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit}>
          {/* Quiz Info Card */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">Informasi Quiz</h2>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Judul Quiz <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={handleTitleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                  placeholder="Masukkan judul quiz"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="duration"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Durasi (menit)
                  </label>
                  <input
                    type="number"
                    id="duration"
                    defaultValue={10}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                    placeholder="Durasi dalam menit"
                    readOnly
                  />
                </div>
                <div>
                  <label
                    htmlFor="passingScore"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nilai Lulus (%)
                  </label>
                  <input
                    type="number"
                    id="passingScore"
                    defaultValue={80}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                    placeholder="Nilai kelulusan"
                    min="0"
                    max="100"
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Questions Section */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="border-b p-6 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Daftar Pertanyaan</h2>
              <div>
                <button
                  type="button"
                  onClick={addQuestion}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Tambah Pertanyaan
                </button>
              </div>
            </div>

            <div className="divide-y">
              {formData.questions.map((question, questionIndex) => (
                <div key={questionIndex} className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start w-full mr-5">
                      <div className="mr-3 h-7 px-2 py-1 border border-gray-300 rounded-lg flex items-center gap-2 text-gray-700">
                        {questionIndex + 1}
                      </div>
                      <div className="w-full">
                        <textarea
                          value={question.question}
                          onChange={(e) =>
                            handleQuestionChange(questionIndex, e)
                          }
                          className="w-full px-3 ml-1 py-2 border border-gray-300 rounded-md focus:outline-none"
                          placeholder="Masukkan pertanyaan"
                          rows={2}
                          required
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeQuestion(questionIndex)}
                      className="text-red-500 p-1 hover:text-red-700"
                      disabled={formData.questions.length === 1}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="mt-4 pl-10">
                    <div className="space-y-3 mb-4">
                      {question.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className={`p-3 rounded-md border ${
                            optionIndex === question.correctAnswer
                              ? "bg-green-50 border-green-300"
                              : "bg-gray-50 border-gray-200"
                          }`}
                        >
                          <div className="flex items-center">
                            <div className="mr-2">
                              <input
                                type="radio"
                                name={`correctAnswer-${questionIndex}`}
                                checked={optionIndex === question.correctAnswer}
                                onChange={() =>
                                  handleCorrectAnswerChange(
                                    questionIndex,
                                    optionIndex
                                  )
                                }
                                className="form-radio h-4 w-4 text-green-600"
                              />
                            </div>
                            <div className="flex-grow">
                              <input
                                type="text"
                                value={option}
                                onChange={(e) =>
                                  handleOptionChange(
                                    questionIndex,
                                    optionIndex,
                                    e
                                  )
                                }
                                className="w-full px-3 py-2 bg-transparent border-none focus:outline-none"
                                placeholder={`Pilihan ${optionIndex + 1}`}
                                required
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Menyimpan...
                </>
              ) : (
                <div className="flex gap-2">
                  <PlusCircle size={16} />
                  Update Quiz
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateQuiz;
