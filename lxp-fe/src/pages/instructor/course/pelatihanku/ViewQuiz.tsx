import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LoadingSpinner from "../../../../Components/LoadingSpinner";
import { useGetInstructorDetailQuiz } from "../../../../hooks/useQuiz";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizData {
  id: string;
  title: string;
  questions: QuizQuestion[];
  createdAt: string;
  updatedAt: string;
  meeting: {
    id: string;
    title: string;
    meetingDate: string | null;
    training: {
      id: string;
      title: string;
      description: string;
    };
  };
}

const InstructorQuiz: React.FC = () => {
  const { trainingId, meetingId, quizId } = useParams<{
    trainingId: string;
    meetingId: string;
    quizId: string;
  }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedQuestions, setExpandedQuestions] = useState<
    Record<number, boolean>
  >({});

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      // Use the actual API response structure
      const apiResponse = {
        data: {
          id: "c04258ae-9322-421a-8e41-cbb57f77aa9f",
          title: "Quiz - Sesi 2",
          createdAt: "2025-04-02T10:06:50.145Z",
          updatedAt: "2025-04-02T10:06:50.145Z",
          meeting: {
            id: "7a0811b5-32ed-40a6-9d33-00cca74975af",
            title: "Sesi 1 - BSI RBC Peran dan Kompetensi anti fraud DP",
            meetingDate: null,
            training: {
              id: "1a0c7aaf-c3dc-4b82-9bbe-edf0f7bb0c4f",
              title:
                "Level Up Pencegahan dan Deteksi Dini Terhadap Potensi Fraud Untuk Pegawai RBC",
              description:
                'Training "Level Up Pencegahan dan Deteksi Dini Terhadap Potensi Fraud untuk Pegawai RBC" bertujuan untuk meningkatkan kesadaran dan keterampilan pegawai dalam mengenali, mencegah, dan mendeteksi potensi fraud sejak dini. Peserta akan memahami jenis-jenis fraud, indikator utama kecurangan, serta strategi pencegahan berbasis kebijakan dan teknologi melalui studi kasus serta simulasi. Dengan pelatihan ini, pegawai diharapkan lebih proaktif dalam menjaga integritas dan transparansi di lingkungan kerja.',
            },
          },
          submission: {},
        },
      };

      const dummyQuiz: QuizData = {
        ...apiResponse.data,
        questions: [
          {
            options: [
              "Menjaga bahasa tubuh yang kaku",
              "Menghindari kontak mata",
              "Memahami perbedaan budaya dan menyesuaikan komunikasi",
              "Menggunakan satu gaya komunikasi yang sama untuk semua orang",
            ],
            question:
              "Apa yang menjadi salah satu faktor utama dalam komunikasi antar budaya?",
            correctAnswer: 2,
          },
          {
            options: [
              "Ekspresif dan suka bercerita",
              "Analitis, detail, dan objektif",
              "Mudah bergaul dan spontan",
              "Mendominasi percakapan dan tegas",
            ],
            question:
              "Tipe kepribadian 'Pemikir' dalam komunikasi biasanya memiliki karakteristik seperti?",
            correctAnswer: 1,
          },
          {
            options: [
              "Pendekatan Pengendalian",
              "Pendekatan Ekspresif",
              "Pendekatan Pasif",
              "Pendekatan Intelektual",
            ],
            question:
              "Apa pendekatan yang digunakan untuk menjual ide dengan memberikan jaminan kualitas dan referensi?",
            correctAnswer: 2,
          },
          {
            options: [
              "Melalui nada suara dan pola bicara",
              "Melihat ekspresi wajah",
              "Memeriksa gaya berpakaian",
              "Menganalisis tulisan tangan mereka",
            ],
            question:
              "Bagaimana cara mengenali kepribadian seseorang saat berkomunikasi via telepon?",
            correctAnswer: 0,
          },
          {
            options: [
              "Berani mengambil risiko dan suka tantangan",
              "Sensitif, peduli, dan mendukung",
              "Struktural dan disiplin",
              "Analitis dan suka berdebat",
            ],
            question:
              "Karakteristik utama dari tipe kepribadian 'Harmoni' dalam komunikasi adalah?",
            correctAnswer: 1,
          },
        ],
      };

      setQuiz(dummyQuiz);
      setLoading(false);
    }, 1000);
  }, [quizId]);

  const { data, isLoading, error } = useGetInstructorDetailQuiz(
    trainingId,
    meetingId,
    quizId
  );

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

  const toggleQuestion = (questionIndex: number) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [questionIndex]: !prev[questionIndex],
    }));
  };

  const toggleAllQuestions = () => {
    if (!quiz) return;

    const allExpanded = quiz.questions.every(
      (_, index) => expandedQuestions[index]
    );
    const newState: Record<number, boolean> = {};

    quiz.questions.forEach((_, index) => {
      newState[index] = !allExpanded;
    });

    setExpandedQuestions(newState);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold text-red-500">
          Quiz tidak ditemukan
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50 text-gray-700 transition-colors"
        >
          Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{quiz.title}</h1>
              <p className="text-gray-600 mt-1">
                {quiz.meeting.training.title}
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
        {/* Quiz Info Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Informasi Quiz</h2>
              <div className="space-y-3">
                <div className="flex">
                  <span className="text-gray-500 w-32">ID Quiz:</span>
                  <span className="text-gray-800 font-medium">{quiz.id}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-500 w-32">Judul:</span>
                  <span className="text-gray-800 font-medium">
                    {quiz.title}
                  </span>
                </div>
                <div className="flex">
                  <span className="text-gray-500 w-32">Sesi:</span>
                  <span className="text-gray-800 font-medium">
                    {quiz.meeting.title}
                  </span>
                </div>
                <div className="flex">
                  <span className="text-gray-500 w-32">Waktu:</span>
                  <span className="text-gray-800 font-medium">10 menit</span>
                </div>
                <div className="flex">
                  <span className="text-gray-500 w-32">Nilai Lulus:</span>
                  <span className="text-gray-800 font-medium">10%</span>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-4">Timestamps</h2>
              <div className="space-y-3">
                <div className="flex">
                  <span className="text-gray-500 w-32">Dibuat:</span>
                  <span className="text-gray-800 font-medium">
                    {formatDate(quiz.createdAt)}
                  </span>
                </div>
                <div className="flex">
                  <span className="text-gray-500 w-32">Diperbarui:</span>
                  <span className="text-gray-800 font-medium">
                    {formatDate(quiz.updatedAt)}
                  </span>
                </div>
              </div>
              <div className="mt-6">
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">Total Pertanyaan:</span>
                  <span className="px-2 py-1 border border-gray-300 rounded-lg flex items-center gap-2 text-gray-700">
                    {quiz.questions.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Questions Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b p-6 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Daftar Pertanyaan</h2>
            <div>
              <button
                onClick={toggleAllQuestions}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors"
              >
                {quiz.questions.every((_, index) => expandedQuestions[index])
                  ? "Ciutkan Semua"
                  : "Perluas Semua"}
              </button>
            </div>
          </div>

          <div className="divide-y">
            {quiz.questions.map((question, index) => {
              const isExpanded = !!expandedQuestions[index];

              return (
                <div key={index} className="p-6">
                  <div
                    className="flex justify-between items-start cursor-pointer"
                    onClick={() => toggleQuestion(index)}
                  >
                    <div className="flex items-start">
                      <div className=" mr-3 h-7 px-2 py-1 border border-gray-300 rounded-lg flex items-center gap-2 text-gray-700">
                        {index + 1}
                      </div>
                      <h3 className="text-lg font-medium text-gray-800">
                        {question.question}
                      </h3>
                    </div>
                    <button className="text-gray-500 p-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 transform ${
                          isExpanded ? "rotate-180" : ""
                        } transition-transform`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 pl-10">
                      <div className="space-y-2 mb-4">
                        {question.options.map((option, optIndex) => (
                          <div
                            key={optIndex}
                            className={`p-3 rounded-md ${
                              optIndex === question.correctAnswer
                                ? "bg-green-50 border border-green-300"
                                : "bg-gray-50 border border-gray-200"
                            }`}
                          >
                            <div className="flex items-center">
                              {optIndex === question.correctAnswer && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5 text-green-500 mr-2"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                              <span
                                className={
                                  optIndex === question.correctAnswer
                                    ? "text-green-800 font-medium"
                                    : ""
                                }
                              >
                                {option}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-end space-x-4">
          <button className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50 text-gray-700 transition-colors">
            Edit
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50 text-gray-700 transition-colors">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstructorQuiz;
