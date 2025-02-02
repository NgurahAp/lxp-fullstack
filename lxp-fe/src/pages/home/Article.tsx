import { sekilasIlmuCards } from "../../../public/landing/landingData";

export const Article = () => {
  return (
    <section className="w-11/12  mx-auto py-14 ">
      <h1 className="text-3xl md:text-5xl  px-8 font-bold pb-14 text-center">
        Sekilas Ilmu
      </h1>
      <div className="container mx-auto flex flex-col items-center justify-center">
        <div className="flex flex-wrap mx-auto justify-center gap-5">
          {sekilasIlmuCards.map((card) => (
            <div className="md:w-72 md:mx-0 mx-3 bg-white border border-gray-200 rounded-lg shadow ">
              <a href="#">
                <img
                  className="rounded-t-lg w-full h-48"
                  src={card.image}
                  alt=""
                />
              </a>
              <div className="px-5 py-5 md:text-base text-sm  flex items-end">
                <a href="#" className="w-full">
                  <div className="flex justify-between pb-3 items-center">
                    <h1 className="text-left text-sm font-bold bg-[#E3FBDA] p-1">
                      {card.category}
                    </h1>
                    <h2 className="text-right text-sm text-[#737373]">
                      {card.date}
                    </h2>
                  </div>
                  <h5 className="mb-2 md:text-xl text-lg min-h-14 font-bold tracking-tight ">
                    {card.title.split(" ").length > 5
                      ? `${card.title.split(" ").slice(0, 5).join(" ")}...`
                      : card.title}
                  </h5>

                  <p className=" text-[#737373] text-sm">{card.description}</p>
                  <div className="flex justify-between pb-3 items-center md:pt-10 pt-5">
                    <p className="text-sm md:text-sm text-[#737373]">
                      {card.views}
                    </p>
                    <img src="/landing/sekilasIlmu/save.png" alt="" />
                  </div>
                </a>
              </div>
            </div>
          ))}
        </div>
        <button className="bg-[#106FA4] w-1/6 text-white font-bold py-4 px-10 mt-10 rounded-lg">
          Lihat semua
        </button>
      </div>
    </section>
  );
};
