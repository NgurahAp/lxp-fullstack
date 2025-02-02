import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthState, LoginCredentials } from "../types/auth";
import { loginService } from "../service/authService";

export const useAuth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
  });

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await loginService(credentials);

      if (response.data) {
        const { token, ...userData } = response.data;

        // Simpan token ke localStorage
        localStorage.setItem("token", token);

        // Update auth state
        setAuthState({
          isAuthenticated: true,
          user: userData,
          token: token,
        });

        return true;
      }
      return false;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Terjadi kesalahan saat login"
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuthState({
      isAuthenticated: false,
      user: null,
      token: null,
    });
    navigate("/login");
  };

  return {
    login,
    logout,
    isLoading,
    error,
    authState,
  };
};
