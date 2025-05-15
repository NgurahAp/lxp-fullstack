import { useParams } from "react-router-dom";
import { BackLink } from "../../../Components/BackLink";
import { Breadcrumb } from "../../../Components/BreadCrumbs";
import LoadingSpinner from "../../../Components/LoadingSpinner";
import { useGetScore } from "../../../hooks/useScore";

export const DetailScore = () => {
  const { trainingId } = useParams<{ trainingId: string }>();
  const { data, isLoading, error } = useGetScore(trainingId);

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

  const handleScore = (param: number) => {
    if (param < 70) {
      return "D";
    } else if (param < 80) {
      return "C";
    } else if (param < 90) {
      return "B";
    } else {
      return "A";
    }
  };

  const breadcrumbItems = [
    {
      label: "Beranda",
      path: "/dashboard",
    },
    {
      label: "Nilai & Sertifikat",
      path: "/score",
    },
    {
      label: data?.title,
    },
  ];

  return (
    <div className="flex flex-col md:pt-36 pt-24 md:px-24 px-4 bg-gray-100">
      <Breadcrumb items={breadcrumbItems} />
      <div className="bg-white w-full h-full items-center justify-between p-9 mt-5 rounded-xl mb-4">
        <h1 className="text-base md:text-xl font-semibold mb-4">
          Pelatihan Keterampilan Komunikasi
        </h1>
        <div className="overflow-x-auto border rounded-xl shadow-md">
          <table className="min-w-full bg-white border border-gray-300 text-sm">
            <thead>
              <tr className="h-14 px-4 py-4 border-b-2 border-gray-200 md:text-lg text-base  text-center bg-blue-500 text-white">
                <th className="py-2 px-4 border font-normal">Judul</th>
                <th className="py-2 px-6 border font-normal">Modul</th>
                <th className="py-2 px-6 border font-normal">Quiz</th>
                <th className="py-2 px-6 border font-normal">Penugasan</th>
                <th className="py-2 px-6 border font-normal">Rata-rata</th>
                <th className="py-2 px-6 border font-normal">Nilai</th>
              </tr>
            </thead>
            <tbody>
              {data?.meetings.map((meeting) => (
                <tr key={meeting.id} className="text-center font-medium">
                  <td className="md:p-8 p-4 md:text-base text-xs border-b-2 border-gray-200 text-left">
                    {meeting.title}
                  </td>
                  {meeting.scores.map((score) => (
                    <>
                      <td className="md:p-8 p-4 md:text-base text-xs border">
                        {score.moduleScore}
                      </td>
                      <td className="md:p-8 p-4 md:text-base text-xs border">
                        {score.quizScore}
                      </td>
                      <td className="md:p-8 p-4 md:text-base text-xs border">
                        {score.taskScore}
                      </td>
                      <td className="md:p-8 p-4 md:text-base text-xs border">
                        {score.totalScore}
                      </td>
                      <td className="md:p-8 p-4 md:text-base text-xs border">
                        {handleScore(score.totalScore)}
                      </td>
                    </>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* New section for total training score */}
        <div className="mt-6 p-6 border rounded-xl bg-blue-50">
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-lg font-semibold text-blue-900">
              Rata-rata Nilai Keseluruhan
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-blue-700">
                {data?.totalTrainingScore.toFixed(1)}
              </span>
              <span className="text-2xl font-semibold text-blue-600">
                ({handleScore(data?.totalTrainingScore || 0)})
              </span>
            </div>
          </div>
        </div>

        <BackLink to={`/score`} />
      </div>
    </div>
  );
};
