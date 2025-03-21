import React, { useState } from "react";
import { PlusCircle, Upload, X } from "lucide-react";

const CreateTrainingForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const clearImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would handle the form submission
    console.log({ title, description, image });

    // Create form data for submission with file
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (image) {
      formData.append("image", image);
    }

    // Submit the form data
    // Example: await createTraining(formData);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Create New Training</h1>
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Title Field */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors"
                placeholder="Enter training title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Description Field */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors"
                placeholder="Enter training description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            {/* Image Upload Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Training Image
              </label>

              {imagePreview ? (
                <div className="relative mb-4">
                  <img
                    src={imagePreview}
                    alt="Training preview"
                    className="w-full max-h-64 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={clearImage}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors"
                  >
                    <X size={20} className="text-gray-600" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
                  <div className="flex flex-col items-center justify-center">
                    <Upload className="w-12 h-12 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 mb-4">
                      Drag and drop an image, or click to browse
                    </p>
                    <label className="px-4 py-2 bg-gray-900 text-white rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors cursor-pointer">
                      <PlusCircle size={16} /> Select Image
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                </div>
              )}
              <p className="text-xs text-gray-500">
                Recommended image size: 1280x720px. Maximum file size: 5MB
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-lg mr-2 hover:bg-gray-50 text-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-gray-900 text-white rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors"
              >
                <PlusCircle size={16} /> Create Training
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTrainingForm;
