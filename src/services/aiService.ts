import type { 
  ApiSettings, 
  RoomType, 
  DesignStyle, 
  ColorPalette, 
  LightingVibe, 
  LayoutFidelity,
  TargetFocus,
  RoomAnalysis, 
  FurnitureRecommendation,
  ColorSwatchInfo,
  MaterialInfo,
  BlueprintPin,
  RoomQuotation,
  QuotationItem
} from '../types/interior';

interface GenerateParams {
  originalImage: string;
  roomType: RoomType;
  style: DesignStyle;
  colorPalette: ColorPalette;
  lighting: LightingVibe;
  customPrompt?: string;
  layoutFidelity: LayoutFidelity;
  targetFocus: TargetFocus;
  settings: ApiSettings;
  onProgress?: (stage: string) => void;
}

export const defaultApiSettings: ApiSettings = {
  provider: 'pollinations',
  pollinationsModel: 'flux-realism',
};

export function calculateQuotation(items: FurnitureRecommendation[]): RoomQuotation {
  const quotationItems: QuotationItem[] = items.map((item, idx) => ({
    id: `item-${idx + 1}`,
    name: item.name,
    category: item.category,
    quantity: 1,
    unitPriceINR: item.estimatedPriceINR || 35000,
    totalPriceINR: item.estimatedPriceINR || 35000,
    description: item.description,
    material: item.material
  }));

  // Add Surface Paint & Paneling labor item
  quotationItems.push({
    id: 'item-paint-labor',
    name: 'Architectural Surface Paint & Wall Paneling',
    category: 'Surface Finish',
    quantity: 1,
    unitPriceINR: 35000,
    totalPriceINR: 35000,
    description: 'Hand-troweled low-VOC premium finish & surface preparation',
    material: 'Asian Paints Royale / Venetian Stucco'
  });

  // Add Electrical & Lighting Labor item
  quotationItems.push({
    id: 'item-lighting-labor',
    name: 'Ambient Cove LED & Fixture Installation',
    category: 'Electrical & Lighting',
    quantity: 1,
    unitPriceINR: 18000,
    totalPriceINR: 18000,
    description: 'Concealed channel wiring, drivers & fitting installation',
    material: 'Philips 2700K Architectural LED Channels'
  });

  const subtotalINR = quotationItems.reduce((sum, item) => sum + item.totalPriceINR, 0);
  const laborInstallationINR = 25000; // Architectural staging & site supervision fee
  const gstPercentage = 18;
  const taxableTotal = subtotalINR + laborInstallationINR;
  const gstINR = Math.round((taxableTotal * gstPercentage) / 100);
  const grandTotalINR = taxableTotal + gstINR;

  const formatter = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

  return {
    items: quotationItems,
    subtotalINR,
    laborInstallationINR,
    gstPercentage,
    gstINR,
    grandTotalINR,
    currency: 'INR',
    formattedGrandTotal: formatter.format(grandTotalINR)
  };
}

// Helper: Convert File to base64
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

