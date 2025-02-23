import { GoAlert } from "react-icons/go";

interface CancelDialogProps {
  onClose: () => void;
  onSubmit: () => void;
}

const CancelDialog = ({ onClose, onSubmit }: CancelDialogProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg h-72 flex flex-col justify-center items-center w-[30rem]">
        <div className="text-center p-3 mb-8 bg-red-100 rounded-full">
          <GoAlert className="text-red-500 text-xl" />
        </div>
        <h2 className="text-xl font-semibold text-center mb-2 mx-5">
          Apakah Anda yakin ingin menghapus?
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Cek kembali dokumen anda dengan benar!
        </p>
        <div className="flex justify-center gap-4 px-5 w-full">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border border-gray-300 w-1/2 hover:bg-gray-100"
          >
            Tinjau Ulang
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 rounded bg-red-500 w-1/2 text-white hover:bg-red-600"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelDialog;
