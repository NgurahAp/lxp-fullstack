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

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
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
        </Routes>
      </MainLayout>
    </Router>
  );
};

export default AppRoutes;
