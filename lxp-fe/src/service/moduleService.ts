import axios from "axios";
import Cookies from "js-cookie";
import { API_URL } from "../config/api";
import {
  CreateModuleParams,
  DeleteModuleParams,
  ModuleResponse,
  SubmitModuleResponse,
  UpdateModuleParams,
} from "../types/module";

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

export const submitModuleAnswer = async (
  moduleId: string | undefined,
  answer: string
): Promise<SubmitModuleResponse> => {
  const token = Cookies.get("token");

  try {
    const response = await axios.post(
      `${API_URL}/modules/${moduleId}/answer`,
      { answer },
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

export const createModule = async ({
  meetingId,
  payload,
}: CreateModuleParams): Promise<ModuleResponse> => {
  const token = Cookies.get("token");

  try {
    const response = await axios.post(
      `${API_URL}/meetings/${meetingId}/modules`,
      payload,
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
        throw new Error("Meeting tidak di temukan atau kamu bukan instructor");
      }
      if (error.response?.status === 400) {
        throw new Error("File pdf diperlukan");
      }
      throw new Error(
        error.response?.data?.message || "Terjadi kesalahan pada server"
      );
    }
    throw new Error("Terjadi kesalahan yang tidak diketahui");
  }
};

export const updateModule = async ({
  trainingId,
  meetingId,
  moduleId,
  payload,
}: UpdateModuleParams): Promise<ModuleResponse> => {
  const token = Cookies.get("token");

  try {
    const response = await axios.put(
      `${API_URL}/trainings/${trainingId}/meetings/${meetingId}/modules/${moduleId}`,
      payload,
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
        throw new Error("Module tidak di temukan atau kamu bukan instructor");
      }
      throw new Error(
        error.response?.data?.message || "Terjadi kesalahan pada server"
      );
    }
    throw new Error("Terjadi kesalahan yang tidak diketahui");
  }
};

export const deleteModule = async ({
  trainingId,
  meetingId,
  moduleId,
}: DeleteModuleParams): Promise<ModuleResponse> => {
  const token = Cookies.get("token");

  try {
    const response = await axios.delete(
      `${API_URL}/trainings/${trainingId}/meetings/${meetingId}/modules/${moduleId}`,
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
        throw new Error("Module tidak di temukan atau kamu bukan instructor");
      }
      throw new Error(
        error.response?.data?.message || "Terjadi kesalahan pada server"
      );
    }
    throw new Error("Terjadi kesalahan yang tidak diketahui");
  }
};
