import axios from "axios";
import Cookies from "js-cookie";
import { TrainingResponse } from "../types/training";
import { API_URL } from "../config/api";

export const getTrainings = async (): Promise<TrainingResponse> => {
  const token = Cookies.get("token");

  try {
    const response = await axios.get(`${API_URL}/student/trainings`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error("Gagal Mengambil data");
      }
      throw new Error(
        error.response?.data?.message || "Terjadi kesalahan pada server"
      );
    }
    throw new Error("Terjadi kesalahan yang tidak diketahui");
  }
};
