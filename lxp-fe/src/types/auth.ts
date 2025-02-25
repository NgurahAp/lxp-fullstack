export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface ForgetPasswordCredentials {
  email: string;
}

export interface ResetPasswordCredentials {
  password: string;
}

export interface ResetPasswordProps {
  credentials: ResetPasswordCredentials;
  resetToken: string;
}

export interface RegisterResponse {
  data: { name: string; email: string; password: string };
}

export interface LoginResponse {
  data: {
    id: number;
    name: string;
    email: string;
    token: string;
    profile: string | undefined;
  };
}

interface Training {
  id: number;
  title: string;
  description: string;
  image: string | undefined;
  status: string;
  instructor: string;
  averageScore: number;
}

export interface UserData {
  id: number;
  email: string;
  name: string;
  role: string;
  avatar: string;
  trainings: Training[];
  totalTrainings: number;
  overallAverageScore: number;
}

export interface UserResponse {
  data: UserData;
}
