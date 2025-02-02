import axios from "axios";
import { LoginCredentials, LoginResponse } from "../types/auth";
import { API_URL } from "../config/api";


const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const loginService = async (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>("/users/login", credentials);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Log untuk debugging
        console.log("Error response:", error.response.data);
        throw new Error(error.response.data.message || "Login gagal");
      } else if (error.request) {
        throw new Error("Tidak dapat terhubung ke server");
      }
    }
    throw new Error("Terjadi kesalahan yang tidak diketahui");
  }
};
