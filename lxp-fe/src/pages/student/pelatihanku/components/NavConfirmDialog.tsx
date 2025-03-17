import React from "react";
import { IoIosAlert } from "react-icons/io";

interface NavigationDialogProps {
  onClose: () => void;
  onConfirm: () => void;
}

const NavigationDialog: React.FC<NavigationDialogProps> = ({
  onClose,
  onConfirm,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg h-64 flex flex-col justify-center w-[30rem]">
        <IoIosAlert className="text-red-500 text-4xl mb-2 text-center w-full" />
        <h2 className="text-xl font-semibold text-center mb-2">
          Keluar dari Quiz?
        </h2>
        <div className="border-b-2 border-red-500 mx-auto w-20 mb-4"></div>
        <p className="text-center text-gray-600 mb-6 mt-2">
          Waktu akan terus berjalan
        </p>
        <div className="flex justify-center gap-4 px-5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border border-gray-300 w-1/2 hover:bg-gray-100"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-500 w-1/2 text-white hover:bg-red-600"
          >
            Ya, Keluar
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavigationDialog;
