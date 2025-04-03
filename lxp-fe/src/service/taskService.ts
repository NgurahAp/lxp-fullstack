import Cookies from "js-cookie";
import { API_URL } from "../config/api";
import axios from "axios";
import { SubmitTaskRequest, TaskResponse } from "../types/task";

export const getTask = async (
  meetingId: string | undefined,
  taksId: string | undefined
): Promise<TaskResponse> => {
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

export const submitTaskAnswer = async ({
  taskId,
  file,
}: SubmitTaskRequest): Promise<TaskResponse> => {
  if (!file) {
    throw new Error("No file selected");
  }

  const formData = new FormData();
  formData.append("taskAnswer", file);

  const token = Cookies.get("token");

  try {
    const response = await axios.post(
      `${API_URL}/tasks/${taskId}/submit`,
      formData,
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

export const getInstructorDetailTask = async (
  meetingId: string | undefined,
  trainingId: string | undefined,
  taksId: string | undefined
): Promise<TaskResponse> => {
  const token = Cookies.get("token");

  try {
    const response = await axios.get(
      `${API_URL}/trainings/${trainingId}/meetings/${meetingId}/tasks/${taksId}`,
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
