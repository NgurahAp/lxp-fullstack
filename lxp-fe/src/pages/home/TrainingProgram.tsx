import {
  inHouseCards,
  pelatihanPubliCards,
  programPelatihanCards,
} from "../../../public/landing/landingData";

export const TrainingProgram = () => {
  return (
    <>
      <section className="w-11/12  mx-auto md:py-14 py-0 ">
        <h1 className="md:text-5xl text-3xl text-center text-[#106FA4] px-8 font-bold pb-14">
          Program Pelatihan dan
          <span className="text-[#FAB317]"> LMS M-Knows</span>
        </h1>
        <div className="container mx-auto">
          <div className="flex flex-wrap mx-auto justify-center gap-5">
            {programPelatihanCards.map((card) => (
              <div className="md:w-72 md:mx-0 mx-5 bg-white border border-gray-200 rounded-lg shadow ">
                <a href="#">
                  <img className="rounded-t-lg w-full" src={card.icon} alt="" />
                </a>
                <div className="px-5 md:py-2 py-5">
                  <a href="#">
                    <h5 className="mb-2 md:text-xl font-bold tracking-tight text-gray-900 ">
                      {card.title}
                    </h5>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* InHouse Training */}
      <section className="w-11/12  mx-auto md:py-14 ">
        <h1 className="md:text-5xl text-3xl text-center text-[#106FA4] px-8 font-bold md:py-14 py-8">
          In House Training
          <span className="text-[#FAB317]"> LMS M-Knows</span>
        </h1>
        <div className="container mx-auto">
          <div className="flex flex-wrap mx-auto justify-center gap-5">
            {inHouseCards.map((card) => (
              <div className="md:w-72 md:mx-0 mx-5 bg-white border border-gray-200 rounded-lg shadow ">
                <a href="#">
                  <img
                    className="rounded-t-lg w-full h-48"
                    src={card.image}
                    alt=""
                  />
                </a>
                <div className="px-5 py-2 flex items-end ">
                  <a href="#" className="flex flex-col justify-between h-full">
                    <h5 className="mb-2 md:text-xl font-bold  tracking-tight text-gray-900 ">
                      {card.title}
                    </h5>
                    <p className="md:text-base text-sm">{card.pt}</p>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-11/12  mx-auto py-14 ">
        <h1 className="md:text-5xl text-3xl text-center text-[#106FA4] px-8 font-bold md:py-8 pb-10">
          Pelatihan
          <span className="text-[#FAB317]"> Publik</span>
        </h1>
        <div className="container mx-auto">
          <div className="flex flex-wrap mx-auto justify-center gap-5">
            {pelatihanPubliCards.map((card) => (
              <div className="md:w-72 md:mx-0 mx-5 bg-white border border-gray-200 rounded-lg shadow ">
                <a href="#">
                  <img
                    className="rounded-t-lg w-full h-48"
                    src={card.image}
                    alt=""
                  />
                </a>
                <div className="px-5 py-2 flex items-end ">
                  <a href="#" className="flex flex-col justify-between">
                    <h5 className="mb-2 md:text-xl font-bold  tracking-tight text-gray-900 ">
                      {card.title}
                    </h5>
                    <p className="md:text-base text-sm flex items-end">
                      {card.pt}
                    </p>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
