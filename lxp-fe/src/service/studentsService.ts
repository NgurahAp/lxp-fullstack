import { DetailStudentResponse, StudentsResponse } from "../types/students";
import axios from "axios";
import Cookies from "js-cookie";
import { API_URL } from "../config/api";
import { ModuleScoreSubmission } from "../types/students";
import { ModuleResponse } from "../types/module";

export const getStudents = async (): Promise<StudentsResponse> => {
  const token = Cookies.get("token");

  try {
    const response = await axios.get(`${API_URL}/instructorStudents`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error("Kamu tidak memiliki hak akses Mengambil data");
      }
      throw new Error(
        error.response?.data?.message || "Terjadi kesalahan pada server"
      );
    }
    throw new Error("Terjadi kesalahan yang tidak diketahui");
  }
};

export const getDetailStudent = async (
  studentId: string | undefined
): Promise<DetailStudentResponse> => {
  const token = Cookies.get("token");

  try {
    const response = await axios.get(
      `${API_URL}/instructorStudents/${studentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error("Kamu tidak memiliki hak akses Mengambil data");
      }
      if (error.response?.status === 404) {
        throw new Error("Data peserta tidak ditemukan");
      }
      throw new Error(
        error.response?.data?.message || "Terjadi kesalahan pada server"
      );
    }
    throw new Error("Terjadi kesalahan yang tidak diketahui");
  }
};

export const submitModuleScore = async ({
  moduleScore,
  moduleId,
  trainingUserId,
}: ModuleScoreSubmission): Promise<ModuleResponse> => {
  const token = Cookies.get("token");

  try {
    const response = await axios.post(
      `${API_URL}/modules/${moduleId}/score`,
      { moduleScore: moduleScore, trainingUserId: trainingUserId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    // Error handling tetap sama
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 403) {
        throw new Error("Kamu tidak memiliki hak akses");
      }
      if (error.response?.status === 404) {
        throw new Error("Modul tidak ditemukan atau kamu bukan instructor");
      }
      throw new Error(
        error.response?.data?.message || "Terjadi kesalahan pada server"
      );
    }
    throw new Error("Terjadi kesalahan yang tidak diketahui");
  }
};
