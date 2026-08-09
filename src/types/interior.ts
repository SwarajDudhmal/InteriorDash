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

export type StudioMode = 'atelier' | 'copilot';

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
  estimatedPriceINR: number;
  material: string;
}

export interface QuotationItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unitPriceINR: number;
  totalPriceINR: number;
  description: string;
  material: string;
}

export interface RoomQuotation {
  items: QuotationItem[];
  subtotalINR: number;
  laborInstallationINR: number;
  gstPercentage: number;
  gstINR: number;
  grandTotalINR: number;
  currency: 'INR';
  formattedGrandTotal: string;
}

export interface BlueprintPin {
  id: string;
  x: number; // percentage from left (0-100)
  y: number; // percentage from top (0-100)
  title: string;
  category: 'Lighting' | 'Structure' | 'Material' | 'Furniture';
  details: string;
}

export interface ColorSwatchInfo {
  name: string;
  hex: string;
  role: string;
}

export interface MaterialInfo {
  name: string;
  finish: string;
  origin: string;
  sustainabilityScore: string;
}

export interface RoomAnalysis {
  dominantColors: ColorSwatchInfo[];
  materials: MaterialInfo[];
  keyFurniture: FurnitureRecommendation[];
  designNotes: string;
  spatialAdvice: string;
  daylightKelvin: string;
  acousticScore: string;
  estimatedVolume: string;
  blueprintPins: BlueprintPin[];
  quotation: RoomQuotation;
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
  architectNote?: string;
}

export interface DesignerMoodboard {
  id: string;
  title: string;
  designer: string;
  location: string;
  style: DesignStyle;
  roomType: RoomType;
  colorPalette: ColorPalette;
  lighting: LightingVibe;
  coverImage: string;
  quote: string;
  architecturalElements: string[];
}

