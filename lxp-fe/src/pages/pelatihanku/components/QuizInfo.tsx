import { GoListOrdered } from "react-icons/go";
import { MdAccessAlarm } from "react-icons/md";
import { PiExam } from "react-icons/pi";

export const QuizInfo = () => {
  return (
    <div>
      <div>
        <h1 className="text-base md:text-lg font-semibold pt-5">Detail Quiz</h1>
        <div className="flex items-center text-sm gap-x-2 py-1">
          <GoListOrdered className="text-base  text-blue-500" /> 5 Soal
        </div>
        <div className="flex items-center text-sm gap-x-2 py-1">
          <MdAccessAlarm className="text-base  text-blue-500" /> Durasi 10 Menit
        </div>
        <div className="flex items-center text-sm gap-x-2 py-1">
          <PiExam className="text-base  text-blue-500" /> Nilai Kelulusan
          minimal 80
        </div>
      </div>
    </div>
  );
};
