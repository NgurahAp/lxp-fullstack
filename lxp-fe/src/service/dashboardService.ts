import axios from "axios";
import { API_URL } from "../config/api";
import Cookies from "js-cookie";
import { InstructorDashboardResponse } from "../types/dashboard";

export const getInstructorDashboard =
  async (): Promise<InstructorDashboardResponse> => {
    const token = Cookies.get("token");

    try {
      const response = await axios.get(`${API_URL}/instructor/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 403) {
          throw new Error("Anda tidak memiliki hak akses untuk data ini");
        }
        if (error.response?.status === 404) {
          throw new Error("Instructor tidak ditemukan");
        }
        throw new Error(
          error.response?.data?.message || "Terjadi kesalahan pada server"
        );
      }
      throw new Error("Terjadi kesalahan yang tidak diketahui");
    }
  };
