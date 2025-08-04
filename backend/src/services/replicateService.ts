import { config } from '../utils/config';

/**
 * Сервіс для генерації зображень через Segmind API
 * Використовує безкоштовну кредитну систему Segmind
 * 
 * Основні моделі: SDXL 1.0, HiDream-I1 Fast, DreamShaper Lightning
 * Особливості: високоякісні моделі з fallback механізмом
 */

interface GenerateImageParams {
  prompt: string;
  width?: number;
  height?: number;
  num_inference_steps?: number;
  guidance_scale?: number;
  negative_prompt?: string;
}

interface SegmindModel {
  name: string;
  endpoint: string;
  defaultParams: Record<string, any>;
}

// Список доступних моделей Segmind (fallback механізм)
const AVAILABLE_MODELS: SegmindModel[] = [
  {
    name: 'SDXL 1.0',
    endpoint: 'https://api.segmind.com/v1/sdxl1.0-txt2img',
    defaultParams: {
      samples: 1,
      scheduler: 'UniPC',
      num_inference_steps: 20,
      guidance_scale: 7.5,
      strength: 1.0,
      seed: -1,
      img_width: 1024,
      img_height: 1024,
      base64: false
    }
  },
  {
    name: 'HiDream-I1 Fast',
    endpoint: 'https://api.segmind.com/v1/hidream-l1-fast',
    defaultParams: {
      seed: -1,
      model_type: 'fast',
      resolution: '1024 × 1024 (Square)',
      speed_mode: 'Lightly Juiced 🍊 (more consistent)',
      output_format: 'webp',
      output_quality: 100
    }
  },
  {
    name: 'DreamShaper Lightning SDXL',
    endpoint: 'https://api.segmind.com/v1/sdxl1.0-dreamshaper-lightning',
    defaultParams: {
      samples: 1,
      scheduler: 'DPM++ SDE Karras',
      num_inference_steps: 4,
      guidance_scale: 1.5,
      seed: -1,
      img_width: 1024,
      img_height: 1024,
      base64: false
    }
  }
];

// Поточна модель (буде оновлюватися при fallback)
let currentModelIndex = 0;

