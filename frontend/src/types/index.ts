export interface User {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Image {
  id: string;
  userId: string;
  prompt: string;
  imageUrl: string;
  createdAt: Date;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
}

export interface GenerateImageData {
  prompt: string;
}

export interface ApiError {
  message: string;
  code?: string;
} 