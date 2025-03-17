import React from "react";
import { UserData } from "../../../../types/auth";

interface SidebarProps {
  user: UserData;
}

const Sidebar: React.FC<SidebarProps> = ({ user }) => {
  return (
    <div className="relative md:w-[30%] w-full mt-6 md:mr-5 mr-0">
      {/* Sidebar */}
      <div className="relative w-full rounded-lg overflow-hidden flex flex-col">
        {/* Background divs */}
        <div className="absolute inset-0 z-0 rounded-lg flex flex-col">
          <div className="flex-grow-0 flex-shrink-0 h-[35%] bg-sky-700 rounded-t-2xl"></div>
          <div className="flex-grow bg-white rounded-b-2xl"></div>
        </div>

        {/* Content */}
        <div className="relative z-2 shadow-lg md:px-7 px-4 md:py-9 py-5 flex flex-col">
          <div>
            <h2 className="font-semibold md:text-2xl text-2xl text-white md:pb-2">
              Hello, {user.name}
            </h2>
            <p className="text-base font-light text-white">
              Kamu mengambil {user.totalTrainings} pelatihan
            </p>
          </div>
          <div className="mt-6 flex-grow">
            <ul className="grid grid-cols-2 md:gap-5 gap-3">
              {[
                {
                  icon: "/dashboard/pelatihan.png",
                  value: user.totalTrainings,
                  label: "Pelatihan",
                },
                {
                  icon: "/dashboard/sertifikat.png",
                  value: 0,
                  label: "Sertifikat",
                },
                {
                  icon: "/dashboard/poin-total.png",
                  value: 0,
                  label: "Total Poin",
                },
                {
                  icon: "/dashboard/poin-avg.png",
                  value: user.overallAverageScore,
                  label: "Rata-rata",
                },
              ].map((item, index) => (
                <li
                  key={index}
                  className="p-5 bg-white shadow-md rounded-md flex flex-col justify-between"
                >
                  <img src={item.icon} className="w-9 pb-8" alt="" />
                  <div>
                    <h1 className="md:text-2xl text-2xl font-bold pb-2">
                      {item.value}
                    </h1>
                    <h1 className="md:text-lg text-gray-500">{item.label}</h1>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="hidden md:block"></div>
    </div>
  );
};

export default Sidebar;
