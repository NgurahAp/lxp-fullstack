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
