import axios from "axios";
import Cookies from "js-cookie";
import { API_URL } from "../config/api";
import {
  DetailQuizInstructorResponse,
  QuizResponse,
  QuizSubmissionPayload,
} from "../types/quiz";

export const getQuiz = async (
  meetingId: string | undefined,
  quizId: string | undefined
): Promise<QuizResponse> => {
  const token = Cookies.get("token");

  try {
    const response = await axios.get(
      `${API_URL}/meetings/${meetingId}/quizzes/${quizId}`,
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
        throw new Error("Quiz tidak ditemukan");
      }
      throw new Error(
        error.response?.data?.message || "Terjadi kesalahan pada server"
      );
    }
    throw new Error("Terjadi kesalahan yang tidak diketahui");
  }
};

export const getQuizQuestion = async (
  meetingId: string | undefined,
  quizId: string | undefined
): Promise<QuizResponse> => {
  const token = Cookies.get("token");

  try {
    const response = await axios.get(
      `${API_URL}/meetings/${meetingId}/quizzes/${quizId}/questions`,
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
        throw new Error("Quiz tidak ditemukan");
      }
      throw new Error(
        error.response?.data?.message || "Terjadi kesalahan pada server"
      );
    }
    throw new Error("Terjadi kesalahan yang tidak diketahui");
  }
};

export const getDetailQuizInstructor = async (
  trainingId: string | undefined,
  meetingId: string | undefined,
  quizId: string | undefined
): Promise<DetailQuizInstructorResponse> => {
  const token = Cookies.get("token");

  try {
    const response = await axios.get(
      `${API_URL}/trainings/${trainingId}/meetings/${meetingId}/quizzes/${quizId}`,
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
        throw new Error("Quiz tidak ditemukan");
      }
      throw new Error(
        error.response?.data?.message || "Terjadi kesalahan pada server"
      );
    }
    throw new Error("Terjadi kesalahan yang tidak diketahui");
  }
};

export const submitQuiz = async (
  quizId: string | undefined,
  payload: QuizSubmissionPayload
): Promise<QuizResponse> => {
  const token = Cookies.get("token");

  try {
    const response = await axios.post(
      `${API_URL}/quizzes/${quizId}/submit`,
      payload,
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
        throw new Error("Quiz tidak ditemukan");
      }
      throw new Error(
        error.response?.data?.message || "Terjadi kesalahan pada server"
      );
    }
    throw new Error("Terjadi kesalahan yang tidak diketahui");
  }
};
