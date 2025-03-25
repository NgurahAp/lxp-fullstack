import React, { useState, useEffect } from "react";
import { RiFileEditLine, RiLoader4Line } from "react-icons/ri";
import { UseMutationResult } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useSubmitModuleAnswer } from "../../../../hooks/useModule";

interface ModuleSubmitDialogProps {
  onComplete?: () => void;
  moduleId: number | undefined;
}

export const ModuleSubmitDialog: React.FC<ModuleSubmitDialogProps> = ({
  onComplete,
  moduleId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [summary, setSummary] = useState("");

  const { mutate: submitAnswer, isPending } =
    useSubmitModuleAnswer() as UseMutationResult;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const dialog = document.getElementById("dialog-content");
      if (dialog && !dialog.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading("Sedang mengirim rangkuman...");
    submitAnswer(
      {
        moduleId,
        answer: summary,
      },
      {
        onSuccess: () => {
          toast.dismiss(loadingToast);
          onComplete?.();
          setSummary("");
          setIsOpen(false);
        },
        onError: () => {
          toast.dismiss(loadingToast);
        },
      }
    );
  };

  const isSubmitDisabled = summary.length < 52 || isPending;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="mt-4 px-20 py-4 flex rounded-lg items-center bg-blue-600 text-xl gap-2 text-white hover:bg-blue-700"
      >
        <RiFileEditLine className="text-white text-2xl" />
        Selesaikan Modul
      </button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black bg-opacity-50" />

          <div
            id="dialog-content"
            className="bg-white rounded-lg w-full max-w-2xl mx-4 p-6 z-50 relative"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Rangkuman Pembelajaran
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium text-gray-700">
                  Materi apa yang kamu pelajari dalam ini?
                </h3>

                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Tuliskan rangkuman pemahamanmu dari modul yang telah dipelajari..."
                  className="w-full min-h-[200px] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
                <div className="text-sm text-red-500 text-end">
                  {summary.length < 52 && (
                    <span>
                      Minimal {52 - summary.length} karakter lagi untuk dapat
                      mengirim
                    </span>
                  )}
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-blue-800">
                    Materi kamu akan di review oleh dosen atau pembimbing kamu.
                    Pastikan kamu mengisi dengan sesuai!
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitDisabled}
                  className={`px-6 py-2 rounded-md transition-colors flex items-center gap-2 ${
                    isSubmitDisabled
                      ? "bg-gray-300 cursor-not-allowed text-gray-500"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {isPending ? (
                    <div className="flex items-center">
                      <RiLoader4Line className="animate-spin mr-2" />
                      Mengirim...
                    </div>
                  ) : (
                    "Kirim"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
