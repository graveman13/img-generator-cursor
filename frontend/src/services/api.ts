import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { ApiError } from '@/types'

class ApiService {
  private api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: 'http://localhost:8080/api',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors(): void {
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        const apiError: ApiError = {
          message: error.response?.data?.message || 'Сталася помилка',
          code: error.response?.status?.toString(),
        }
        return Promise.reject(apiError)
      }
    )
  }

  public get<T>(url: string): Promise<T> {
    return this.api.get<T>(url).then(response => response.data)
  }

  public post<T, D = any>(url: string, data?: D): Promise<T> {
    return this.api.post<T>(url, data).then(response => response.data)
  }

  public put<T, D = any>(url: string, data?: D): Promise<T> {
    return this.api.put<T>(url, data).then(response => response.data)
  }

  public delete<T>(url: string): Promise<T> {
    return this.api.delete<T>(url).then(response => response.data)
  }
}

export const apiService = new ApiService() 