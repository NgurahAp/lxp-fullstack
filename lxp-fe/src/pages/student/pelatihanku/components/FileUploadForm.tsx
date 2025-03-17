import { useState } from "react";
import { FaUpload } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SubmitDialog from "./dialog/SubmitDialog";
import CancelDialog from "./dialog/CancelDialog";
import { UseMutationResult } from "@tanstack/react-query";
import { useSubmitTaskAnswer } from "../../../../hooks/useTask";

type FileUploadFormProps = {
  taskId: string | undefined;
};

export const FileUploadForm = ({ taskId }: FileUploadFormProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const navigate = useNavigate();
  const [isFileTooLarge, setIsFileTooLarge] = useState(false); // State baru

  const { mutate: submitAnswer, isPending } =
    useSubmitTaskAnswer() as UseMutationResult;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile?.type === "application/pdf") {
      if (selectedFile.size > 2 * 1024 * 1024) {
        setIsFileTooLarge(true);
        toast.error("File terlalu besar! Maksimal ukuran file adalah 2MB");
        setFile(null);
      } else {
        setIsFileTooLarge(false);
        setFile(selectedFile);
      }
    }
  };

  const handleSubmit = () => {
    const loadingToast = toast.loading("Sedang mengirim rangkuman...");
    submitAnswer(
      {
        taskId,
        file,
      },
      {
        onSuccess: () => {
          toast.dismiss(loadingToast);
          toast.success("Tugas berhasil dikirim!");
          resetForm();
          navigate(0); // Refresh the page
        },
        onError: (error) => {
          toast.dismiss(loadingToast);
          toast.error("Terjadi kesalahan saat mengirim tugas");
          console.log(error);
        },
      }
    );
    setShowSubmitDialog(false);
  };

  const handleCancel = () => {
    resetForm();
    setShowCancelDialog(false);
  };

  const resetForm = () => {
    setFile(null);
  };

  const isSubmitDisabled = !file || isPending || isFileTooLarge;

  return (
    <div>
      <h1 className="md:text-2xl text-base font-bold">Penyerahan Berkas</h1>
      <div>
        {/* File Box */}
        <div>
          <label
            htmlFor="file"
            className="block md:text-base text-xs font-medium text-gray-700"
          >
            Unggah Berkas File
          </label>
          <div className="mt-2 border-2 border-dashed border-gray-300 bg-gray-50 py-3 rounded-md">
            <input
              type="file"
              id="file"
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,application/pdf"
            />

            <label
              htmlFor="file"
              className="block text-center h-56 text-gray-500 cursor-pointer"
            >
              {file ? (
                <div className="md:w-1/5 flex flex-col justify-center h-full">
                  <div className="flex justify-between mx-3 p-3 border border-gray-200 rounded-t-md bg-white">
                    <p className="font-medium md:text-base text-sm text-gray-700 text-left pr-5 truncate">
                      {file.name}
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setFile(null);
                      }}
                      className="md:text-3xl hover:text-red-500 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="mx-3 h-36 bg-gray-300">
                    <div className="flex items-center justify-center h-full">
                      <img src="/penugasan/pdf.png" className="w-1/3" alt="" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col justify-center md:text-base text-sm px-5 items-center h-full">
                  <FaUpload className="flex justify-center items-center w-full text-3xl  md:text-4xl pb-3" />
                  Klik untuk upload atau drag and drop
                  <p className="mt-1 text-xs text-gray-500">
                    Upload file PDF (Max. 2MB)
                  </p>
                  <div className="flex justify-center pt-3 md:pt-5">
                    <div className="flex gap-2 py-2 px-3 text-xs md:text-sm bg-blue-500 text-white rounded-lg items-center justify-center">
                      <CiSearch />
                      Cari File
                    </div>
                  </div>
                </div>
              )}
            </label>
          </div>
        </div>
        {/* Buttons */}
        <div className="flex justify-between pt-8 pb-4">
          <button
            type="button"
            onClick={() => setShowCancelDialog(true)}
            className="md:px-14 px-8 py-2 text-xs md:text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors disabled:bg-red-300 disabled:cursor-not-allowed"
            disabled={isSubmitDisabled}
          >
            Batal
          </button>
          <button
            type="button"
            className="md:px-14 px-8 py-2 text-xs md:text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
            onClick={() => setShowSubmitDialog(true)}
            disabled={isSubmitDisabled}
          >
            {isPending ? "Mengirim..." : "Kirim"}
          </button>
        </div>
      </div>
      {showCancelDialog && (
        <CancelDialog
          onClose={() => setShowCancelDialog(false)}
          onSubmit={handleCancel}
        />
      )}
      {showSubmitDialog && (
        <SubmitDialog
          onClose={() => setShowSubmitDialog(false)}
          onSubmit={handleSubmit}
        />
      )}
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};
