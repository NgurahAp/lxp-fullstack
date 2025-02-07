export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UserData {
  id: number;
  name: string;
  email: string;
  token: string;
  role: string;
  profile: string | undefined;
}

export interface LoginResponse {
  data: UserData;
}
