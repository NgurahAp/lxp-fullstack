import Cookies from "js-cookie";
import { API_URL } from "../config/api";
import { ScoreResponse } from "../types/score";
import axios from "axios";

export const getScore = async (
  trainingId: string | undefined
): Promise<ScoreResponse> => {
  const token = Cookies.get("token");

  try {
    const response = await axios.get(
      `${API_URL}/trainings/${trainingId}/scores`,
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
        throw new Error("Training tidak ditemukan");
      }
      throw new Error(
        error.response?.data?.message || "Terjadi kesalahan pada server"
      );
    }
    throw new Error("Terjadi kesalahan yang tidak diketahui");
  }
};
