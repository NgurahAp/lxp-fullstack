import { useParams } from "react-router-dom";
import { FaCheckCircle, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useState } from "react";
import { useGetDetailTrainings } from "../../hooks/useTrainings";
import { Meeting } from "../../types/training";
import { Breadcrumb } from "../../Components/BreadCrumbs";

export const PelatihankuDetail: React.FC = () => {
  const { trainingId } = useParams<{ trainingId: string }>();
  const { data, isLoading, error } = useGetDetailTrainings(trainingId);
  const [openSessions, setOpenSessions] = useState<Record<string, boolean>>({});

  const toggleDropdown = (sessionId: number) => {
    setOpenSessions((prev) => ({
      ...prev,
      [sessionId]: !prev[sessionId],
    }));
  };

  console.log(data);

  const getModuleIcon = (answer: string): JSX.Element | null => {
    return answer ? <FaCheckCircle className="text-green-500 ml-2" /> : null;
  };

  const getQuizIcon = (score: number): JSX.Element | null => {
    return score !== 0 ? (
      <FaCheckCircle className="text-green-500 ml-2" />
    ) : null;
  };

  const getTaskIcon = (answer: string): JSX.Element | null => {
    return answer ? <FaCheckCircle className="text-green-500 ml-2" /> : null;
  };

  const renderSessionContent = (session: Meeting) => (
    <div className="bg-gray-50">
      <ul>
        {session.modules.map((module) => (
          <li
            key={module.id}
            onClick={() => {
              // Add your navigation logic here
            }}
            className="flex h-14 items-center px-4 py-2 border-b-2 border-gray-200 hover:bg-gray-100 cursor-pointer"
          >
            <img src="/pelatihanku/modul.png" className="mr-4" alt="" />
            <span className="flex-1 md:text-sm text-xs">{module.title}</span>
            {getModuleIcon(module.moduleAnswer)}
          </li>
        ))}

        {session.quizzes.map((quiz) => (
          <li
            key={quiz.id}
            onClick={() => {
              // Add your navigation logic here
            }}
            className="flex h-14 items-center px-4 py-2 border-b-2 border-gray-200 hover:bg-gray-100 cursor-pointer"
          >
            <img src="/pelatihanku/quiz.png" className="mr-4" alt="" />
            <span className="flex-1 md:text-sm text-xs">{quiz.title}</span>
            {getQuizIcon(quiz.quizScore)}
          </li>
        ))}

        {session.tasks.map((task) => (
          <li
            key={task.id}
            onClick={() => {
              // Add your navigation logic here
            }}
            className="flex h-14 items-center px-4 py-2 border-b-2 border-gray-200 hover:bg-gray-100 cursor-pointer"
          >
            <img src="/pelatihanku/tugas.png" className="mr-4" alt="" />
            <span className="flex-1 md:text-sm text-xs">{task.title}</span>
            {getTaskIcon(task.taskAnswer)}
          </li>
        ))}
      </ul>
    </div>
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

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
                src={`http://localhost:3001/public${data?.image}`}
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
            <p className="md:text-base text-xs text-gray-500 mb-2 text-justify">
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
                onClick={() => toggleDropdown(session.id)}
                className="w-full flex justify-between text-sm text-left items-center bg-blue-500 text-white px-4 py-5 rounded-t-lg"
              >
                <span className="pr-5">
                  Pertemuan {index + 1}: {session.title}
                </span>
                {openSessions[session.id] ? <FaChevronUp /> : <FaChevronDown />}
              </button>

              {openSessions[session.id] && renderSessionContent(session)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
