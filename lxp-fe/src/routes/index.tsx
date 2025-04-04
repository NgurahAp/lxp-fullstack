import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import InstructorLayout from "../layouts/InstructorLayout";
import Home from "../pages/Home";
import { Login } from "../pages/auth/Login";
import { Register } from "../pages/auth/register";
import { ForgotPassword } from "../pages/auth/ForgotPassword";
import { ResetPassword } from "../pages/auth/ResetPassword";
import InstructorDashboard from "../pages/instructor/dashboard";
import { Pelatihanku } from "../pages/student/pelatihanku";
import { PelatihankuDetail } from "../pages/student/pelatihanku/DetailPelatihanku";
import { Module } from "../pages/student/pelatihanku/Module";
import { Quiz } from "../pages/student/pelatihanku/Quiz";
import { QuizAttempt } from "../pages/student/pelatihanku/QuizAtttempt";
import { Task } from "../pages/student/pelatihanku/Task";
import { Score } from "../pages/student/score";
import { DetailScore } from "../pages/student/score/DetailScore";
import { ProtectedRoute } from "./ProtectedRoute";
import Dashboard from "../pages/student/dashboard";
import CoursePage from "../pages/instructor/course";
import DetailCoursePage from "../pages/instructor/course/DetailCourse";
import CreateTrainingForm from "../pages/instructor/course/pelatihanku/CreateTraining";
import EditTrainingForm from "../pages/instructor/course/pelatihanku/EditTraining";
import InstructorQuiz from "../pages/instructor/course/pelatihanku/ViewQuiz";
import CreateQuiz from "../pages/instructor/course/pelatihanku/CreateQuiz";
import UpdateQuiz from "../pages/instructor/course/pelatihanku/UpdateQuiz";
import AdminStudentPage from "../pages/instructor/students";
import StudentSubmissionsPage from "../pages/instructor/students/Submission";

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Instructor Routes with InstructorLayout */}
        <Route
          path="/instructorDashboard"
          element={
            <ProtectedRoute>
              <InstructorLayout>
                <InstructorDashboard />
              </InstructorLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/instructorCourse"
          element={
            <ProtectedRoute>
              <InstructorLayout>
                <CoursePage />
              </InstructorLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/CreateTraining"
          element={
            <ProtectedRoute>
              <InstructorLayout>
                <CreateTrainingForm />
              </InstructorLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/editTraining/:trainingId"
          element={
            <ProtectedRoute>
              <InstructorLayout>
                <EditTrainingForm />
              </InstructorLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/instructorCourse/:trainingId"
          element={
            <ProtectedRoute>
              <InstructorLayout>
                <DetailCoursePage />
              </InstructorLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/instructorCourse/:trainingId/:meetingId/:quizId"
          element={
            <ProtectedRoute>
              <InstructorLayout>
                <InstructorQuiz />
              </InstructorLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/instructorCourse/:trainingId/:meetingId/addQuiz"
          element={
            <ProtectedRoute>
              <InstructorLayout>
                <CreateQuiz />
              </InstructorLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/instructorCourse/:trainingId/:meetingId/updateQuiz/:quizId"
          element={
            <ProtectedRoute>
              <InstructorLayout>
                <UpdateQuiz />
              </InstructorLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/instructorStudent"
          element={
            <ProtectedRoute>
              <InstructorLayout>
                <AdminStudentPage />
              </InstructorLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/instructorStudent/submission"
          element={
            <ProtectedRoute>
              <InstructorLayout>
                <StudentSubmissionsPage />
              </InstructorLayout>
            </ProtectedRoute>
          }
        />

        {/* Regular routes with MainLayout */}
        <Route
          path="/"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />

        <Route
          path="/login"
          element={
            <MainLayout>
              <Login />
            </MainLayout>
          }
        />

        <Route
          path="/register"
          element={
            <MainLayout>
              <Register />
            </MainLayout>
          }
        />

        <Route
          path="/forgetpw"
          element={
            <MainLayout>
              <ForgotPassword />
            </MainLayout>
          }
        />

        <Route
          path="/resetpw/:token"
          element={
            <MainLayout>
              <ResetPassword />
            </MainLayout>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/pelatihanku"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Pelatihanku />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/pelatihanku/:trainingId"
          element={
            <ProtectedRoute>
              <MainLayout>
                <PelatihankuDetail />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/module/:meetingId/:moduleId"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Module />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/quiz/:meetingId/:quizId"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Quiz />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/quizAttempt/:meetingId/:quizId"
          element={
            <ProtectedRoute>
              <QuizAttempt />
            </ProtectedRoute>
          }
        />

        <Route
          path="/task/:meetingId/:taskId"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Task />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/score"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Score />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/score/:trainingId"
          element={
            <ProtectedRoute>
              <MainLayout>
                <DetailScore />
              </MainLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
