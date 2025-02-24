// AppRoutes.tsx
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import { Login } from "../pages/auth/Login";
import Dashboard from "../pages/dashboard";
import { ProtectedRoute } from "./ProtectedRoute";
import { Pelatihanku } from "../pages/pelatihanku";
import { PelatihankuDetail } from "../pages/pelatihanku/DetailPelatihanku";
import { Module } from "../pages/pelatihanku/Module";
import { Quiz } from "../pages/pelatihanku/Quiz";
import { QuizAttempt } from "../pages/pelatihanku/QuizAtttempt";
import { Task } from "../pages/pelatihanku/Task";
import { Score } from "../pages/score";
import { DetailScore } from "../pages/score/DetailScore";
import { Register } from "../pages/auth/register";
import { ForgotPassword } from "../pages/auth/ForgotPassword";

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgetpw" element={<ForgotPassword />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pelatihanku"
            element={
              <ProtectedRoute>
                <Pelatihanku />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pelatihanku/:trainingId"
            element={
              <ProtectedRoute>
                <PelatihankuDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/module/:meetingId/:moduleId"
            element={
              <ProtectedRoute>
                <Module />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz/:meetingId/:quizId"
            element={
              <ProtectedRoute>
                <Quiz />
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
                <Task />
              </ProtectedRoute>
            }
          />
          <Route
            path="/score"
            element={
              <ProtectedRoute>
                <Score />
              </ProtectedRoute>
            }
          />
          <Route
            path="/score/:trainingId"
            element={
              <ProtectedRoute>
                <DetailScore />
              </ProtectedRoute>
            }
          />
        </Routes>
      </MainLayout>
    </Router>
  );
};

export default AppRoutes;
