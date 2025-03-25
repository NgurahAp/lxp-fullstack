import { QuizResponse } from "../../../../types/quiz";

export const QuizHistory = ({ data }: QuizResponse) => {
  if (data.submission.score == 0) return null;

  const wrongAnswer = 5 - data.submission.score / 20;
  const rightAnswer = 5 - wrongAnswer;

  return (
    <>
      <h1 className="text-xl font-semibold pb-3">Riwayat Quiz</h1>
      <div className="border-[1px] rounded-md p-3">
        <div className="flex justify-between">
          <h2 className="text-xs font-semibold">
            Quiz Pertemuan {data.meeting.title}
          </h2>
          <h2 className="text-[#4B5565] text-xs">
            {new Date(data.updatedAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}{" "}
            - {new Date(data.updatedAt).toLocaleTimeString("id-ID")}
          </h2>
        </div>
        <div className="flex md:flex-row flex-col my-3 gap-4 md:gap-1">
          <div className="md:w-24 flex flex-col justify-center items-center gap-1">
            <h2 className="text-xs">Total Nilai</h2>
            <h1 className="text-xl font-semibold">{data.submission.score}</h1>
          </div>
          <div className="md:w-52 py-3 flex bg-[#DBF2EB] rounded-lg flex-col justify-center items-center gap-y-1">
            <h1 className="text-xl font-semibold">{rightAnswer}</h1>
            <h2 className="text-xs">Jawaban Benar</h2>
          </div>
          <div className="md:w-52 py-3 flex bg-[#F6DCDB] rounded-lg flex-col justify-center items-center gap-y-1">
            <h1 className="text-xl font-semibold">{wrongAnswer}</h1>
            <h2 className="text-xs">Jawaban Salah</h2>
          </div>
          <div className="md:w-52 py-3 flex bg-[#ECFDBF] rounded-lg flex-col justify-center items-center gap-y-1">
            <h1 className="text-xl font-semibold">5 </h1>
            <h2 className="text-xs">Soal</h2>
          </div>
        </div>
        <p className="text-xs">
          {/* Waktu Selesai{" "}
          {(() => {
            const timeInSeconds = history.time_elapsed;
            const minutes = Math.floor(timeInSeconds / 60);
            const seconds = timeInSeconds % 60;
            return `${minutes.toString().padStart(2, "0")}:${seconds
              .toString()
              .padStart(2, "0")}`;
          })()} */}
        </p>
      </div>
    </>
  );
};
