
export enum Mood {
  BRIGHT = 'Terang',
  DARK = 'Gelap / Dramatis'
}

export enum AspectRatio {
  SQUARE = '1:1',
  FOUR_THREE = '4:3',
  SIXTEEN_NINE = '16:9',
  NINE_SIXTEEN = '9:16'
}

export interface ProductPhotoSettings {
  productImage: string | null;
  modelImage: string | null;
  logoImage: string | null;
  backgroundPrompt: string;
  mood: Mood;
  aspectRatio: AspectRatio;
}

export interface GeneratedResult {
  imageUrl: string;
  timestamp: number;
}
