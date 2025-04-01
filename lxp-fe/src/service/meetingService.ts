import { CreateMeetingResponse, UpdateMeetingParams } from "../types/meeting";
import axios from "axios";
import Cookies from "js-cookie";
import { API_URL } from "../config/api";

export const createMeeting = async (payload: {
  trainingId: string;
  title: string;
}): Promise<CreateMeetingResponse> => {
  const token = Cookies.get("token");

  try {
    const response = await axios.post(`${API_URL}/meetings`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 403) {
        throw new Error("Kamu tidak memiliki hak akses");
      }
      if (error.response?.status === 404) {
        throw new Error("Kamu hanya bisa membuat pelatihan dengan id kamu");
      }
      throw new Error(
        error.response?.data?.message || "Terjadi kesalahan pada server"
      );
    }
    throw new Error("Terjadi kesalahan yang tidak diketahui");
  }
};

export const updateMeeting = async ({
  trainingId,
  meetingId,
  title,
}: UpdateMeetingParams): Promise<CreateMeetingResponse> => {
  const token = Cookies.get("token");

  try {
    const response = await axios.put(
      `${API_URL}/trainings/${trainingId}/meetings/${meetingId}`,
      { title: title },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 403) {
        throw new Error("Kamu tidak memiliki hak akses");
      }
      if (error.response?.status === 404) {
        throw new Error("Kamu hanya bisa membuat pelatihan dengan id kamu");
      }
      throw new Error(
        error.response?.data?.message || "Terjadi kesalahan pada server"
      );
    }
    throw new Error("Terjadi kesalahan yang tidak diketahui");
  }
};
