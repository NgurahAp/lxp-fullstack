import { useState } from "react";
import { Link } from "react-router-dom";
import { Breadcrumb } from "../../../Components/BreadCrumbs";
import { EmptyState } from "../../../Components/EmptyState";
import LoadingSpinner from "../../../Components/LoadingSpinner";
import { useGetTrainings } from "../../../hooks/useTrainings";
import { TrainingData } from "../../../types/training";

export const Score: React.FC = () => {
  const { data, isLoading, error } = useGetTrainings();

  const [activeTab, setActiveTab] = useState<"nilai" | "sertifikat">("nilai");

  if (isLoading) {
    return <LoadingSpinner text="Loading..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Error fetching nilai response.
      </div>
    );
  }

  const breadcrumbItems = [
    {
      label: "Beranda",
      path: "/dashboard",
    },
    {
      label: "Nilai & Sertifikat",
    },
  ];

  // Ensure data is an array and has the correct type
  const trainingsData: TrainingData[] = Array.isArray(data) ? data : [];

  return (
    <div className=" flex flex-col md:pt-36 pt-24 md:px-24 px-8 bg-gray-100 md:pb-4">
      <Breadcrumb items={breadcrumbItems} />
      {/* <PageInfo title="Nilai dan Sertifikat" className="text-sm" /> */}
      <div className="bg-white w-full h-14 flex items-center justify-between p-9 mt-5 rounded-xl">
        <h1 className=" md:text-lg text-sm font-semibold">
          Nilai dan Sertifikat
        </h1>
      </div>
      {/* Main Content Card */}
      <div className="px-5 mt-5 bg-white rounded-lg shadow-lg w-full ">
        <div>
          {/* Tabs */}
          <div className="p-8">
            <div className="flex flex-wrap justify-center md:justify-normal border-b border-white">
              <button
                className={`py-2 md:px-8 px-5 text-sm font-semibold border-1  ${
                  activeTab === "nilai"
                    ? "text-blue-500 border-b-2 border-blue-500"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("nilai")}
              >
                Nilai
              </button>
              <button
                className={`py-2 px-8 text-sm font-semibold border-1  ${
                  activeTab === "sertifikat"
                    ? "text-blue-500 border-b-2 border-blue-500"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("sertifikat")}
              >
                Sertifikat
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 pb-8">
            {/* Content */}
            <div className="md:px-6 px-2 pb-8">
              {activeTab === "nilai" && (
                <>
                  {trainingsData.length === 0 ? (
                    <EmptyState message="Tidak ada data nilai yang tersedia" />
                  ) : (
                    <div className="grid grid-cols-1  md:grid-cols-2 gap-4">
                      {trainingsData.map((training) => (
                        <div
                          key={training.id}
                          className="w-[30rem] bg-white border rounded-lg md:p-6 p-4 shadow-sm"
                        >
                          <h3 className="text-base md:text-xl font-bold mb-2 md:mb-4 line-clamp-2">
                            {training.training.title.length > 40
                              ? `${training.training.title.slice(0, 40)}...`
                              : training.training.title}
                          </h3>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-xs md:text-sm text-gray-600">
                                Status Perkuliahan
                              </span>
                              <span
                                className={`text-xs md:text-sm font-medium ${
                                  training.status === "enrolled"
                                    ? "text-yellow-500"
                                    : "text-green-500"
                                }`}
                              >
                                {training.status === "enrolled"
                                  ? "Belum Selesai"
                                  : "Sudah Selesai"}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs md:text-sm text-gray-600">
                                Instruktor
                              </span>
                              {training.training.instructor.name}
                            </div>
                            <div className="pt-2 flex justify-end">
                              <Link
                                to={`/score/${training.training.id}`}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-xs md:text-sm"
                              >
                                Lihat Detail
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {activeTab === "sertifikat" && (
                <EmptyState
                  message="Tidak ada sertifikat yang tersedia"
                  width="w-1/6"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
