import { trainingCategories } from "../../../../public/landing/landingData";

export const Bootcamp = () => {
  return (
    <section className="min-h-screen">
      <div className="w-11/12 mx-auto md:py-14 ">
        <h1 className="md:text-5xl text-2xl text-[#106FA4] text-center font-bold md:pb-4">
          Bootcamp <span className="text-[#FAB317]">LMS M-Knows</span>
        </h1>
        <h1 className="md:text-2xl text-lg px-10 font-light text-center text-gray-600 md:pb-14">
          Temukan bootcamp yang sesuai dengan minat dan kebutuhan Anda.
        </h1>
        <section className="pb-16 pt-7">
          <div className="container">
            <div className="flex flex-wrap justify-center -mx-10">
              {trainingCategories.map((category, index) => (
                <a href="#" key={index}>
                  <div className="md:w-80 w-80 m-5 cursor-pointer">
                    <div className="relative h-28 rounded-2xl overflow-hidden">
                      <img
                        src={category.imageSrc}
                        alt={category.title}
                        style={{ objectFit: "cover" }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-[#141414] to-transparent"></div>
                      <div className="flex absolute bottom-0 left-0 px-4 py-6">
                        <h3 className="font-semibold underline text-white text-base w-56 -mt-10">
                          {category.title}
                        </h3>
                        <a
                          href="#"
                          className="-mt-10 h-8 items-center px-3 pt-1 text- font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                          Basic
                        </a>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
          <div className="flex justify-center mt-8">
            <button className="rounded-lg bg-[#106fa4] hover:bg-blue-700 text-white md:text-base text-sm font-semibold p-4">
              Lihat Bootcamp Lainnya
            </button>
          </div>
        </section>
      </div>
    </section>
  );
};
