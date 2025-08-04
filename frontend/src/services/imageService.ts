import { Image, GenerateImageData } from '@/types'
import { apiService } from './api'

class ImageService {
  public async generateImage(data: GenerateImageData): Promise<{ imageUrl: string }> {
    return apiService.post<{ imageUrl: string }, GenerateImageData>('/images/generate', data)
  }

  public async saveImage(imageUrl: string, prompt: string): Promise<Image> {
    return apiService.post<Image, { imageUrl: string; prompt: string }>('/images/save', {
      imageUrl,
      prompt,
    })
  }

  public async getUserImages(userId: string): Promise<Image[]> {
    return apiService.get<Image[]>(`/images/user/${userId}`)
  }
}

export const imageService = new ImageService()
