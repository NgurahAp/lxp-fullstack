import { TrainingResponse } from "../types/training";
import Cookies from "js-cookie";
import { API_URL } from "../config/api";
import axios from "axios";

export const getTask = async (
  meetingId: string | undefined,
  taksId: string | undefined
): Promise<TrainingResponse> => {
  const token = Cookies.get("token");

  try {
    const response = await axios.get(
      `${API_URL}/meetings/${meetingId}/tasks/${taksId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error("Task tidak ditemukan");
      }
      throw new Error(
        error.response?.data?.message || "Terjadi kesalahan pada server"
      );
    }
    throw new Error("Terjadi kesalahan yang tidak diketahui");
  }
};
