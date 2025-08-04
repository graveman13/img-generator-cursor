import { Response } from 'express';
import { generateImage } from '../services/replicateService';
import { saveImage, getUserImages } from '../services/imageService';
import { 
  AuthenticatedRequest, 
  GenerateImageRequest, 
  GenerateImageResponse,
  SaveImageRequest 
} from '../models/types';

export const generateImageHandler = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { prompt } = req.body as GenerateImageRequest;

    if (!prompt) {
      res.status(400).json({ error: 'Prompt is required' });
      return;
    }

    if (!req.user) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const imageUrl = await generateImage(prompt);

    const response: GenerateImageResponse = {
      imageUrl
    };

    res.json(response);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Image generation failed';
    res.status(500).json({ error: errorMessage });
  }
};

export const saveImageHandler = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { prompt, imageUrl } = req.body as SaveImageRequest;

    if (!prompt || !imageUrl) {
      res.status(400).json({ error: 'Prompt and imageUrl are required' });
      return;
    }

    if (!req.user) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const savedImage = saveImage(req.user.userId, { prompt, imageUrl });

    res.status(201).json(savedImage);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Save image failed';
    res.status(500).json({ error: errorMessage });
  }
};

export const getUserImagesHandler = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const userImages = getUserImages(req.user.userId);

    res.json(userImages);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Fetch images failed';
    res.status(500).json({ error: errorMessage });
  }
};