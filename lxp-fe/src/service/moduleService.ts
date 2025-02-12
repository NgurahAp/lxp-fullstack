import axios from "axios";
import Cookies from "js-cookie";
import { API_URL } from "../config/api";
import { ModuleResponse } from "../types/module";

export const getModule = async (
  meetingId: string | undefined,
  moduleId: string | undefined
): Promise<ModuleResponse> => {
  const token = Cookies.get("token");

  try {
    const response = await axios.get(
      `${API_URL}/meetings/${meetingId}/modules/${moduleId}`,
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
        throw new Error("Module tidak ditemukan");
      }
      throw new Error(
        error.response?.data?.message || "Terjadi kesalahan pada server"
      );
    }
    throw new Error("Terjadi kesalahan yang tidak diketahui");
  }
};
