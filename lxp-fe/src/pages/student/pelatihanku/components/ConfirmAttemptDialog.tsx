import React from "react";

interface ConfirmAttemptDialogProps {
  onClose: () => void;
  onSubmit: () => void;
}

export const ConfirmAttemptQuizDialog: React.FC<ConfirmAttemptDialogProps> = ({
  onClose,
  onSubmit,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg h-64 flex flex-col justify-center w-[30rem]">
        <h2 className="text-xl font-semibold text-center mb-2">
          Selesaikan Quiz?
        </h2>
        <div className="border-b-2 border-blue-500 mx-auto w-20 mb-4"></div>
        <p className="text-center text-gray-600 mb-6 mt-2">
          Tekan tombol "Selesai" untuk mengumpulkan jawaban
        </p>
        <div className="flex justify-center gap-4 px-5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border border-gray-300 w-1/2 hover:bg-gray-100"
          >
            Tinjau Ulang
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 rounded bg-blue-500 w-1/2 text-white hover:bg-blue-600"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
