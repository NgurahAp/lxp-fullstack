import { useState } from "react";
import { Link } from "react-router-dom";
import { Breadcrumb } from "../../../Components/BreadCrumbs";
import LoadingSpinner from "../../../Components/LoadingSpinner";
import { SearchBar } from "../../../Components/SearchBar";
import { useGetTrainings } from "../../../hooks/useTrainings";
import { TrainingData } from "../../../types/training";

export const Pelatihanku = () => {
  const { data, isLoading, error } = useGetTrainings();
  const [activeTab, setActiveTab] = useState<"enrolled" | "completed">(
    "enrolled"
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

  const breadcrumbItems = [
    {
      label: "Beranda",
      path: "/dashboard",
    },
    {
      label: "Pelatihanku",
    },
  ];

  // Ensure data is an array and has the correct type
  const trainingsData: TrainingData[] = Array.isArray(data) ? data : [];

  // Filter trainings based on status with type safety
  const trainingOngoing =
    trainingsData.filter((item: TrainingData) => item?.status === "enrolled") ||
    [];

  const trainingCompleted =
    trainingsData.filter((item: TrainingData) => item?.status === "completed") ||
    [];

  const renderTraining = (trainings: TrainingData[]) => {
    if (!Array.isArray(trainings) || trainings.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-8">
          <p className="text-gray-500 mb-4">Tidak ada pelatihan</p>
          <Link
            to="/pelatihan"
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Ikuti Pelatihan
          </Link>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainings.map((item: TrainingData) => (
          <Link
            key={item.training.id}
            to={`/pelatihanku/${item.training.id}`}
            className="block w-full"
          >
            <div className="border rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-white max-w-sm mx-auto w-full">
              <div className="relative w-full h-48">
                <img
                  src={`http://localhost:3001/public${item.training.image}`}
                  alt={item.training.title}
                  className="absolute top-0 left-0 w-full h-full object-cover"
                />
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-base md:text-lg truncate">
                  {item.training.title}
                </h3>
                <p className="text-gray-500 md:py-2 py-1 text-xs md:text-sm">
                  {item.training.instructor.name}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={breadcrumbItems} />
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Pelatihanku</h1>
        <SearchBar />
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b mb-4">
          <div className="flex gap-4 p-4">
            <button
              className={`px-4 py-2 ${
                activeTab === "enrolled"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("enrolled")}
            >
              Sedang Berjalan
            </button>
            <button
              className={`px-4 py-2 ${
                activeTab === "completed"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("completed")}
            >
              Selesai
            </button>
          </div>
        </div>

        <div className="p-4">
          {activeTab === "enrolled"
            ? renderTraining(trainingOngoing)
            : renderTraining(trainingCompleted)}
        </div>
      </div>
    </div>
  );
};
