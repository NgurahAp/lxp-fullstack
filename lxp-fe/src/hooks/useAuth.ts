import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { AuthService } from "../service/authService";
import { LoginResponse, LoginCredentials } from "../types/auth";

interface UseAuthReturn {
  login: UseMutationResult<LoginResponse, Error, LoginCredentials>;
  logout: () => void;
  isAuthenticated: boolean;
}

export const useAuth = (): UseAuthReturn => {
  const navigate = useNavigate();

  const login = useMutation<LoginResponse, Error, LoginCredentials>({
    mutationFn: AuthService.login,
    onSuccess: (response) => {
      const { token } = response.data;

      Cookies.set("token", token, { expires: 7 });

      navigate("/dashboard");
    },
  });

  const logout = () => {
    Cookies.remove("token");
    navigate("/login");
  };

  return {
    login,
    logout,
    isAuthenticated: !!Cookies.get("token"),
  };
};
