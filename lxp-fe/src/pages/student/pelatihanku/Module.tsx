"use client";

import { Link, useParams } from "react-router-dom";
import { IoDocumentText } from "react-icons/io5";
import { ModuleSubmitDialog } from "./components/ModuleSubmitDialog";
import { FaCheck } from "react-icons/fa6";
import { BackLink } from "../../../Components/BackLink";
import { Breadcrumb } from "../../../Components/BreadCrumbs";
import LoadingSpinner from "../../../Components/LoadingSpinner";
import { useGetModule } from "../../../hooks/useModule";

export const Module = () => {
  const { meetingId, moduleId } = useParams<{
    meetingId: string;
    moduleId: string;
  }>();

  const { data, isLoading, error, refetch } = useGetModule(meetingId, moduleId);

  if (isLoading) {
    return <LoadingSpinner text="Loading..." />;
  }

  if (error) {
    return (
      <div className="min-h-[85vh] w-full flex items-center justify-center">
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

  return (
    <div className="min-h-[85vh] w-full max-w-full flex flex-col md:pt-36 pt-24 md:px-24 px-4 bg-gray-100">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      <div className="bg-white flex flex-col mt-5 md:px-12 px-6 md:py-14 py-10 rounded-lg shadow-md">
        {/* Module Header */}
        <div className="flex flex-col items-center mb-10">
          <h1 className="font-bold md:text-4xl text-2xl text-center text-gray-800 mb-4">
            {data?.title}
          </h1>
          <div className="w-20 h-1 bg-blue-600 rounded-full"></div>
        </div>

        <div className="flex flex-col md:flex-row gap-10 w-full">
          {/* Left Section - Document Content */}
          <div className="w-full md:w-2/3 flex flex-col">
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <IoDocumentText className="text-blue-600 mr-2 text-2xl flex-shrink-0" />
                <span className="break-words">Materi Pembelajaran</span>
              </h2>
              <p className="text-gray-600 mb-6">
                Silakan pelajari dokumen materi berikut ini untuk menyelesaikan
                modul.
              </p>

              <button
                onClick={() =>
                  window.open(
                    `http://localhost:3001/public/${data?.content}`,
                    "_blank"
                  )
                }
                className="flex items-center gap-4 w-full bg-white hover:bg-gray-50 transition-colors border border-gray-200 rounded-lg p-5 shadow-sm"
              >
                <div className="flex-shrink-0 bg-red-100 p-3 rounded-lg">
                  <IoDocumentText className="text-3xl text-red-600" />
                </div>
                <div className="flex flex-col flex-grow min-w-0">
                  <span className="font-medium text-gray-800 md:text-lg text-sm truncate">
                    {data?.title}
                  </span>
                  <span className="text-gray-500 text-xs md:text-sm">
                    Klik untuk membuka dokumen
                  </span>
                </div>
              </button>
            </div>

            <div className="mt-6">
              <BackLink to={`/pelatihanku/${data?.meeting.training.id}`} />
            </div>
          </div>

          {/* Right Section - Module Status */}
          <div className="w-full md:w-1/3 flex flex-col">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Status Modul
              </h2>

              <div className="flex items-center mb-6">
                <div
                  className={`w-3 h-3 rounded-full mr-2 ${
                    data?.submission.answer ? "bg-green-500" : "bg-yellow-500"
                  }`}
                ></div>
                <span className="text-gray-700">
                  {data?.submission.answer ? "Selesai" : "Belum Selesai"}
                </span>
              </div>

              {data?.submission.answer ? (
                <button className="w-full py-3 flex justify-center items-center rounded-lg bg-green-500 text-white gap-2 hover:bg-green-600 transition-colors">
                  <FaCheck className="text-sm" />
                  <span>Modul Selesai</span>
                </button>
              ) : (
                <ModuleSubmitDialog
                  moduleId={data?.id}
                  onComplete={() => {
                    refetch();
                  }}
                />
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col gap-3">
              <div className="mt-6 text-right">
                <p className="text-gray-500 text-sm mb-1">
                  Setelah mempelajari materi
                </p>
                <Link
                  to={``}
                  className="text-blue-600 hover:text-blue-800 font-medium text-lg inline-flex items-center gap-1 transition-colors"
                >
                  Lanjutkan ke Kuis
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="flex-shrink-0"
                  >
                    <path d="m9 18 6-6-6-6"></path>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