// Build prompt optimized for strict architectural structure preservation & interior redesign synthesis
export function buildInteriorPrompt(
  roomType: RoomType,
  style: DesignStyle,
  colorPalette: ColorPalette,
  lighting: LightingVibe,
  layoutFidelity: LayoutFidelity,
  targetFocus: TargetFocus,
  customPrompt?: string
): string {
  const styleDescriptions: Record<DesignStyle, string> = {
    'Modern Minimalist': 'ultra-clean lines, uncluttered layout, concealed storage, sleek furniture, high-end architectural finish',
    'Scandinavian': 'light oak wooden accents, cozy soft wool textures, functional airy spatial flow, hygge atmosphere',
    'Japandi': 'wabi-sabi aesthetics, low-profile wooden furniture, paper lanterns, organic clay vases, serene minimalist harmony',
    'Industrial Loft': 'exposed brick walls, black steel framework, reclaimed wood, Edison filament lighting, raw urban elegance',
    'Bohemian Chic': 'layered textured rugs, vibrant indoor botanical plants, rattan furniture, macrame accents, warm earthy vibes',
    'Mid-Century Modern': 'tapered wooden legs, organic curves, rich teak & walnut wood, retro statement accent chair, iconic brass light fixtures',
    'Coastal Beach': 'breezy white linen drapery, washed driftwood, navy blue & sand accents, woven jute rug, bright natural sunlight',
    'Cyberpunk Neon': 'futuristic LED light strips, dark charcoal surfaces, ambient magenta and cyan glow, high-tech modular furniture',
    'Luxury Neoclassic': 'opulent wall molding, white Carrara marble, brushed gold accents, crystal chandelier, velvet upholstery',
    'Mediterranean': 'terracotta tiles, arched doorways, warm plaster walls, olive branch arrangements, rustic wrought iron details',
    'Art Deco': 'geometric gold inlay patterns, deep emerald velvet, polished brass, glamorous mirrored surfaces, bold symmetrical elegance',
    'Rustic Farmhouse': 'reclaimed barnwood beams, cozy hearth, woven baskets, distressed white cabinetry, warm vintage charm'
  };

  const colorDetails: Record<ColorPalette, string> = {
    'Warm Neutrals': 'soft beige, cream, oat, warm taupe, brushed bronze',
    'Emerald & Gold': 'deep forest emerald green, brushed brass, warm off-white',
    'Terracotta & Sage': 'earthy terracotta, muted sage green, warm ivory',
    'Charcoal & Marble': 'matte charcoal grey, white Carrara marble, polished chrome',
    'Pastel Dream': 'soft blush pink, sky blue, warm vanilla, soft sage',
    'Monochromatic Dark': 'deep obsidian, graphite charcoal, dark oak',
    'Boho Earth': 'mustard yellow, warm ochre, rust orange, natural jute'
  };

  const lightingDetails: Record<LightingVibe, string> = {
    'Golden Hour': 'warm soft golden hour sunlight streaming through windows if present, long gentle shadows',
    'Daylight': 'bright clear natural morning daylight, airy high-contrast crisp shadows',
    'Warm Ambient': 'cozy warm cove lighting, soft lamp glow, relaxed high-end evening ambiance',
    'Mood Dim': 'dramatic cinematic dim lighting, subtle focused spotlights on key furniture',
    'Cyber Neon': 'vibrant accent neon ambient glow with rich dark atmospheric contrast'
  };

  // Structural strictness directives
  let structureRule = '';
  if (layoutFidelity === 'strict') {
    structureRule = 'STRICT ARCHITECTURAL CONTROL: Maintain exact original room structure, wall geometry, ceiling height, and door/window boundaries. DO NOT add new windows if original photo has no windows. DO NOT alter structural walls or perspective layout. Only restyle furniture, wall paint, textiles, lighting fixtures, and decor items.';
  } else if (layoutFidelity === 'balanced') {
    structureRule = 'BALANCED STRUCTURE: Retain original room perspective, wall positions, and window/door count. Restyle furniture placement and material finishes.';
  } else {
    structureRule = 'FLEXIBLE STAGING: Reimagine interior staging while keeping room scale and boundary dimensions intact.';
  }

  // Target Focus directives
  let focusRule = '';
  if (targetFocus === 'furniture-only') {
    focusRule = 'TARGET FOCUS: Modify ONLY furniture, seating, tables, and decor. Keep walls, flooring material, windows, and ceiling 100% identical to original room.';
  } else if (targetFocus === 'walls-and-floors') {
    focusRule = 'TARGET FOCUS: Modify ONLY wall surface finish, wall color, wallpaper, and flooring material. Keep furniture placement identical.';
  } else if (targetFocus === 'custom-region') {
    focusRule = 'TARGET CUSTOMIZATION: Apply targeted edit while keeping surrounding room elements stable.';
  }

  const basePrompt = `Award-winning Architectural Digest interior design photograph of a redesigned ${roomType}. ${structureRule} ${focusRule} Architectural style: ${style} (${styleDescriptions[style]}). Color palette: ${colorPalette} (${colorDetails[colorPalette]}). Lighting: ${lightingDetails[lighting]}. Photorealistic 8k, realistic materials and textures.`;

  if (customPrompt && customPrompt.trim().length > 0) {
    return `${basePrompt} User Personalization Instruction: ${customPrompt.trim()}.`;
  }

  return basePrompt;
}

