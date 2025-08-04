import Replicate from 'replicate';
import { config } from '../utils/config';

const replicate = new Replicate({
  auth: config.replicateApiToken
});

export const generateImage = async (prompt: string): Promise<string> => {
  if (!config.replicateApiToken) {
    throw new Error('Replicate API token not configured');
  }

  try {
    const output = await replicate.run(
      "stability-ai/stable-diffusion:27b93a2413e7f36cd83da926f3656280b2931564ff050bf9575f1fdf9bcd7478",
      {
        input: {
          prompt: prompt,
          width: 512,
          height: 512,
          num_inference_steps: 50,
          guidance_scale: 7.5
        }
      }
    );

    if (Array.isArray(output) && output.length > 0) {
      return output[0] as string;
    }

    if (typeof output === 'string') {
      return output;
    }

    throw new Error('Unexpected response format from Replicate API');
  } catch (error) {
    console.error('Error generating image:', error);
    throw new Error('Failed to generate image');
  }
};