import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { AuthService, UserService } from "../service/authService";
import {
  LoginResponse,
  LoginCredentials,
  UserData,
  RegisterResponse,
  RegisterCredentials,
  ForgetPasswordCredentials,
  ResetPasswordProps,
} from "../types/auth";

interface UseAuthReturn {
  login: UseMutationResult<LoginResponse, Error, LoginCredentials>;
  register: UseMutationResult<RegisterResponse, Error, RegisterCredentials>;
  forgetPw: UseMutationResult<
    RegisterResponse,
    Error,
    ForgetPasswordCredentials
  >;
  resetPw: UseMutationResult<RegisterResponse, Error, ResetPasswordProps>;
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
        id: response.data.id,
        name: response.data.name,
        email: response.data.email,
        avatar: response.data.profile,
      };

      localStorage.setItem("user_data", JSON.stringify(userDataForStorage));

      // Conditional routing berdasarkan role
      if (response.data.role === "student") {
        navigate("/dashboard");
      } else if (response.data.role === "instructor") {
        navigate("/instructorDashboard");
      } else {
        // Default route jika role tidak dikenali
        navigate("/dashboard");
      }
    },
  });

  const register = useMutation<RegisterResponse, Error, RegisterCredentials>({
    mutationFn: AuthService.register,
    onSuccess: () => {
      navigate("/login");
    },
  });

  const logout = () => {
    Cookies.remove("token");
    localStorage.clear();
    navigate("/");
  };

  const forgetPw = useMutation<
    RegisterResponse,
    Error,
    ForgetPasswordCredentials
  >({
    mutationFn: AuthService.forgetPw,
    onSuccess: () => {
      navigate("/login");
    },
  });

  const resetPw = useMutation<RegisterResponse, Error, ResetPasswordProps>({
    mutationFn: (props: ResetPasswordProps) =>
      AuthService.resetPw(props.credentials, props.resetToken),
    onSuccess: () => {
      navigate("/login");
    },
  });

  return {
    login,
    logout,
    register,
    forgetPw,
    resetPw,
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
