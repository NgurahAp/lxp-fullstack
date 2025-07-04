import { useState } from "react";
import { PlusCircle, Search, Book, Users, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { useGetTrainingsInstructor } from "../../../hooks/useTrainings";
import { API_ASSETS } from "../../../config/api";

const CoursePage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, error } = useGetTrainingsInstructor();

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div>Error: {error.message}</div>
      </div>
    );
  }

  return (
    <div className=" min-h-screen p-6 ">
      <div className="mb-8 bg-white p-5 rounded-md shadow-sm ">
        <div className="flex flex-col md:flex-row justify-between items-center mb-5">
          <h1 className="text-2xl font-bold text-gray-900">Your Courses</h1>
          <Link
            to="/CreateTraining"
            className="mt-4 md:mt-0 px-5 py-2.5 bg-gray-900 text-white rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors"
          >
            <PlusCircle size={18} /> Create New Course
          </Link>
        </div>
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search courses..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-auto mt-4 md:mt-0">
            <button className="px-5 py-2.5 border border-gray-900 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors">
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="mb-8 bg-white p-5 rounded-md shadow-sm ">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.data.training.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-200"
            >
              <div className="h-48 bg-gray-200 relative">
                <img
                  src={
                    course?.image
                      ? `${API_ASSETS}${course.image}`
                      : undefined
                  }
                  alt={course.title}
                  className="w-full h-full object-fill"
                />
              </div>
              <div className="p-5">
                <h2 className="font-semibold text-lg text-gray-900 line-clamp-2 h-14">
                  {course.title}
                </h2>
                <p className="text-sm text-gray-600 mt-3 line-clamp-2 h-10">
                  {course.description}
                </p>
                <div className="flex items-center justify-between mt-5 text-sm text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <Users size={16} className="text-gray-400" />
                    <span>{course._count.users} students</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar size={16} className="text-gray-400" />
                    <span>{course._count.meetings} meetings</span>
                  </div>
                </div>
                <div className="mt-4 text-xs text-gray-500">
                  Last updated:{" "}
                  {new Date(course.updatedAt).toLocaleDateString()}
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <Link
                    to={`/instructorCourse/${course.id}`}
                    className="px-4 py-2 border border-gray-900 text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors text-center"
                  >
                    View
                  </Link>
                  <Link
                    to={`/editTraining/${course.id}`}
                    state={{ trainingData: course }}
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors text-center"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {data?.data.training.length === 0 && (
        <div className="text-center py-16 px-6 bg-white rounded-xl shadow-sm border border-gray-200">
          <Book size={56} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-medium text-gray-800">
            No courses found
          </h3>
          <p className="text-gray-500 mt-2 max-w-md mx-auto">
            Try adjusting your search or filters, or create a new course to get
            started.
          </p>
          <div className="flex justify-center py-3">
            <Link
              to="/CreateTraining"
              className="mt-4 md:mt-0 px-5 py-2.5 bg-gray-900 text-white w-56 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors"
            >
              <PlusCircle size={18} /> Create New Course
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursePage;
