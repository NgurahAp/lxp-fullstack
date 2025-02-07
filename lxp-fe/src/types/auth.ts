export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UserData {
  id: number;
  email: string;
  token: string;
  role: string;
  profile: null | string;
}

export interface LoginResponse {
  data: UserData;
}
