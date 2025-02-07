import React, { useState, useEffect } from "react";
import { useUser } from "../../hooks/useAuth";
import { UserData } from "../../types/auth";
import Sidebar from "./components/Sidebar";

const Dashboard: React.FC = () => {
  const { data: user, isLoading, error } = useUser();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const bannerImages = [
    "https://storage.googleapis.com/kampusgratis_id/banners/banner_216ba8b9-c5ce-43d4-8f6e-492b6f38d587.png",
    "https://storage.googleapis.com/kampusgratis_id/banners/banner_006df764-8389-47c1-ba60-d52673b511b5.png",
  ];

  // Auto-slide functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === bannerImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [bannerImages.length]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="h-full w-screen flex flex-col md:pt-36 pt-24 md:px-24 px-4 bg-gray-100">
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

      <div className="md:flex flex-1">
        <Sidebar user={user as UserData} />

        <div className="md:w-[70%] w-full bg-gray-100 md:pl-6 pl-0 md:py-6">
          <div className="relative overflow-hidden h-72 rounded-3xl hidden md:block group">
            {/* Carousel images */}
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
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
