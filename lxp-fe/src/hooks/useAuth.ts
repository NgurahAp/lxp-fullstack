import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { AuthService, UserService } from "../service/authService";
import { LoginResponse, LoginCredentials, UserData } from "../types/auth";

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
    localStorage.clear();
    navigate("/");
  };

  return {
    login,
    logout,
    isAuthenticated: !!Cookies.get("token"),
  };
};

export const useUser = (): UseQueryResult<UserData, Error> => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await UserService.getCurrentUser();
      const userData = response.data;

      // Simpan ke localStorage
      localStorage.setItem("user_email", userData.email);
      localStorage.setItem("user_name", userData.name);
      localStorage.setItem("user_role", userData.role);
      localStorage.setItem("user_avatar", userData.avatar);
      localStorage.setItem(
        "user_totalTrainings",
        userData.totalTrainings.toString()
      );

      return userData;
    },
  });
};
