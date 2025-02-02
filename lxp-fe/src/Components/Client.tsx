import React from "react";
import Marquee from "react-fast-marquee";

// Define types for the props (if needed)
type ClientsProps = object;

const Clients: React.FC<ClientsProps> = () => {
  // Define arrays of image sources
  const imagesRow1 = Array.from(
    { length: 9 },
    (_, i) => `/landing/clients/row1-${i + 1}.png`
  );

  const imagesRow2 = Array.from(
    { length: 8 },
    (_, i) => `/landing/clients/row2-${i + 1}.png`
  );

  const imagesRow3 = Array.from(
    { length: 5 },
    (_, i) => `/landing/clients/row3-${i + 1}.png`
  );

  return (
    <div className="container mx-auto">
      <h2 className="md:text-5xl text-3xl px-16 text-[#ED3768] font-bold text-center mb-8 py-9 pt-20">
        <span className="text-black">Mitra</span> Perusahaan Klien M-Knows
      </h2>
      <Marquee>
        <div className="w-full md:h-20 h-16 overflow-x-auto flex space-x-12 p-3 md:my-5 my-2 scrollbar-hide">
          {imagesRow1.map((src, index) => (
            <div key={index} className="flex-shrink-0 h-full">
              <img
                src={src}
                alt={`In-house activity ${index + 1}`}
                className="h-full w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </Marquee>
      <Marquee direction="right">
        <div className="w-full h-16 md:h-20 overflow-x-auto flex space-x-12 p-3 md:my-5 my-2 scrollbar-hide">
          {imagesRow2.map((src, index) => (
            <div key={index} className="flex-shrink-0 h-full">
              <img
                src={src}
                alt={`In-house activity ${index + 1}`}
                className="h-full w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </Marquee>
      <Marquee>
        <div className="w-full h-16 md:h-20 lg:overflow-x-auto flex space-x-12 p-3 md:my-5 my-2 scrollbar-hide">
          {imagesRow3.map((src, index) => (
            <div key={index} className="flex-shrink-0 h-full">
              <img
                src={src}
                alt={`In-house activity ${index + 1}`}
                className="h-full w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </Marquee>
    </div>
  );
};

export default Clients;
