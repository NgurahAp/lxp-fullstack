export const Hero = () => {
  return (
    <section
      className="h-screen bg-cover bg-no-repeat bg-center max-w-screen flex items-center justify-center"
      style={{
        backgroundImage: "url('/landing/hero-bg.png')",
      }}
    >
      <div className="flex md:flex-row flex-col-reverse w-full md:px-14 px-1 items-end h-full">
        <div className="md:w-1/2 max-w-full h-full  flex flex-col justify-center md:pt-28 px-10 md:text-left text-center">
          <h1 className="md:text-3xl text-xl font-light text-gray-600 md:pb-4 pb-2">
            Pelatihan
          </h1>
          <h1 className="md:text-6xl text-2xl font-bold pb-3">
            Professional Debt Collection Skills 
          </h1>
          <h1 className="md:text-2xl text-sm font-medium">
            9 - 10 Devember 2024 - Gama Tower, Jakarta
          </h1>
          <div className=" flex md:justify-start gap-5 justify-center">
            <img
              src="/landing/logo.png"
              className="md:h-20 h-36  rounded text-center md:my-7 my-5"
              alt=""
            />
            <img
              src="/logo-cemindo.png"
              className="md:h-20 h-36  rounded text-center md:my-7 my-5"
              alt=""
            />
          </div>
          <div className="flex md:flex-row flex-col-reverse items-center">
            <button className="md:w-56 w-36 h-12 md:h-14 bg-[#FAB317] text-white font-bold md:text-xl  rounded-lg">
              Klik Disini
            </button>
            <h1 className="md:text-2xl text-sm md:pb-0 pb-3 font-bold md:pl-5">
              Silahkan login bagi peserta pelatihan.
            </h1>
          </div>
        </div>
        <div className="flex md:w-1/2 w-full px-5 md:h-full mt-16 items-center">
          <img src="/landing/hero-right.png" alt="" />
        </div>
      </div>
    </section>
  );
};
