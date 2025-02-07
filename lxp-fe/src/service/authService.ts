import { API_URL } from "../config/api";
import { LoginCredentials, LoginResponse } from "../types/auth";
import axios from "axios";

export const AuthService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const response = await axios.post<LoginResponse>(
        `${API_URL}/users/login`,
        credentials
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "Terjadi kesalahan pada server"
        );
      }
      throw new Error("Terjadi kesalahan yang tidak diketahui");
    }
  },
};
