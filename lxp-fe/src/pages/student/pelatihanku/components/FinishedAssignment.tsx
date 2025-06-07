import { API_ASSETS } from "../../../../config/api";
import { TaskData } from "../../../../types/task";
import { formatToIndonesianDateTime } from "./Date";
// import { calculateRemainingTime, formatToIndonesianDateTime } from "./Date";

interface OngoingStatusProps {
  assignmentData: TaskData | undefined;
}

export const FinishedAssignment: React.FC<OngoingStatusProps> = ({
  assignmentData,
}) => {
  if (!assignmentData) return null;

  return (
    <div className="overflow-x-auto pb-3">
      <h1 className="text-lg md:text-2xl font-semibold pb-4 md:pb-5">
        Status Penyerahan
      </h1>
      <table className="table-auto w-full border md:text-base text-xs border-gray-300">
        <tbody>
          <tr className="border-b">
            <td className="p-4 font-medium border-r w-1/4 border-gray-300 bg-gray-50">
              Status Penyerahan
            </td>
            <td className="p-4 bg-[#EBF5FB]">Sudah Terkirim</td>
          </tr>
          <tr className="border-b">
            <td className="p-4 font-medium border-r border-gray-300">
              Status Penilaian
            </td>
            <td className="p-4">{assignmentData.submission.score}</td>
          </tr>
          {/* <tr className="border-b">
            <td className="p-4 font-medium border-r border-gray-300 bg-gray-50">
              Tenggat Waktu
            </td>
            <td className="p-4 bg-gray-50">
              {formatToIndonesianDateTime(assignmentData.progress.deadline)}
            </td>
          </tr> */}
          {/* <tr className="border-b">
            <td className="p-4 font-medium border-r border-gray-300">
              Waktu Tersisa
            </td>
            <td className="p-4 bg-[#EBF5FB]">
              90
              {calculateRemainingTime(assignmentData.progress.deadline)}
            </td>
          </tr> */}
          <tr className="border-b">
            <td className="p-4 font-medium border-r border-gray-300 bg-gray-50">
              Terakhir Diubah
            </td>
            <td className="p-4 bg-gray-50">
              {formatToIndonesianDateTime(assignmentData.updatedAt)}
            </td>
          </tr>
          <tr className="border-b">
            <td className="p-4 font-medium border-r border-gray-300">
              Pertanyaan
            </td>
            <td className="p-4">{assignmentData.taskQuestion}</td>
          </tr>
          <tr>
            <td className="p-4 font-medium border-r border-gray-300 bg-gray-50">
              Penyerahan Tugas
            </td>
            <td className="p-4 bg-gray-50">
                  <a
                    href={`${API_ASSETS}/${assignmentData.submission.answer}`}
                    className="text-blue-500 hover:underline flex items-center"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src="/penugasan/pdf.png" className="w-8 mr-3" alt="" />{" "}
                    Jawaban
                  </a>
            </td>
            <td className="p-4 bg-gray-50">
            
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
