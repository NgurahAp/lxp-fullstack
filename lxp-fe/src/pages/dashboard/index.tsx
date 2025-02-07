import React from "react";

const Dashboard: React.FC = () => {
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
        <div className="relative md:w-[30%] w-ful mt-6 md:mr-5 mr-0">
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
                  Hello, Ngurah
                </h2>
                <p className=" text-base font-light text-white">
                  Kamu mengambil 2 pelatihan
                </p>
              </div>
              <div className="mt-6 flex-grow">
                <ul className="grid grid-cols-2 md:gap-5 gap-3">
                  {[
                    {
                      icon: "/dashboard/pelatihan.png",
                      value: 2,
                      label: "Pelatihan",
                    },
                    {
                      icon: "/dashboard/sertifikat.png",
                      value: 3,
                      label: "Sertifikat",
                    },
                    {
                      icon: "/dashboard/poin-avg.png",
                      value: 5,
                      label: "Rata-rata",
                    },
                    {
                      icon: "/dashboard/poin-total.png",
                      value: 7,
                      label: "Total Poin",
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
                        <h1 className="md:text-lg text-lgtext-gray-500">
                          {item.label}
                        </h1>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="hidden md:block"></div>
        </div>
        {/* Dashboard Content */}
        <div className="md:w-[70%] w-full bg-gray-100 md:pl-6 pl-0 md:py-6">
          <div className="relative overflow-hidden h-72 rounded-3xl hidden md:block">
            <h1>Content</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
