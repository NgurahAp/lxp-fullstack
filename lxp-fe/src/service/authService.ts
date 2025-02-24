import { API_URL } from "../config/api";
import {
  LoginCredentials,
  LoginResponse,
  RegisterCredentials,
  RegisterResponse,
} from "../types/auth";
import axios from "axios";
import { UserResponse } from "../types/auth";
import Cookies from "js-cookie";

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
        if (error.response?.status === 401) {
          throw new Error("Email atau password salah");
        }
        if (error.response?.status === 400) {
          throw new Error("Password harus lebih dari 6 karakter");
        }
        throw new Error(
          error.response?.data?.message || "Terjadi kesalahan pada server"
        );
      }
      throw new Error("Terjadi kesalahan yang tidak diketahui");
    }
  },

  register: async (
    credentials: RegisterCredentials
  ): Promise<RegisterResponse> => {
    try {
      const response = await axios.post<RegisterResponse>(
        `${API_URL}/users`,
        credentials
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error("Email already exists");
        }
        if (error.response?.status === 400) {
          throw new Error("Password harus lebih dari 6 karakter");
        }
        throw new Error(
          error.response?.data?.message || "Terjadi kesalahan pada server"
        );
      }
      throw new Error("Terjadi kesalahan yang tidak diketahui");
    }
  },
};

export const UserService = {
  getCurrentUser: async (): Promise<UserResponse> => {
    const token = Cookies.get("token");

    try {
      const response = await axios.get<UserResponse>(
        `${API_URL}/users/current`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "Gagal mengambil data user"
        );
      }
      throw new Error("Terjadi kesalahan yang tidak diketahui");
    }
  },
};
