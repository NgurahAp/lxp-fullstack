import { Link, useParams } from "react-router-dom";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaChevronDown,
  FaChevronUp,
  FaLock,
} from "react-icons/fa";
import { useState } from "react";
import { Breadcrumb } from "../../../Components/BreadCrumbs";
import LoadingSpinner from "../../../Components/LoadingSpinner";
import { useGetDetailTrainings } from "../../../hooks/useTrainings";
import { Meeting } from "../../../types/training";
import { API_ASSETS } from "../../../config/api";

export const PelatihankuDetail: React.FC = () => {
  const { trainingId } = useParams<{ trainingId: string }>();
  const { data, isLoading, error } = useGetDetailTrainings(trainingId);
  const [openSessions, setOpenSessions] = useState<Record<string, boolean>>({});

  const toggleDropdown = (sessionId: string, isLocked: boolean) => {
    // Prevent toggling locked sessions
    if (isLocked) {
      return;
    }

    setOpenSessions((prev) => ({
      ...prev,
      [sessionId]: !prev[sessionId],
    }));
  };

  const getModuleIcon = (answer: string): JSX.Element | null => {
    return answer ? <FaCheckCircle className="text-green-500 ml-2" /> : null;
  };

  const getQuizIcon = (score: number): JSX.Element | null => {
    if (score === 0) {
      return null;
    }

    if (score < 80) {
      return <FaTimesCircle className="text-red-500 ml-2" />;
    }

    return <FaCheckCircle className="text-green-500 ml-2" />;
  };

  const getTaskIcon = (answer: string): JSX.Element | null => {
    return answer ? <FaCheckCircle className="text-green-500 ml-2" /> : null;
  };

  const renderSessionContent = (session: Meeting) => (
    <div className="bg-gray-50">
      <ul>
        {session.modules.map((module) => (
          <Link
            key={module.id}
            to={`/module/${session.id}/${module.id}`}
            className="flex h-14 items-center px-4 py-2 border-b-2 border-gray-200 hover:bg-gray-100 cursor-pointer"
          >
            <img src="/pelatihanku/modul.png" className="mr-4" alt="" />
            <span className="flex-1 md:text-sm text-xs">{module.title}</span>
            {getModuleIcon(module.moduleAnswer)}
          </Link>
        ))}

        {session.quizzes.map((quiz) => (
          <Link
            key={quiz.id}
            to={`/quiz/${session.id}/${quiz.id}`}
            className="flex h-14 items-center px-4 py-2 border-b-2 border-gray-200 hover:bg-gray-100 cursor-pointer"
          >
            <img src="/pelatihanku/quiz.png" className="mr-4" alt="" />
            <span className="flex-1 md:text-sm text-xs">{quiz.title}</span>
            {getQuizIcon(quiz.quizScore)}
          </Link>
        ))}

        {session.tasks.map((task) => (
          <Link
            key={task.id}
            to={`/task/${session.id}/${task.id}`}
            className="flex h-14 items-center px-4 py-2 border-b-2 border-gray-200 hover:bg-gray-100 cursor-pointer"
          >
            <img src="/pelatihanku/tugas.png" className="mr-4" alt="" />
            <span className="flex-1 md:text-sm text-xs">{task.title}</span>
            {getTaskIcon(task.taskAnswer)}
          </Link>
        ))}
      </ul>
    </div>
  );

  // Show previous meeting requirement tooltip
  const renderLockedMessage = (index: number) => {
    if (index === 0) return null;
    const previousMeeting = data?.meetings[index - 1];

    return (
      <div className="bg-yellow-50 p-3 border border-yellow-200 rounded-b-lg text-sm text-yellow-700">
        <p className="flex items-center">
          <FaLock className="mr-2" />
          Selesaikan semua materi pada {previousMeeting?.title} untuk membuka
          sesi ini:
        </p>
        <ul className="ml-8 mt-1 list-disc text-xs">
          <li>Semua modul harus dikerjakan</li>
          <li>Nilai quiz minimal 80</li>
          <li>Semua tugas harus dikerjakan</li>
        </ul>
      </div>
    );
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
      label: data?.title,
    },
  ];

  return (
    <div className="bg-gray-50 md:p-24 px-4 md:pt-36 pt-24">
      <Breadcrumb items={breadcrumbItems} />

      <div className="bg-white p-6 md:mt-5 mt-4 shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold pb-5">Pendahuluan</h1>
        <div className="flex flex-col md:text-base text-xs lg:flex-row">
          <div className="lg:w-1/3 mb-6 lg:mb-0">
            <div className="relative">
              <img
                src={`${API_ASSETS}${data?.image}`}
                alt=""
                className="w-full h-auto"
              />
            </div>
          </div>

          <div className="lg:w-2/3 lg:pl-14">
            <h2 className="md:text-xl text-base font-semibold mb-5">
              {data?.title}
            </h2>
            <h3 className="md:text-base text-xs font-semibold mb-2">
              Deskripsi
            </h3>
            <p className="md:text-sm text-xs text-gray-500 mb-2 text-justify">
              {data?.description}
            </p>
          </div>
        </div>
      </div>

      {/* Pertemuan Section */}
      <div className="mt-6">
        {data?.meetings.map((session, index) => (
          <div key={session.id} className="mb-4">
            <div className="mx-auto my-4 bg-white rounded-lg shadow">
              <button
                onClick={() => toggleDropdown(session.id, session.isLocked)}
                disabled={session.isLocked}
                className={`w-full flex justify-between text-sm text-left items-center px-4 py-5 rounded-t-lg ${
                  session.isLocked
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 cursor-pointer"
                } text-white`}
              >
                <div className="flex items-center">
                  {session.isLocked && (
                    <FaLock className="mr-2 text-white animate-pulse" />
                  )}
                  <span className="pr-5">{session.title}</span>
                </div>
                {session.isLocked ? null : openSessions[session.id] ? (
                  <FaChevronUp />
                ) : (
                  <FaChevronDown />
                )}
              </button>

              {/* Show locked message for locked meetings */}
              {session.isLocked && renderLockedMessage(index)}

              {/* Show meeting content only if unlocked and open */}
              {!session.isLocked &&
                openSessions[session.id] &&
                renderSessionContent(session)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