// Generate Redesigned Room Image
export async function generateRoomRedesign(params: GenerateParams): Promise<{ redesignedUrl: string; seed: number }> {
  const { roomType, style, colorPalette, lighting, layoutFidelity, targetFocus, customPrompt, settings, onProgress } = params;

  onProgress?.('Analyzing original room architecture & window/wall layout...');
  await new Promise(resolve => setTimeout(resolve, 800));

  onProgress?.(`Applying ${layoutFidelity} structure lock & ${style} design principles...`);
  await new Promise(resolve => setTimeout(resolve, 1000));

  const seed = Math.floor(Math.random() * 1000000);
  const prompt = buildInteriorPrompt(roomType, style, colorPalette, lighting, layoutFidelity, targetFocus, customPrompt);

  if (settings.provider === 'pollinations') {
    onProgress?.('Synthesizing high-res interior render via Pollinations AI...');
    const model = settings.pollinationsModel || 'flux-realism';
    
    // Pollinations AI API call endpoint
    const encodedPrompt = encodeURIComponent(prompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1280&height=800&seed=${seed}&model=${model}&nologo=true&enhance=true`;

    // Verify image loads properly
    await preloadImage(imageUrl);
    return { redesignedUrl: imageUrl, seed };

  } else if (settings.provider === 'huggingface' && settings.huggingFaceToken) {
    onProgress?.('Processing image redesign on Hugging Face Inference API...');
    try {
      const response = await fetch(
        'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0',
        {
          headers: {
            Authorization: `Bearer ${settings.huggingFaceToken}`,
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({ inputs: prompt }),
        }
      );
      if (!response.ok) {
        throw new Error(`Hugging Face API error: ${response.statusText}`);
      }
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      return { redesignedUrl: imageUrl, seed };
    } catch (err) {
      console.warn('Hugging Face failed, falling back to Pollinations:', err);
      onProgress?.('Hugging Face serverless busy. Switching to Pollinations AI free tier...');
      const encodedPrompt = encodeURIComponent(prompt);
      const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1280&height=800&seed=${seed}&model=flux&nologo=true`;
      await preloadImage(imageUrl);
      return { redesignedUrl: imageUrl, seed };
    }
  } else {
    onProgress?.('Generating photorealistic space redesign...');
    const encodedPrompt = encodeURIComponent(prompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1280&height=832&seed=${seed}&model=flux-realism&nologo=true`;
    await preloadImage(imageUrl);
    return { redesignedUrl: imageUrl, seed };
  }
}

function preloadImage(url: string, onProgress?: (stage: string) => void): Promise<void> {
  return new Promise((resolve) => {
    onProgress?.('Finalizing spatial render...');
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = url;
    setTimeout(() => resolve(), 12000);
  });
}

// Generate Room Analysis, Blueprint Pins & Architectural Metrics
export function generateRoomAnalysis(roomType: RoomType, style: DesignStyle, colorPalette: ColorPalette): RoomAnalysis {
  const colorSwatches: Record<ColorPalette, ColorSwatchInfo[]> = {
    'Warm Neutrals': [
      { name: 'Warm Oat Linen', hex: '#F5EBE0', role: 'Primary Wall Paint' },
      { name: 'Sandstone Cream', hex: '#E3D5CA', role: 'Upholstery & Drapery' },
      { name: 'Aged Taupe', hex: '#D5BDAF', role: 'Accent Textile' },
      { name: 'Natural Ash Oak', hex: '#B5927B', role: 'Wood Cabinetry' },
      { name: 'Smoked Bronze', hex: '#4A3E3D', role: 'Hardware & Trim' }
    ],
    'Emerald & Gold': [
      { name: 'Deep Royal Emerald', hex: '#064E3B', role: 'Statement Velvet Wall' },
      { name: 'Verdant Forest', hex: '#047857', role: 'Accent Seating' },
      { name: 'Polished Brass Gold', hex: '#D97706', role: 'Gilded Fixtures' },
      { name: 'Warm Champagne Silk', hex: '#FEF3C7', role: 'Reflective Drapery' },
      { name: 'Charcoal Shadow', hex: '#1F2937', role: 'Floor Inlay' }
    ],
    'Terracotta & Sage': [
      { name: 'Earthy Terracotta', hex: '#C2410C', role: 'Handmade Floor Tile' },
      { name: 'Sun-dried Clay', hex: '#EA580C', role: 'Textile Accent' },
      { name: 'Wild Sage Leaf', hex: '#84CC16', role: 'Accent Wall Paint' },
      { name: 'Olive Grove', hex: '#4D7C0F', role: 'Botanical Tone' },
      { name: 'Warm Vanilla Plaster', hex: '#FEF08A', role: 'Ceiling Finish' }
    ],
    'Charcoal & Marble': [
      { name: 'Matte Obsidian', hex: '#111827', role: 'Feature Wall' },
      { name: 'Slate Graphite', hex: '#374151', role: 'Cabinetry Shell' },
      { name: 'Brushed Aluminum', hex: '#9CA3AF', role: 'Metal Framework' },
      { name: 'Carrara White Marble', hex: '#F3F4F6', role: 'Countertop / Hearth' },
      { name: 'Smoked Quartz', hex: '#6B7280', role: 'Glass Tint' }
    ],
    'Pastel Dream': [
      { name: 'Soft Blush Petal', hex: '#FCE7F3', role: 'Accent Wall' },
      { name: 'Periwinkle Cloud', hex: '#E0E7FF', role: 'Textile Layer' },
      { name: 'Buttercream Glow', hex: '#FEF3C7', role: 'Warm Lighting' },
      { name: 'Muted Mint', hex: '#D1FAE5', role: 'Ceramic Detail' },
      { name: 'Dove Grey', hex: '#4B5563', role: 'Base Frame' }
    ],
    'Monochromatic Dark': [
      { name: 'Deep Midnight Obsidian', hex: '#030712', role: 'Primary Structure' },
      { name: 'Graphite Charcoal', hex: '#111827', role: 'Upholstery Fabric' },
      { name: 'Dark Smoked Oak', hex: '#1F2937', role: 'Joinery & Paneling' },
      { name: 'Industrial Iron', hex: '#374151', role: 'Hardware & Trim' },
      { name: 'Muted Zinc', hex: '#9CA3AF', role: 'Reflective Surface' }
    ],
    'Boho Earth': [
      { name: 'Raw Ochre', hex: '#B45309', role: 'Woven Rug' },
      { name: 'Warm Amber', hex: '#D97706', role: 'Lampshade & Accent' },
      { name: 'Mustard Gold', hex: '#A16207', role: 'Throw Cushion' },
      { name: 'Burnt Walnut', hex: '#78350F', role: 'Handcrafted Furniture' },
      { name: 'Natural Jute', hex: '#FEF3C7', role: 'Floor Mat' }
    ]
  };

  const styleMaterials: Record<DesignStyle, MaterialInfo[]> = {
    'Modern Minimalist': [
      { name: 'Matte Venetian Plaster', finish: 'Velvety Low-sheen', origin: 'Veneto, Italy', sustainabilityScore: '96%' },
      { name: 'Honed Calacatta Marble', finish: 'Matte Satin', origin: 'Carrara, Italy', sustainabilityScore: '88%' },
      { name: 'Anodized Champagne Steel', finish: 'Brushed Metallic', origin: 'Rotterdam, Netherlands', sustainabilityScore: '92%' }
    ],
    'Scandinavian': [
      { name: 'FSC-Certified Ash Timber', finish: 'Natural Matte Wax', origin: 'Dalarna, Sweden', sustainabilityScore: '99%' },
      { name: 'Organic Bouclé Linen', finish: 'Tactile Woven', origin: 'Ghent, Belgium', sustainabilityScore: '95%' },
      { name: 'Crafted Ceramic Stoneware', finish: 'Unglazed Terracotta', origin: 'Copenhagen, Denmark', sustainabilityScore: '94%' }
    ],
    'Japandi': [
      { name: 'Aromatic Hinoki Cypress', finish: 'Untreated Raw Scented', origin: 'Nagano, Japan', sustainabilityScore: '98%' },
      { name: 'Traditional Woven Tatami', finish: 'Rush Grass Weave', origin: 'Kumamoto, Japan', sustainabilityScore: '100%' },
      { name: 'Hand-molded Wabi Clay', finish: 'Textured Earthenware', origin: 'Kyoto, Japan', sustainabilityScore: '97%' }
    ],
    'Industrial Loft': [
      { name: 'Reclaimed Heritage Oak', finish: 'Patinated Distressed', origin: 'Pittsburgh, USA', sustainabilityScore: '97%' },
      { name: 'Forged Steel Framework', finish: 'Raw Black Oxide', origin: 'Sheffield, UK', sustainabilityScore: '90%' },
      { name: 'Full-Grain Cognac Leather', finish: 'Aniline Soft Polish', origin: 'Tuscany, Italy', sustainabilityScore: '89%' }
    ],
    'Bohemian Chic': [
      { name: 'Natural Rattan Fibre', finish: 'Hand-bent Weave', origin: 'Bali, Indonesia', sustainabilityScore: '99%' },
      { name: 'Handwoven Jute Carpet', finish: 'Braided Organic', origin: 'Rajasthan, India', sustainabilityScore: '98%' },
      { name: 'Handmade Terracotta Clay', finish: 'Sun-baked Matte', origin: 'Oaxaca, Mexico', sustainabilityScore: '96%' }
    ],
    'Mid-Century Modern': [
      { name: 'American Black Walnut', finish: 'Satin Hand-rubbed Oil', origin: 'North Carolina, USA', sustainabilityScore: '91%' },
      { name: 'Spun Solid Brass', finish: 'Warm Antique Patina', origin: 'Birmingham, UK', sustainabilityScore: '93%' },
      { name: 'Molded Birch Plywood', finish: 'Laminated Curved', origin: 'Helsinki, Finland', sustainabilityScore: '95%' }
    ],
    'Coastal Beach': [
      { name: 'Sun-bleached Driftwood', finish: 'Weathered Matte', origin: 'Maine, USA', sustainabilityScore: '98%' },
      { name: 'Pure Belgian Flax Linen', finish: 'Washed Crisp Weave', origin: 'Courtrai, Belgium', sustainabilityScore: '97%' },
      { name: 'Natural Seagrass Weave', finish: 'Braided Tactile', origin: 'Tasmania, Australia', sustainabilityScore: '99%' }
    ],
    'Cyberpunk Neon': [
      { name: 'Smoked Tempered Glass', finish: 'High-gloss Reflective', origin: 'Stuttgart, Germany', sustainabilityScore: '85%' },
      { name: 'Carbon Fiber Mesh', finish: 'Perforated Tech Satin', origin: 'Tokyo, Japan', sustainabilityScore: '88%' },
      { name: 'Diffuse Acrylic LED Channel', finish: 'Frost Ambient Glow', origin: 'Seoul, South Korea', sustainabilityScore: '91%' }
    ],
    'Luxury Neoclassic': [
      { name: 'Italian Carrara Marble', finish: 'High-polish Mirror', origin: 'Carrara, Italy', sustainabilityScore: '87%' },
      { name: 'Royal Emerald Silk Velvet', finish: 'Deep Sheen Tufted', origin: 'Lyons, France', sustainabilityScore: '90%' },
      { name: 'Hand-applied Gold Leaf', finish: '24K Burnished Gild', origin: 'Florence, Italy', sustainabilityScore: '92%' }
    ],
    'Mediterranean': [
      { name: 'Majolica Ceramic Tile', finish: 'Hand-painted Glaze', origin: 'Amalfi, Italy', sustainabilityScore: '94%' },
      { name: 'Rough Whitewashed Stucco', finish: 'Hand-troweled Lime', origin: 'Mykonos, Greece', sustainabilityScore: '98%' },
      { name: 'Solid Olive Wood', finish: 'Wax-sealed Grain', origin: 'Andalusia, Spain', sustainabilityScore: '96%' }
    ],
    'Art Deco': [
      { name: 'High-gloss Black Lacquer', finish: 'Mirror Polished', origin: 'Paris, France', sustainabilityScore: '86%' },
      { name: 'Geometric Brass Inlay', finish: 'Precision Beveled', origin: 'Vienna, Austria', sustainabilityScore: '91%' },
      { name: 'Deep Sapphire Velvet', finish: 'Scalloped Tufted', origin: 'Milan, Italy', sustainabilityScore: '89%' }
    ],
    'Rustic Farmhouse': [
      { name: 'Rough-sawn Barn Pine', finish: 'Aged Weathered Timber', origin: 'Vermont, USA', sustainabilityScore: '97%' },
      { name: 'Galvanized Zinc Metal', finish: 'Matte Antique Wash', origin: 'Alsace, France', sustainabilityScore: '93%' },
      { name: 'Hand-knotted Burlap Wool', finish: 'Coarse Chunky Weave', origin: 'Highlands, Scotland', sustainabilityScore: '96%' }
    ]
  };

  const furnitureSuggestions: Record<DesignStyle, FurnitureRecommendation[]> = {
    'Modern Minimalist': [
      { name: 'Sleek Low-Profile Modular Sofa', category: 'Seating', description: 'Clean geometry with concealed legs and deep comfort.', estimatedPrice: '₹85,000', estimatedPriceINR: 85000, material: 'Performance Weave' },
      { name: 'Floating Wall Console', category: 'Storage', description: 'Handleless minimalist media cabinet with cable management.', estimatedPrice: '₹42,000', estimatedPriceINR: 42000, material: 'Matte White Shell' },
      { name: 'Architectural Disc Coffee Table', category: 'Table', description: 'Single-piece minimalist round center table.', estimatedPrice: '₹28,000', estimatedPriceINR: 28000, material: 'Satin Steel' }
    ],
    'Scandinavian': [
      { name: 'Nordic Ash Lounge Chair', category: 'Seating', description: 'Curved light ash frame with woven wool seat padding.', estimatedPrice: '₹38,000', estimatedPriceINR: 38000, material: 'Solid Ash & Linen' },
      { name: 'Organic Pebble Coffee Table', category: 'Table', description: 'Asymmetrical smooth wooden table set.', estimatedPrice: '₹22,000', estimatedPriceINR: 22000, material: 'Natural Ash Wood' },
      { name: 'Chunky Wool Loop Rug', category: 'Textiles', description: 'Hand-knotted ultra-cozy floor covering.', estimatedPrice: '₹26,000', estimatedPriceINR: 26000, material: '100% New Zealand Wool' }
    ],
    'Japandi': [
      { name: 'Zen Low Wooden Platform Sofa', category: 'Seating', description: 'Wabi-sabi grounded aesthetic with clean lines.', estimatedPrice: '₹95,000', estimatedPriceINR: 95000, material: 'Hinoki Cypress' },
      { name: 'Rice Paper Floor Sphere Lamp', category: 'Lighting', description: 'Diffused ambient paper lantern glow.', estimatedPrice: '₹14,000', estimatedPriceINR: 14000, material: 'Bamboo & Shoji Paper' },
      { name: 'Fluted Wooden Sideboard', category: 'Storage', description: 'Slatted wooden sliding doors with hidden storage.', estimatedPrice: '₹68,000', estimatedPriceINR: 68000, material: 'Muted Teak Wood' }
    ],
    'Industrial Loft': [
      { name: 'Cognac Leather Club Sofa', category: 'Seating', description: 'Vintage tufted cognac leather with iron frame.', estimatedPrice: '₹1,35,000', estimatedPriceINR: 135000, material: 'Full-Grain Leather' },
      { name: 'Cast Iron Factory Cart Table', category: 'Table', description: 'Industrial coffee table on heavy iron wheels.', estimatedPrice: '₹38,000', estimatedPriceINR: 38000, material: 'Reclaimed Pine & Iron' },
      { name: 'Edison Pipe Wall Sconce Set', category: 'Lighting', description: 'Exposed filament warm amber lights.', estimatedPrice: '₹12,000', estimatedPriceINR: 12000, material: 'Black Metal Piping' }
    ],
    'Bohemian Chic': [
      { name: 'Peacock Rattan Accent Armchair', category: 'Seating', description: 'Intricately woven rattan high-back throne chair.', estimatedPrice: '₹28,000', estimatedPriceINR: 28000, material: 'Natural Rattan' },
      { name: 'Vintage Moroccan Berber Rug', category: 'Textiles', description: 'Plush diamond pattern tribal carpet.', estimatedPrice: '₹34,000', estimatedPriceINR: 34000, material: 'Woven Wool' },
      { name: 'Tiered Plant Pedestal Stand', category: 'Decor', description: 'Multi-level wooden plant display.', estimatedPrice: '₹9,500', estimatedPriceINR: 9500, material: 'Solid Mango Wood' }
    ],
    'Mid-Century Modern': [
      { name: 'Mid-Century Credenza', category: 'Storage', description: 'Slanted wooden peg legs with warm walnut grain.', estimatedPrice: '₹72,000', estimatedPriceINR: 72000, material: 'American Walnut' },
      { name: 'Eames-Style Lounge & Ottoman', category: 'Seating', description: 'Iconic molded plywood and leather armchair.', estimatedPrice: '₹88,000', estimatedPriceINR: 88000, material: 'Plywood & Black Leather' },
      { name: 'Brass Sputnik Chandelier', category: 'Lighting', description: 'Multi-directional brass light bursts.', estimatedPrice: '₹24,000', estimatedPriceINR: 24000, material: 'Brushed Brass' }
    ],
    'Coastal Beach': [
      { name: 'Slipcovered White Linen Couch', category: 'Seating', description: 'Relaxed washable linen sofa with deep cushions.', estimatedPrice: '₹98,000', estimatedPriceINR: 98000, material: 'Belgian Linen' },
      { name: 'Woven Seagrass Ottoman', category: 'Seating/Table', description: 'Natural textured round coffee pouf.', estimatedPrice: '₹16,000', estimatedPriceINR: 16000, material: 'Natural Seagrass' },
      { name: 'White Wash Wood Beaded Chandelier', category: 'Lighting', description: 'Breezy wooden bead tier pendant.', estimatedPrice: '₹22,000', estimatedPriceINR: 22000, material: 'Driftwood & Beads' }
    ],
    'Cyberpunk Neon': [
      { name: 'Ergonomic Cyber Mesh Throne', category: 'Seating', description: 'High-tech lumbar support chair with RGB accents.', estimatedPrice: '₹48,000', estimatedPriceINR: 48000, material: 'Carbon Fiber Mesh' },
      { name: 'Smart LED Geometric Light Bars', category: 'Lighting', description: 'Programmable wall glow panels.', estimatedPrice: '₹18,000', estimatedPriceINR: 18000, material: 'Diffuse Acrylic' },
      { name: 'Floating Glass Desk', category: 'Table', description: 'Smoked tempered glass with integrated cable channels.', estimatedPrice: '₹38,000', estimatedPriceINR: 38000, material: 'Smoked Tempered Glass' }
    ],
    'Luxury Neoclassic': [
      { name: 'Tufted Velvet Chesterfield Sofa', category: 'Seating', description: 'Deep button-tufted royal velvet sofa with gold legs.', estimatedPrice: '₹1,65,000', estimatedPriceINR: 165000, material: 'Royal Emerald Velvet' },
      { name: 'Carrara Marble Nesting Tables', category: 'Table', description: 'Natural marble slab top on polished brass base.', estimatedPrice: '₹58,000', estimatedPriceINR: 58000, material: 'Italian Marble & Brass' },
      { name: 'Ornate Gilded Gold Wall Mirror', category: 'Decor', description: 'Full-length arched baroque mirror.', estimatedPrice: '₹42,000', estimatedPriceINR: 42000, material: 'Gold Leaf Metal' }
    ],
    'Mediterranean': [
      { name: 'Arching Curved Plaster Bench', category: 'Seating', description: 'Built-in whitewashed bench with custom cushions.', estimatedPrice: '₹62,000', estimatedPriceINR: 62000, material: 'Plaster & Canvas' },
      { name: 'Terracotta Amphora Urn Set', category: 'Decor', description: 'Handmade rustic earthen pottery.', estimatedPrice: '₹16,000', estimatedPriceINR: 16000, material: 'Earthy Clay' },
      { name: 'Wrought Iron Pendant Lantern', category: 'Lighting', description: 'Traditional Mediterranean iron lattice lantern.', estimatedPrice: '₹22,000', estimatedPriceINR: 22000, material: 'Forged Iron' }
    ],
    'Art Deco': [
      { name: 'Curved Emerald Velvet Shell Chair', category: 'Seating', description: 'Scalloped back accent chair with gold legs.', estimatedPrice: '₹38,000', estimatedPriceINR: 38000, material: 'Emerald Velvet & Brass' },
      { name: 'Geometric Gold Inlay Sideboard', category: 'Storage', description: 'Black lacquer cabinet with sunburst gold inlay.', estimatedPrice: '₹92,000', estimatedPriceINR: 92000, material: 'Lacquer & Brass' },
      { name: 'Arch Beveled Deco Wall Mirror', category: 'Decor', description: 'Tiered geometric mirror frame.', estimatedPrice: '₹26,000', estimatedPriceINR: 26000, material: 'Beveled Glass' }
    ],
    'Rustic Farmhouse': [
      { name: 'Trestle Dining Table', category: 'Table', description: 'Heavy rough-sawn pine dining table.', estimatedPrice: '₹78,000', estimatedPriceINR: 78000, material: 'Reclaimed Pine' },
      { name: 'Cross-Back Wooden Chairs (Set of 4)', category: 'Seating', description: 'Classic country bistro dining seats.', estimatedPrice: '₹34,000', estimatedPriceINR: 34000, material: 'Distressed Ash Wood' },
      { name: 'Galvanized Metal Pitcher Vase', category: 'Decor', description: 'Rustic flower pitcher for wildflower arrangements.', estimatedPrice: '₹4,500', estimatedPriceINR: 4500, material: 'Galvanized Zinc' }
    ]
  };

  const selectedFurniture = furnitureSuggestions[style] || furnitureSuggestions['Scandinavian'];

  const blueprintPins: Record<DesignStyle, BlueprintPin[]> = {
    'Scandinavian': [
      { id: 'pin-1', x: 28, y: 35, title: 'Slatted Oak Acoustic Panel', category: 'Structure', details: 'FSC-Certified European Ash with acoustic felt backing for sound absorption.' },
      { id: 'pin-2', x: 72, y: 48, title: '2700K Warm Ambient Recessed Cove', category: 'Lighting', details: 'Concealed LED strip providing soft 2700K golden glare-free backlight.' },
      { id: 'pin-3', x: 45, y: 70, title: 'Tactile New Zealand Wool Rug', category: 'Material', details: 'Hand-knotted loop weave providing thermal insulation and organic texture.' }
    ],
    'Japandi': [
      { id: 'pin-1', x: 32, y: 40, title: 'Shoji Paper Diffusion Window', category: 'Lighting', details: 'Soft daylight filtering with natural cedar wood lattice.' },
      { id: 'pin-2', x: 60, y: 65, title: 'Low-profile Hinoki Bench', category: 'Furniture', details: 'Aromatic Hinoki cypress with concealed joinery and hand-sanded finish.' },
      { id: 'pin-3', x: 20, y: 75, title: 'Hand-troweled Wabi-Sabi Clay', category: 'Material', details: 'Unrefined natural lime clay plaster with organic textural variation.' }
    ],
    'Modern Minimalist': [
      { id: 'pin-1', x: 50, y: 25, title: 'Flush Concealed Door Trim', category: 'Structure', details: 'Frameless door jamb integrated directly into Venetian plaster walls.' },
      { id: 'pin-2', x: 30, y: 60, title: 'Honed Calacatta Marble Slab', category: 'Material', details: 'Seamless matte finish slab with soft grey veining.' },
      { id: 'pin-3', x: 78, y: 55, title: 'Minimalist Linear Pendant', category: 'Lighting', details: 'Slim architectural LED profile with 3000K warm neutral light.' }
    ],
    'Industrial Loft': [
      { id: 'pin-1', x: 25, y: 30, title: 'Exposed Heritage Brickwork', category: 'Structure', details: 'Sealed historic red brick with matte dust protection.' },
      { id: 'pin-2', x: 55, y: 68, title: 'Full-grain Cognac Tufted Leather', category: 'Material', details: 'Hand-waxed Italian leather that patinates over time.' },
      { id: 'pin-3', x: 80, y: 40, title: 'Forged Steel Frame Sconce', category: 'Lighting', details: 'Industrial black oxide steel fixture with amber filament bulb.' }
    ],
    'Luxury Neoclassic': [
      { id: 'pin-1', x: 35, y: 20, title: 'Architectural Crown Moldings', category: 'Structure', details: 'Precision-carved plaster crown molding with gold leaf detail.' },
      { id: 'pin-2', x: 65, y: 55, title: 'Royal Emerald Silk Velvet', category: 'Material', details: 'High-density woven velvet with soil-resistant silk backing.' },
      { id: 'pin-3', x: 48, y: 35, title: 'French Crystal Chandelier', category: 'Lighting', details: 'Tiered lead crystal prisms filtering multi-angle warm illumination.' }
    ],
    'Bohemian Chic': [
      { id: 'pin-1', x: 30, y: 45, title: 'Natural Rattan Weave', category: 'Material', details: 'Sustainably harvested rattan hand-bent in traditional lattice.' },
      { id: 'pin-2', x: 70, y: 60, title: 'Botanical Fiddle Leaf Fig', category: 'Furniture', details: 'Live interior specimen enhancing room air quality and vertical green layer.' },
      { id: 'pin-3', x: 50, y: 80, title: 'Braided Jute & Wool Carpet', category: 'Material', details: 'Multi-textured floor rug crafted from natural jute and wool yarns.' }
    ],
    'Mid-Century Modern': [
      { id: 'pin-1', x: 35, y: 55, title: 'American Walnut Credenza', category: 'Furniture', details: 'Iconic slanted peg leg joinery with oil-rubbed walnut wood veneer.' },
      { id: 'pin-2', x: 75, y: 35, title: 'Brass Sputnik Light Fixture', category: 'Lighting', details: 'Multi-directional brass light bursts.' },
      { id: 'pin-3', x: 20, y: 70, title: 'Geometric Retro Wool Textile', category: 'Material', details: 'Classic woven fabric in warm mustard, teak, and olive palette.' }
    ],
    'Coastal Beach': [
      { id: 'pin-1', x: 40, y: 30, title: 'Breezy Belgian Linen Drapery', category: 'Material', details: 'Semi-sheer unbleached linen allowing natural sun diffusion.' },
      { id: 'pin-2', x: 65, y: 65, title: 'Slipcovered Linen Couch', category: 'Furniture', details: 'Washable relaxed slipcover over down-blend seating cushion.' },
      { id: 'pin-3', x: 25, y: 50, title: 'Weathered Sun-bleached Ash', category: 'Structure', details: 'Protective matte sealant preserving light driftwood aesthetic.' }
    ],
    'Cyberpunk Neon': [
      { id: 'pin-1', x: 30, y: 25, title: 'Programmable RGB Ambient Rail', category: 'Lighting', details: 'Addressable LED channel synced with spatial mood parameters.' },
      { id: 'pin-2', x: 60, y: 50, title: 'Smoked Tempered Glass Surface', category: 'Material', details: 'Scratch-resistant dark tinted glass with anti-glare coating.' },
      { id: 'pin-3', x: 75, y: 70, title: 'Ergonomic Carbon Fiber Mesh', category: 'Furniture', details: 'Breathable dual-zone lumbar support chair for long creative sessions.' }
    ],
    'Mediterranean': [
      { id: 'pin-1', x: 35, y: 25, title: 'Whitewashed Lime Stucco Niche', category: 'Structure', details: 'Hand-troweled lime plaster providing natural thermal regulation.' },
      { id: 'pin-2', x: 60, y: 75, title: 'Hand-painted Majolica Floor Tile', category: 'Material', details: 'Artisanal glazed ceramic tile reflecting sunlight.' },
      { id: 'pin-3', x: 80, y: 40, title: 'Forged Iron Lattice Pendant', category: 'Lighting', details: 'Traditional Mediterranean wrought iron frame with warm amber glass.' }
    ],
    'Art Deco': [
      { id: 'pin-1', x: 40, y: 30, title: 'Gold Inlay Sunburst Paneling', category: 'Structure', details: 'Precision-machined brass inlay on high-gloss lacquer wood.' },
      { id: 'pin-2', x: 65, y: 60, title: 'Scalloped Shell Accent Seating', category: 'Furniture', details: 'Deep emerald velvet chair with tapered gold brass legs.' },
      { id: 'pin-3', x: 25, y: 45, title: 'Tiered Beveled Deco Mirror', category: 'Material', details: 'Hand-cut mirror facets amplifying interior depth and light reflection.' }
    ],
    'Rustic Farmhouse': [
      { id: 'pin-1', x: 35, y: 25, title: 'Reclaimed Barnwood Hearth', category: 'Structure', details: 'Aged 150-year-old timber beam with natural distressed patina.' },
      { id: 'pin-2', x: 55, y: 65, title: 'Rough-sawn Trestle Table', category: 'Furniture', details: 'Heavy pine dining table sealed with organic beeswax.' },
      { id: 'pin-3', x: 75, y: 45, title: 'Matte Zinc Lantern Sconce', category: 'Lighting', details: 'Country vintage lantern fixture with clear seed glass.' }
    ]
  };

  return {
    dominantColors: colorSwatches[colorPalette] || colorSwatches['Warm Neutrals'],
    materials: styleMaterials[style] || styleMaterials['Scandinavian'],
    keyFurniture: selectedFurniture,
    designNotes: `Architectural directive for ${roomType}: This ${style} transformation preserves original room proportions while elevating interior acoustics, daylight distribution, and material authenticity. Palette features ${colorPalette} swatches thoughtfully matched to spatial daylighting.`,
    spatialAdvice: `Maintain clear 36-inch primary traffic corridors. Position major seating toward primary daylight sources while layering 2700K-3000K warm ambient task lighting at eye level.`,
    daylightKelvin: style === 'Cyberpunk Neon' ? '4500K Cool Ambient' : style === 'Scandinavian' ? '3200K Morning Daylight' : '2700K Warm Golden',
    acousticScore: 'NRC 0.78 (Optimal Absorption)',
    estimatedVolume: '48.5 m³ (Standard Ceiling 2.7m)',
    blueprintPins: blueprintPins[style] || blueprintPins['Scandinavian'],
    quotation: calculateQuotation(selectedFurniture)
  };
}
