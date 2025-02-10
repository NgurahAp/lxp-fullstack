export interface LoginCredentials {
  email: string;
  password: string;
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
