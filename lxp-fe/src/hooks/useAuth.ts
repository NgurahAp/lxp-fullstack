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
      const userDataForStorage = {
        role: response.data.id,
        name: response.data.name,
        email: response.data.email,
        avatar: response.data.profile,
      };

      localStorage.setItem("user_data", JSON.stringify(userDataForStorage));

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

export const useGetUser = (): UseQueryResult<UserData, Error> => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await UserService.getCurrentUser();
      const userData = response.data;

      return userData;
    },
  });
};
