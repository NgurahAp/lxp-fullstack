import { useNavigate, useParams } from "react-router-dom";
import { useGetQuiz } from "../../hooks/useQuiz";
import LoadingSpinner from "../../Components/LoadingSpinner";
import { Breadcrumb } from "../../Components/BreadCrumbs";
import PageInfo from "../../Components/PageInfo";
import { QuizInfo } from "./components/QuizInfo";
import { MdOutlineTaskAlt } from "react-icons/md";
import QuizDialog from "./components/QuizDialog";
import { useState } from "react";

export const Quiz = () => {
  const [isDialogOpen, setDialogOpen] = useState(false);

  const { meetingId, quizId } = useParams<{
    meetingId: string;
    quizId: string;
  }>();

  const { data, isLoading, error } = useGetQuiz(meetingId, quizId);
  const navigate = useNavigate();

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

  const breadcrumbItems = [
    {
      label: "Beranda",
      path: "/dashboard",
    },
    {
      label: "Pelatihan-ku",
      path: "/pelatihanku",
    },
    {
      label: data?.meeting.title,
      path: `/pelatihanku/${data?.meeting.training.id}`,
    },
    {
      label: data?.title,
    },
  ];

  const handleQuizStart = () => {
    setDialogOpen(false);
    navigate(`/quizAttempt/${meetingId}/${quizId}`);
  };

  return (
    <div className="min-h-[85vh] flex flex-col md:pt-36 pt-24 md:px-24 px-4 bg-gray-100">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />
      <PageInfo title={data?.title} />
      {/* Quiz Content */}
      <div className="bg-white flex md:flex-row flex-col mt-5 w-full px-4 md:px-8 h-full justify-center rounded-lg">
        <div className="w-1/2 md:flex hidden items-center justify-center">
          <img src="/pelatihanku/quiz-left.png" alt="" />
        </div>
        <div className="md:w-1/2 py-5 md:py-10">
          {/* {data?.quizScore != 0 && (
            <QuizHistory historyData={historyData} quizData={quizData} />
          )} */}
          <QuizInfo />
          <div>
            <div>
              <h1 className="text-base md:text-lg font-semibold pt-3 pb-1">
                Deskripsi
              </h1>
              <p className="text-gray-500 text-sm">
                Quiz ini bertujuan untuk menguji pengetahuan Anda tentang materi
                yang telah dipelajari di pertemuan ini.
              </p>
            </div>
          </div>
          <div>
            <h1 className="text-base md:text-lg font-semibold pt-3 pb-1">
              Pengaturan Quiz
            </h1>
            <div className="flex items-center text-sm gap-x-2 py-1">
              <MdOutlineTaskAlt className="text-base text-blue-500" /> Kerjakan
              Dengan Jujur
            </div>
            <div className="flex items-center text-sm gap-x-2 py-1">
              <MdOutlineTaskAlt className="text-base text-blue-500" /> Dilarang
              Bekerja Sama
            </div>
            <div className="flex items-center text-sm gap-x-2 py-1">
              <MdOutlineTaskAlt className="text-base text-blue-500" /> Apabila
              Keluar dari App, Waktu Quiz Tetap Berjalan
            </div>
          </div>
          {/* Button Mulai Quiz */}
          <button
            onClick={() => setDialogOpen(true)}
            className={`flex w-full items-center text-sm py-4 rounded-xl justify-center mt-5 ${
              data?.quizScore != 0
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-blue-500 text-white"
            }`}
            disabled={data?.quizScore != 0}
          >
            {data?.quizScore != 0 ? "Kesempatan Habis!" : "Mulai Quiz"}
          </button>
        </div>
      </div>
      {/* Dialog Konfirmasi */}
      {isDialogOpen && (
        <QuizDialog
          onClose={() => setDialogOpen(false)}
          onStart={handleQuizStart}
        />
      )}
    </div>
  );
};
