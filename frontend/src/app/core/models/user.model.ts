export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'BUSINESS_OWNER' | 'CUSTOMER';
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: User;
}
