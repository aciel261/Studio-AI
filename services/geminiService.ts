
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { ProductPhotoSettings } from "../types";

// Ensure process.env.API_KEY is available
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeProductImage = async (base64Image: string): Promise<string> => {
  const ai = getAI();
  const prompt = "Describe this product in detail for a professional photoshoot. Suggest a background and lighting that would make it look premium and appealing. Keep the description concise but descriptive for an AI image generator.";
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Image.split(',')[1], mimeType: 'image/png' } },
        { text: prompt }
      ]
    }
  });

  return response.text || "Produk berkualitas tinggi dengan pencahayaan profesional.";
};

export const generateProductPhoto = async (settings: ProductPhotoSettings): Promise<string | null> => {
  if (!settings.productImage) return null;

  const ai = getAI();
  const parts: any[] = [
    { inlineData: { data: settings.productImage.split(',')[1], mimeType: 'image/png' } }
  ];

  if (settings.modelImage) {
    parts.push({ inlineData: { data: settings.modelImage.split(',')[1], mimeType: 'image/png' } });
  }

  if (settings.logoImage) {
    parts.push({ inlineData: { data: settings.logoImage.split(',')[1], mimeType: 'image/png' } });
  }

  const moodInstruction = settings.mood === 'Terang' 
    ? "with bright, natural, high-key studio lighting, soft shadows" 
    : "with moody, dramatic, cinematic low-key lighting, deep shadows, professional contrast";

  const prompt = `Professional product photography of the item in the first image. 
    Set it in: ${settings.backgroundPrompt}. 
    Lighting: ${moodInstruction}. 
    Ensure the product remains the central focus, looking high-end and realistic. 
    Make it look like a high-quality advertising campaign shoot.`;

  parts.push({ text: prompt });

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts },
    config: {
      imageConfig: {
        aspectRatio: settings.aspectRatio as any,
      }
    }
  });

  // Iterate through parts to find the image
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }

  return null;
};
