import Cookies from "js-cookie";
import { API_URL } from "../config/api";
import axios from "axios";
import {
  CreateTaskParams,
  SubmitTaskRequest,
  TaskResponse,
  UpdateTaskParams,
} from "../types/task";

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

export const createTask = async ({
  meetingId,
  formData,
}: CreateTaskParams): Promise<TaskResponse> => {
  const token = Cookies.get("token");

  try {
    const response = await axios.post(
      `${API_URL}/meetings/${meetingId}/tasks`,
      { title: formData.title, taskQuestion: formData.taskQuestion },
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
      throw new Error(
        error.response?.data?.message || "Terjadi kesalahan pada server"
      );
    }
    throw new Error("Terjadi kesalahan yang tidak diketahui");
  }
};

export const updateTask = async ({
  trainingId,
  meetingId,
  taskId,
  formData,
}: UpdateTaskParams): Promise<TaskResponse> => {
  const token = Cookies.get("token");

  try {
    const response = await axios.put(
      `${API_URL}/trainings/${trainingId}/meetings/${meetingId}/tasks/${taskId}`,
      { title: formData.title, taskQuestion: formData.taskQuestion },
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
        throw new Error("Task tidak di temukan atau kamu bukan instructor");
      }
      throw new Error(
        error.response?.data?.message || "Terjadi kesalahan pada server"
      );
    }
    throw new Error("Terjadi kesalahan yang tidak diketahui");
  }
};
