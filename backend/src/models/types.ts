import { Request } from 'express';

export interface User {
  id: string;
  email: string;
  password: string; // hashed
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

export interface CreateUserRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: Omit<User, 'password'>;
}

export interface GenerateImageRequest {
  prompt: string;
}

export interface GenerateImageResponse {
  imageUrl: string;
}

export interface SaveImageRequest {
  prompt: string;
  imageUrl: string;
}

export interface JwtPayload {
  userId: string;
  email: string;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}