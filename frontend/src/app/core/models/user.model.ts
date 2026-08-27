export interface User {
  id?: string;
  username: string;
  email: string;
  role?: 'user' | 'admin';
  totalScore?: number;
  casesSolved?: number;
  createdAt?: string;
}

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  message?: string;
}
