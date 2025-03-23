import React, { useState, useEffect } from "react";
import { Save, Upload, X, Trash2, AlertTriangle } from "lucide-react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { InstructorTraining } from "../../../../types/training";

const EditTrainingForm = () => {
  const { trainingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Get training data from location state
  const trainingData = location.state?.trainingData as InstructorTraining;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // const updateTrainingMutation = useUpdateTraining();
  // const deleteTrainingMutation = useDeleteTraining();

  // Populate form with existing data
  useEffect(() => {
    if (trainingData) {
      setTitle(trainingData.title);
      setDescription(trainingData.description);

      // Set image preview if available
      if (trainingData.image) {
        setImagePreview(`http://localhost:3001/public${trainingData.image}`);
      }
    } else {
      // Fallback if no data was passed - redirect back to courses
      navigate("/instructorCourse");
    }
  }, [trainingData, navigate]);

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
    setIsSubmitting(true);

    const instructorData = JSON.parse(
      localStorage.getItem("user_data") || "{}"
    );
    const instructorId = instructorData.id;

    // Create form data for submission with file
    const training = new FormData();
    training.append("title", title);
    training.append("instructorId", instructorId);
    training.append("description", description);
    if (image) {
      training.append("image", image);
    }
    // Flag to indicate if the image was changed or not
    training.append("imageChanged", image ? "true" : "false");

    try {
      // updateTrainingMutation.mutate(
      //   { id: trainingId, formData: training },
      //   {
      //     onSuccess: () => {
      //       navigate("/instructorCourse");
      //     },
      //     onError: (error) => {
      //       console.error("Error updating training:", error);
      //       setIsSubmitting(false);
      //     },
      //   }
      // );

      // Simulate success for now
      setTimeout(() => {
        navigate("/instructorCourse");
      }, 1000);
    } catch (error) {
      console.error("Error updating training:", error);
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    if (!trainingId) return;

    setIsDeleting(true);

    try {
      // deleteTrainingMutation.mutate(trainingId, {
      //   onSuccess: () => {
      //     navigate("/instructorCourse");
      //   },
      //   onError: (error) => {
      //     console.error("Error deleting training:", error);
      //     setIsDeleting(false);
      //     setShowDeleteConfirm(false);
      //   }
      // });

      // Simulate success for now
      setTimeout(() => {
        navigate("/instructorCourse");
      }, 1000);
    } catch (error) {
      console.error("Error deleting training:", error);
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  // Show loading state if data isn't available yet
  if (!trainingData) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div>Redirecting...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Edit Training</h1>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 border border-red-500 text-red-500 rounded-lg flex items-center gap-2 hover:bg-red-50 transition-colors"
            disabled={isDeleting}
          >
            <Trash2 size={16} />
            {isDeleting ? "Deleting..." : "Delete Course"}
          </button>
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
                      <Upload size={16} /> Select Image
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
              <Link
                to={"/instructorCourse"}
                className="px-4 py-2 border border-gray-300 rounded-lg mr-2 hover:bg-gray-50 text-gray-700 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="px-4 py-2 bg-gray-900 text-white rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors"
                disabled={isSubmitting}
              >
                <Save size={16} />{" "}
                {isSubmitting ? "Saving changes..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <div className="flex items-center gap-3 text-red-500 mb-4">
              <AlertTriangle size={24} />
              <h3 className="text-lg font-semibold">Delete Training</h3>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{title}</span>? This action cannot
              be undone and will remove all associated content including lessons
              and materials.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-500 text-white rounded-lg flex items-center gap-2 hover:bg-red-600 transition-colors"
              >
                <Trash2 size={16} />
                {isDeleting ? "Deleting..." : "Delete Training"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditTrainingForm;
