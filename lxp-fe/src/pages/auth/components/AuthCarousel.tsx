import React, { useState, useEffect } from "react";

interface CarouselItemProps {
  image: string;
  title: string;
  description: string;
}

const carouselData: CarouselItemProps[] = [
  {
    image: "/auth/ilustration1.png",
    title: "Kejarlah Impianmu",
    description:
      "Jangan Hanya bermimpi, Segera bertindak, dimulai dengan belajar. Orang Sukses, pasti banyak Belajar",
  },
  {
    image: "/auth/ilustration2.png",
    title: "Belajar Tanpa Henti",
    description:
      "Pendidikan adalah kunci kesuksesan. Terus belajar dan tingkatkan kemampuanmu.",
  },
  {
    image: "/auth/ilustration3.png",
    title: "Wujudkan Cita-citamu",
    description:
      "Setiap langkah kecil membawamu lebih dekat ke tujuanmu. Tetap fokus dan pantang menyerah.",
  },
];

const CarouselItem: React.FC<CarouselItemProps> = ({
  image,
  title,
  description,
}) => (
  <div className="flex flex-col items-center justify-center h-full">
    <img src={image} alt="Illustration" className="w-auto h-[40%] pb-10" />
    <h1 className="text-3xl font-bold text-white pb-5">{title}</h1>
    <p className="w-1/2 text-lg text-white text-center">{description}</p>
  </div>
);

export const AuthCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % carouselData.length);
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="w-full h-full bg-[#3498DB] bg-cover flex flex-col items-center justify-center relative"
      style={{ backgroundImage: "url('/auth/bg.png')" }}
    >
      <div className="w-full h-full relative">
        {carouselData.map((item, index) => (
          <div
            key={index}
            className={`w-full h-full transition-opacity duration-500 ${
              index === currentSlide ? "block" : "hidden"
            }`}
          >
            <CarouselItem {...item} />
          </div>
        ))}
      </div>
      <div className="absolute bottom-20 left-0 right-0 flex justify-center">
        {carouselData.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full mx-1 ${
              index === currentSlide ? "bg-white" : "bg-white/50"
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};
