import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import { useGetUser } from "../../../hooks/useAuth";

const Dashboard: React.FC = () => {
  const { data: user, isLoading, error } = useGetUser();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const bannerImages = [
    "/public/dashboard/banner1.png",
    "/public/dashboard/banner2.png",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === bannerImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(timer);
  }, [bannerImages.length]);

  // Show loading state while data is being fetched
  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  // Show error state if there's an error
  if (error) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div>Error: {error.message}</div>
      </div>
    );
  }

  // Ensure user exists before rendering the main content
  if (!user) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div>No user data available</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col md:pt-36 pt-24 bg-gray-100">
      <div className="max-w-full mx-auto px-4 md:px-24 w-full">
        <div className="bg-white w-full h-14 flex items-center pl-5 rounded-xl">
          <img
            src="/dashboard/home.png"
            className="md:w-5 w-5 -mt-1"
            alt="home icon"
          />
          <h1 className="md:pl-5 pl-3 text-[#9CA3AF] text-sm font-semibold">
            Beranda
          </h1>
        </div>

        <div className="md:flex flex-1 gap-6">
          <Sidebar user={user} />

          <div className="md:w-[70%] w-full bg-gray-100 py-6">
            <div className="relative overflow-hidden h-72 rounded-3xl hidden md:block group">
              <div className="absolute inset-0 flex items-center justify-center">
                {bannerImages.map((banner, index) => (
                  <img
                    key={index}
                    src={banner}
                    alt={`Banner ${index + 1}`}
                    className={`
                      absolute max-w-full max-h-full object-contain 
                      transition-all duration-500 ease-in-out 
                      will-change-transform 
                      transform-gpu 
                      ${
                        index === currentImageIndex
                          ? "opacity-100 visible translate-x-0"
                          : "opacity-0 invisible translate-x-full"
                      }
                      hover:brightness-105
                    `}
                    loading="lazy"
                    decoding="async"
                  />
                ))}
              </div>
            </div>

            <div className="mt-6 bg-white shadow-lg p-8 rounded-xl">
              <h2 className="text-lg font-semibold md:pb-1">
                Terakhir Pengerjaan
              </h2>
              <div className="md:flex justify-between items-center pb-5">
                <p className="">Semester 1</p>
                <a href="" className="text-blue-500 font-medium md:text-base">
                  Lihat Semua
                </a>
              </div>

              {/* Add null check for trainings array */}
              {user.trainings && user.trainings.length > 0 ? (
                user.trainings.map((subject) => (
                  <div
                    key={subject.id}
                    className="bg-white rounded-lg shadow-md md:flex items-center justify-between mb-8 p-4"
                  >
                    <div className="md:w-48 w-full">
                      <img
                        src={`http://localhost:3001/public${subject.image}`}
                        alt={`${subject.title} Thumbnail`}
                        className="rounded-lg object-cover w-full"
                      />
                    </div>

                    <div className="md:w-3/4 w-full px-5 py-3 md:py-5 flex justify-between items-center">
                      <div>
                        <h2 className="font-semibold md:text-lg mb-1">
                          {subject.title.length > 35
                            ? `${subject.title.slice(0, 35)}...`
                            : subject.title}
                        </h2>
                        <p className="text-gray-500 text-sm">
                          {subject.instructor}
                        </p>
                      </div>

                      <a
                        href={`/training/${subject.id}`}
                        className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-sm font-medium"
                      >
                        Lihat
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Belum ada pelatihan yang diikuti
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
