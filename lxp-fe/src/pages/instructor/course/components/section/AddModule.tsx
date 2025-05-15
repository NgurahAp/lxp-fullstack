import React, { useState, FormEvent } from "react";
import { X, FileText, Upload } from "lucide-react";

// Props interface with explicit types
interface AddModuleFormProps {
  onClose: () => void;
  onSubmit: (data: FormData) => Promise<void>; // Return Promise
  isLoading?: boolean;
}

const AddModuleForm: React.FC<AddModuleFormProps> = ({
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const module = new FormData();
    module.append("title", title);
    if (file) {
      module.append("content", file);
    }
    try {
      await onSubmit(module);
      onClose(); // Only close after successful completion
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isProcessing = isSubmitting || isLoading;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-semibold">Add New Module</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={isProcessing}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-4 space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Module Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="Enter module title"
                required
                disabled={isProcessing}
              />
            </div>

            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Module Content (PDF)
              </label>
              <div className="border border-gray-300 rounded-lg p-3">
                {file ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm">
                      <FileText size={16} className="mr-2 text-gray-600" />
                      {file.name}
                    </div>
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="text-gray-500 hover:text-gray-700"
                      disabled={isProcessing}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-4">
                    <Upload size={24} className="text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 mb-2">
                      Drag and drop your PDF here or click to browse
                    </p>
                    <label
                      htmlFor="content"
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors"
                    >
                      Browse Files
                    </label>
                    <input
                      id="content"
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      required
                      disabled={isProcessing}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 p-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 text-white rounded-lg transition-colors ${
                isProcessing || file == null
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gray-900 hover:bg-gray-800"
              }`}
              disabled={isProcessing || file == null}
            >
              {isProcessing ? "Adding..." : "Add Module"}
            </button>
          </div>
        </form>

        <div className="bg-gray-50 p-4 border-t">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 text-blue-700 p-2 rounded-full">
              <FileText size={18} />
            </div>
            <div className="text-sm text-gray-600">
              <p className="font-medium mb-1">Quick Tip</p>
              <p>
                Upload PDF files for module content. The file will be stored and
                available for students to download.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddModuleForm;
