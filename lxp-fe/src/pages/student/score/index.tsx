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
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="flex-1 flex flex-col md:pt-36 pt-24 md:px-24 px-4">
        <Breadcrumb items={breadcrumbItems} />

        <div className="bg-white w-full h-14 flex items-center justify-between p-4 mt-5 rounded-xl shadow">
          <h1 className="md:text-lg text-sm font-semibold">
            Nilai dan Sertifikat
          </h1>
        </div>

        {/* Main Content Card */}
        <div className="mt-5 bg-white rounded-lg shadow-lg w-full">
          <div className="p-4 md:p-8">
            {/* Tabs */}
            <div className="flex flex-wrap justify-center md:justify-start border-b">
              <button
                className={`py-2 md:px-8 px-4 text-sm font-semibold ${
                  activeTab === "nilai"
                    ? "text-blue-500 border-b-2 border-blue-500"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("nilai")}
              >
                Nilai
              </button>
              <button
                className={`py-2 md:px-8 px-4 text-sm font-semibold ${
                  activeTab === "sertifikat"
                    ? "text-blue-500 border-b-2 border-blue-500"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("sertifikat")}
              >
                Sertifikat
              </button>
            </div>

            {/* Content */}
            <div className="mt-6">
              {activeTab === "nilai" ? (
                trainingsData.length === 0 ? (
                  <EmptyState message="Tidak ada data nilai yang tersedia" />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {trainingsData.map((training) => (
                      <div
                        key={training.id}
                        className="w-full bg-white border rounded-lg p-4 shadow-sm"
                      >
                        <h3 className="text-base md:text-lg font-bold mb-2 line-clamp-2">
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
                            <span className="text-xs md:text-sm">
                              {training.training.instructor.name}
                            </span>
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
                )
              ) : (
                <EmptyState
                  message="Tidak ada sertifikat yang tersedia"
                  width="w-1/6"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Sticky di Bawah */}
      <footer className="text-center text-xs py-4 text-gray-500">
        2024 - www.lms.m-knows.com - Hak Cipta Dilindungi.
      </footer>
    </div>
  );
};
