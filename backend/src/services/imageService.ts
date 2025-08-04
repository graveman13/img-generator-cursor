import { Image, SaveImageRequest } from '../models/types';
import { v4 as uuidv4 } from 'uuid';

// Тимчасове сховище зображень (в продакшені буде база даних)
const images: Image[] = [];

export const saveImage = (userId: string, imageData: SaveImageRequest): Image => {
  const newImage: Image = {
    id: uuidv4(),
    userId,
    prompt: imageData.prompt,
    imageUrl: imageData.imageUrl,
    createdAt: new Date()
  };

  images.push(newImage);
  return newImage;
};

export const getUserImages = (userId: string): Image[] => {
  return images.filter(image => image.userId === userId);
};

export const getImageById = (imageId: string): Image | null => {
  return images.find(image => image.id === imageId) || null;
};