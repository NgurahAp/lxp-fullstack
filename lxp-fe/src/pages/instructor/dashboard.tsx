import React from "react";
import { Users, BookOpen } from "lucide-react";
import { useGetInstructorDashboard } from "../../hooks/useDashboard";
import { Link } from "react-router-dom";

interface StatsCardProps {
  title: string;
  value: number | undefined;
  icon: React.ReactNode;
  bgColor: string;
}

const InstructorDashboard: React.FC = () => {
  const { data, isLoading, error } = useGetInstructorDashboard();

  // Show loading state while data is being fetched
  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  // Show error state if there's an error
  if (error) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div>Error: {error.message}</div>
      </div>
    );
  }

  console.log(data);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome back, {data?.profile?.name?.split(" ")[0]}!
            </h1>
            <p className="text-gray-600">
              Here's an overview of your teaching activity
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-6">
            <StatsCard
              title="Total Courses"
              value={data?.summary.totalCourses}
              icon={<BookOpen className="text-blue-600" />}
              bgColor="bg-blue-100"
            />
            <StatsCard
              title="Active Students"
              value={data?.summary.totalUniqueStudents}
              icon={<Users className="text-green-600" />}
              bgColor="bg-green-100"
            />
          </div>

          {/* Recent Courses */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">Your Courses</h2>
              <h2 className="text-s">Edit Courses</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Students
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data?.courses.map((course) => (
                    <tr key={course.id}>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {course.title}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {course.totalStudents} students
                        </div>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <Link
                          className="text-blue-600 hover:text-blue-800 mr-2"
                          to={`/editTraining/${course.id}`}
                          state={{ trainingData: course }}
                        >
                          Edit
                        </Link>
                        <Link
                          className="text-gray-600 hover:text-gray-800"
                          to={`/instructorCourse/${course.id}`}
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  bgColor,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 flex items-center">
      <div className={`${bgColor} p-3 rounded-lg`}>{icon}</div>
      <div className="ml-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <div className="text-2xl font-bold">{value}</div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
