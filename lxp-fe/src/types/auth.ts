export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  data: {
    id: number;
    name: string;  // Sesuai dengan response API
    token: string;
    role: string;
  };
}

export interface AuthState {
  isAuthenticated: boolean;
  user: UserData | null;
  token: string | null;
}

// Sesuaikan UserData dengan struktur data yang diterima dari API
export interface UserData {
  id: number;
  name: string;     // Gunakan name alih-alih username
  role: string;
  // Hapus email karena tidak ada dalam response
}