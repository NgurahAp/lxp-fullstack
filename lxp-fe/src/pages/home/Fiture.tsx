import { fiturCards } from "../../../public/landing/landingData";

export const Fiture = () => {
  return (
    <section className="min-h-screen">
      <div className="w-11/12 mx-auto py-14 ">
        <h1 className="md:text-5xl text-3xl text-[#106FA4] text-center font-bold md:pb-14 pb-5">
          Fitur <span className="text-[#FAB317]">LMS M-Knows</span>
        </h1>
        <div className="container mx-auto">
          <div className="flex flex-wrap mx-auto justify-center gap-9">
            {fiturCards.map((card) => (
              <div className="bg-white flex-col justify-center w-64 h-32 p-4 rounded-lg shadow-md flex items-center">
                <img src={card.icon} alt={card.title} className="w-12 h-12 " />
                <div>
                  <h2 className="text-base pt-2 text-center font-bold">
                    {card.title}
                  </h2>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