// Функція для генерації placeholder зображення при помилках
const generatePlaceholderImage = (prompt: string): string => {
  console.log('Generating placeholder image - Segmind API unavailable');
  
  // Створюємо SVG зображення з текстом промпта
  const width = 1024;
  const height = 1024;
  const maxLineLength = 50;
  
  // Розбиваємо довгий текст на рядки
  const words = prompt.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  
  for (const word of words) {
    if ((currentLine + word).length <= maxLineLength) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  
  // Обмежуємо кількість рядків
  const displayLines = lines.slice(0, 10);
  
  // Генеруємо випадковий градієнт кольорів
  const colors = [
    ['#667eea', '#764ba2'],
    ['#f093fb', '#f5576c'], 
    ['#4facfe', '#00f2fe'],
    ['#43e97b', '#38f9d7'],
    ['#fa709a', '#fee140']
  ];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${randomColor[0]};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${randomColor[1]};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)"/>
      <g transform="translate(${width/2}, ${height/2})">
        <circle cx="0" cy="-120" r="80" fill="rgba(255,255,255,0.2)"/>
        <text x="0" y="-120" font-family="Arial, sans-serif" font-size="48" fill="white" text-anchor="middle">🖼️</text>
        ${displayLines.map((line, index) => 
          `<text x="0" y="${(index - displayLines.length/2) * 35 + 40}" font-family="Arial, sans-serif" font-size="24" fill="white" text-anchor="middle" font-weight="bold">${line}</text>`
        ).join('')}
        <text x="0" y="${displayLines.length * 18 + 150}" font-family="Arial, sans-serif" font-size="18" fill="rgba(255,255,255,0.9)" text-anchor="middle">[Demo Mode - Segmind API Unavailable]</text>
        <text x="0" y="${displayLines.length * 18 + 180}" font-family="Arial, sans-serif" font-size="16" fill="rgba(255,255,255,0.8)" text-anchor="middle">Get your free API key at segmind.com</text>
      </g>
    </svg>
  `;
  
  // Конвертуємо SVG в base64 data URL
  const base64Svg = Buffer.from(svg).toString('base64');
  return `data:image/svg+xml;base64,${base64Svg}`;
};

// Функція для спроби генерації з окремою моделлю Segmind
const tryGenerateWithModel = async (
  model: SegmindModel,
  imageParams: GenerateImageParams
): Promise<{ success: boolean; result?: string; error?: string }> => {
  try {
    console.log(`Trying Segmind model: ${model.name}`);
    
    // Підготовка параметрів залежно від моделі
    let requestBody: Record<string, any>;
    
    if (model.name === 'HiDream-I1 Fast') {
      requestBody = {
        ...model.defaultParams,
        prompt: imageParams.prompt
      };
    } else {
      // SDXL моделі
      requestBody = {
        ...model.defaultParams,
        prompt: imageParams.prompt,
        negative_prompt: imageParams.negative_prompt || 'blurry, bad quality, low resolution, ugly, deformed',
        num_inference_steps: imageParams.num_inference_steps || model.defaultParams.num_inference_steps,
        guidance_scale: imageParams.guidance_scale || model.defaultParams.guidance_scale
      };
      
      // Встановлюємо розміри зображення
      if (imageParams.width && imageParams.height) {
        requestBody.img_width = Math.min(imageParams.width, 1024);
        requestBody.img_height = Math.min(imageParams.height, 1024);
      }
    }

    const response = await fetch(model.endpoint, {
      method: 'POST',
      headers: {
        'x-api-key': config.segmindApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: `${response.status}: ${errorText}` };
    }

    // Отримуємо зображення як binary дані
    const imageArrayBuffer = await response.arrayBuffer();
    const imageBuffer = Buffer.from(imageArrayBuffer);
    
    // Визначаємо тип контенту
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const mimeType = contentType.includes('webp') ? 'image/webp' : 
                    contentType.includes('png') ? 'image/png' : 'image/jpeg';
    
    // Конвертуємо в base64 data URL
    const base64Image = imageBuffer.toString('base64');
    const imageUrl = `data:${mimeType};base64,${base64Image}`;

    return { success: true, result: imageUrl };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
};

export const generateImage = async (
  prompt: string, 
  params: Omit<GenerateImageParams, 'prompt'> = {}
): Promise<string> => {
  if (!config.segmindApiKey) {
    console.error('Segmind API key not configured');
    throw new Error('Segmind API key not configured. Get free API key at https://segmind.com');
  }

  const imageParams: GenerateImageParams = {
    prompt,
    width: params.width ?? 1024,
    height: params.height ?? 1024,
    num_inference_steps: params.num_inference_steps ?? 20, 
    guidance_scale: params.guidance_scale ?? 7.5,
    ...(params.negative_prompt && { negative_prompt: params.negative_prompt })
  };

  console.log('Starting image generation with Segmind API:', {
    promptPreview: prompt.substring(0, 100) + (prompt.length > 100 ? '...' : ''),
    width: imageParams.width,
    height: imageParams.height,
    num_inference_steps: imageParams.num_inference_steps,
    guidance_scale: imageParams.guidance_scale,
    ...(imageParams.negative_prompt && { 
      negative_prompt: imageParams.negative_prompt.substring(0, 50) + (imageParams.negative_prompt.length > 50 ? '...' : '') 
    })
  });

  const startTime = Date.now();
  
  // Створюємо масив індексів, починаючи з останньої робочої моделі
  const tryOrder = [currentModelIndex];
  for (let i = 0; i < AVAILABLE_MODELS.length; i++) {
    if (i !== currentModelIndex) {
      tryOrder.push(i);
    }
  }
  
  // Спробуємо кожну модель по черзі
  for (const modelIndex of tryOrder) {
    const model = AVAILABLE_MODELS[modelIndex];
    const result = await tryGenerateWithModel(model, imageParams);
    
    if (result.success && result.result) {
      currentModelIndex = modelIndex; // Запам'ятовуємо робочу модель
      const generationTime = Date.now() - startTime;
      console.log(`Image generation completed in ${generationTime}ms using Segmind model: ${model.name}`);
      return result.result;
    }
    
    console.log(`Segmind model ${model.name} failed: ${result.error}`);
  }

  // Якщо жодна модель не спрацювала, використовуємо fallback заглушку
  console.log('All Segmind models failed, using placeholder generator');
  return generatePlaceholderImage(imageParams.prompt);
};