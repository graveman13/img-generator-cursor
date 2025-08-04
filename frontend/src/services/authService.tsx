import { AuthResponse, LoginData, RegisterData } from '@/types'
import { apiService } from './api'

class AuthService {
  public async login(data: LoginData): Promise<AuthResponse> {
    return apiService.post<AuthResponse, LoginData>('/auth/login', data)
  }

  public async register(data: RegisterData): Promise<AuthResponse> {
    return apiService.post<AuthResponse, RegisterData>('/auth/register', data)
  }
}

export const authService = new AuthService()