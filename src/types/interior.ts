export type RoomType = 
  | 'Living Room'
  | 'Bedroom'
  | 'Kitchen'
  | 'Dining Room'
  | 'Home Office'
  | 'Bathroom'
  | 'Gaming Room'
  | 'Patio / Balcony'
  | 'Walk-in Closet'
  | 'Nursery';

export type DesignStyle = 
  | 'Modern Minimalist'
  | 'Scandinavian'
  | 'Japandi'
  | 'Industrial Loft'
  | 'Bohemian Chic'
  | 'Mid-Century Modern'
  | 'Coastal Beach'
  | 'Cyberpunk Neon'
  | 'Luxury Neoclassic'
  | 'Mediterranean'
  | 'Art Deco'
  | 'Rustic Farmhouse';

export type ColorPalette = 
  | 'Warm Neutrals'
  | 'Emerald & Gold'
  | 'Terracotta & Sage'
  | 'Charcoal & Marble'
  | 'Pastel Dream'
  | 'Monochromatic Dark'
  | 'Boho Earth';

export type LightingVibe = 
  | 'Golden Hour'
  | 'Daylight'
  | 'Warm Ambient'
  | 'Mood Dim'
  | 'Cyber Neon';

export type LayoutFidelity = 'strict' | 'balanced' | 'creative';

export type TargetFocus = 'entire-room' | 'furniture-only' | 'walls-and-floors' | 'custom-region';

export type ApiProvider = 'pollinations' | 'huggingface' | 'custom';

export interface ApiSettings {
  provider: ApiProvider;
  huggingFaceToken?: string;
  customEndpointUrl?: string;
  customApiKey?: string;
  pollinationsModel: 'flux' | 'flux-realism' | 'turbo';
}

export type GenerationStatus = 'idle' | 'analyzing' | 'rendering' | 'complete' | 'error';

export interface FurnitureRecommendation {
  name: string;
  category: string;
  description: string;
  estimatedPrice: string;
  material: string;
}

export interface RoomAnalysis {
  dominantColors: string[];
  materials: string[];
  keyFurniture: FurnitureRecommendation[];
  designNotes: string;
  spatialAdvice: string;
}

export interface RedesignResult {
  id: string;
  originalImage: string;
  redesignedImage: string;
  roomType: RoomType;
  style: DesignStyle;
  colorPalette: ColorPalette;
  lighting: LightingVibe;
  customPrompt?: string;
  layoutFidelity: LayoutFidelity;
  targetFocus: TargetFocus;
  timestamp: number;
  analysis: RoomAnalysis;
  seed: number;
  providerUsed: string;
}

export interface SampleRoom {
  id: string;
  name: string;
  category: RoomType;
  imageUrl: string;
  recommendedStyle: DesignStyle;
}
