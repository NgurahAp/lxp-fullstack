import React from "react";

interface QuizDialogProps {
  onClose: () => void;
  onStart: () => void;
}

const QuizDialog: React.FC<QuizDialogProps> = ({ onClose, onStart }) => {
  return (
    <div className="z-50 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg h-64 flex flex-col justify-center w-[30rem]">
        <h2 className="text-xl font-semibold text-center mb-2">Mulai Quiz ?</h2>
        <div className="border-b-2 border-blue-500 mx-auto w-20 mb-4"></div>
        <p className="text-center text-gray-600 mb-6 mt-2">
          Tekan tombol "Mulai" untuk melanjutkan
        </p>
        <div className="flex justify-center gap-4 px-5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border border-gray-300 w-1/2 hover:bg-gray-100"
          >
            Tinjau Ulang
          </button>
          <button
            onClick={onStart}
            className="px-4 py-2 rounded bg-blue-500 w-1/2 text-white hover:bg-blue-600"
          >
            Mulai
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizDialog;
