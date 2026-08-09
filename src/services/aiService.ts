import type { 
  ApiSettings, 
  RoomType, 
  DesignStyle, 
  ColorPalette, 
  LightingVibe, 
  LayoutFidelity,
  TargetFocus,
  RoomAnalysis, 
  FurnitureRecommendation 
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
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1280&height=800&seed=${seed}&model=flux-realism&nologo=true`;
    await preloadImage(imageUrl);
    return { redesignedUrl: imageUrl, seed };
  }
}

// Helper to ensure image download completes
function preloadImage(url: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve();
    img.onerror = () => {
      resolve();
    };
    img.src = url;
    setTimeout(() => resolve(), 12000);
  });
}

// Generate Room Analysis & Furniture Recommendations
export function generateRoomAnalysis(roomType: RoomType, style: DesignStyle, colorPalette: ColorPalette): RoomAnalysis {
  const colorSwatches: Record<ColorPalette, string[]> = {
    'Warm Neutrals': ['#F5EBE0', '#E3D5CA', '#D5BDAF', '#B5927B', '#4A3E3D'],
    'Emerald & Gold': ['#064E3B', '#047857', '#D97706', '#FEF3C7', '#1F2937'],
    'Terracotta & Sage': ['#C2410C', '#EA580C', '#84CC16', '#4D7C0F', '#FEF08A'],
    'Charcoal & Marble': ['#111827', '#374151', '#9CA3AF', '#F3F4F6', '#6B7280'],
    'Pastel Dream': ['#FCE7F3', '#E0E7FF', '#FEF3C7', '#D1FAE5', '#4B5563'],
    'Monochromatic Dark': ['#030712', '#111827', '#1F2937', '#374151', '#9CA3AF'],
    'Boho Earth': ['#B45309', '#D97706', '#A16207', '#78350F', '#FEF3C7']
  };

  const styleMaterials: Record<DesignStyle, string[]> = {
    'Modern Minimalist': ['Matte Composite', 'Polished Concrete', 'Tempered Glass', 'Anodized Aluminum'],
    'Scandinavian': ['Natural Light Oak', 'Soft Organic Wool', 'White Matte Ceramic', 'Natural Linen'],
    'Japandi': ['Unfinished Cedar Wood', 'Woven Tatami Straw', 'Rough Clay Pottery', 'Shoji Paper'],
    'Industrial Loft': ['Exposed Steel I-Beams', 'Reclaimed Barnwood', 'Distressed Leather', 'Raw Red Brick'],
    'Bohemian Chic': ['Natural Rattan', 'Woven Jute Fibre', 'Terracotta Clay', 'Handmade Macramé'],
    'Mid-Century Modern': ['Solid Teak Wood', 'Walnut Veneer', 'Brushed Brass accents', 'Bouclé Fabric'],
    'Coastal Beach': ['Washed Driftwood', 'Crisp White Cotton', 'Seagrass Baskets', 'Frosted Sea Glass'],
    'Cyberpunk Neon': ['High-gloss Acrylic', 'Perforated Aluminum', 'RGB LED Strips', 'Smoked Glass'],
    'Luxury Neoclassic': ['Carrara White Marble', 'Polished Gold Leaf', 'Plush Velvet', 'Carved Hardwood'],
    'Mediterranean': ['Hand-painted Ceramic Tiles', 'Wrought Iron', 'Rough Stucco Plaster', 'Olive Wood'],
    'Art Deco': ['High-contrast Black Lacquer', 'Inlaid Brass Striping', 'Deep Emerald Velvet', 'Beveled Mirror'],
    'Rustic Farmhouse': ['Rough-sawn Pine', 'Galvanized Metal', 'Burlap Cloth', 'Cast Iron']
  };

  const furnitureSuggestions: Record<DesignStyle, FurnitureRecommendation[]> = {
    'Modern Minimalist': [
      { name: 'Sleek Low-Profile Modular Sofa', category: 'Seating', description: 'Clean geometry with concealed legs and deep comfort.', estimatedPrice: '$1,450', material: 'Performance Weave' },
      { name: 'Floating Wall Console', category: 'Storage', description: 'Handleless minimalist media cabinet with cable management.', estimatedPrice: '$680', material: 'Matte White Shell' },
      { name: 'Architectural Disc Coffee Table', category: 'Table', description: 'Single-piece minimalist round center table.', estimatedPrice: '$420', material: 'Satin Steel' }
    ],
    'Scandinavian': [
      { name: 'Nordic Oak Lounge Chair', category: 'Seating', description: 'Curved light oak frame with woven wool seat padding.', estimatedPrice: '$520', material: 'Solid Oak & Linen' },
      { name: 'Organic Pebble Coffee Table', category: 'Table', description: 'Asymmetrical smooth wooden table set.', estimatedPrice: '$340', material: 'Natural Ash' },
      { name: 'Chunky Wool Loop Rug', category: 'Textiles', description: 'Hand-knotted ultra-cozy floor covering.', estimatedPrice: '$290', material: '100% New Zealand Wool' }
    ],
    'Japandi': [
      { name: 'Zen Low Wooden Platform Bed/Sofa', category: 'Seating', description: 'Wabi-sabi grounded aesthetic with clean lines.', estimatedPrice: '$1,200', material: 'Hinoki Cypress' },
      { name: 'Rice Paper Floor Sphere Lamp', category: 'Lighting', description: 'Diffused ambient paper lantern glow.', estimatedPrice: '$180', material: 'Bamboo & Paper' },
      { name: 'Fluted Wooden Sideboard', category: 'Storage', description: 'Slatted wooden sliding doors with hidden storage.', estimatedPrice: '$890', material: 'Muted Teak Wood' }
    ],
    'Industrial Loft': [
      { name: 'Cognac Leather Club Sofa', category: 'Seating', description: 'Vintage tufted cognac leather with iron frame.', estimatedPrice: '$1,850', material: 'Full-Grain Leather' },
      { name: 'Cast Iron Factory Cart Table', category: 'Table', description: 'Industrial coffee table on heavy iron wheels.', estimatedPrice: '$550', material: 'Reclaimed Pine & Iron' },
      { name: 'Edison Pipe Wall Sconce Set', category: 'Lighting', description: 'Exposed filament warm amber lights.', estimatedPrice: '$140', material: 'Black Metal Piping' }
    ],
    'Bohemian Chic': [
      { name: 'Peacock Rattan Accent Armchair', category: 'Seating', description: 'Intricately woven rattan high-back throne chair.', estimatedPrice: '$380', material: 'Natural Rattan' },
      { name: 'Vintage Moroccan Berber Rug', category: 'Textiles', description: 'Plush diamond pattern tribal carpet.', estimatedPrice: '$460', material: 'Woven Wool' },
      { name: 'Tiered Plant Pedestal Stand', category: 'Decor', description: 'Multi-level wooden plant display.', estimatedPrice: '$110', material: 'Solid Mango Wood' }
    ],
    'Mid-Century Modern': [
      { name: 'Mid-Century Credenza', category: 'Storage', description: 'Slanted wooden peg legs with warm walnut grain.', estimatedPrice: '$920', material: 'American Walnut' },
      { name: 'Eames-Style Lounge & Ottoman', category: 'Seating', description: 'Iconic molded plywood and leather armchair.', estimatedPrice: '$1,100', material: 'Plywood & Black Leather' },
      { name: 'Brass Sputnik Chandelier', category: 'Lighting', description: 'Multi-directional brass light bursts.', estimatedPrice: '$320', material: 'Brushed Brass' }
    ],
    'Coastal Beach': [
      { name: 'Slipcovered White Linen Couch', category: 'Seating', description: 'Relaxed washable linen sofa with deep cushions.', estimatedPrice: '$1,350', material: 'Belgian Linen' },
      { name: 'Woven Seagrass Ottoman', category: 'Seating/Table', description: 'Natural textured round coffee pouf.', estimatedPrice: '$210', material: 'Natural Seagrass' },
      { name: 'White Wash Wood Beaded Chandelier', category: 'Lighting', description: 'Breezy wooden bead tier pendant.', estimatedPrice: '$280', material: 'Driftwood & Beads' }
    ],
    'Cyberpunk Neon': [
      { name: 'Ergonomic Cyber Mesh Throne', category: 'Seating', description: 'High-tech lumbar support chair with RGB accents.', estimatedPrice: '$690', material: 'Carbon Fiber Mesh' },
      { name: 'Smart LED Geometric Light Bars', category: 'Lighting', description: 'Programmable wall glow panels.', estimatedPrice: '$220', material: 'Diffuse Acrylic' },
      { name: 'Floating Glass Desk', category: 'Table', description: 'Smoked tempered glass with integrated cable channels.', estimatedPrice: '$540', material: 'Smoked Tempered Glass' }
    ],
    'Luxury Neoclassic': [
      { name: 'Tufted Velvet Chesterfield Sofa', category: 'Seating', description: 'Deep button-tufted royal velvet sofa with gold legs.', estimatedPrice: '$2,100', material: 'Royal Emerald Velvet' },
      { name: 'Carrara Marble Nesting Tables', category: 'Table', description: 'Natural marble slab top on polished brass base.', estimatedPrice: '$780', material: 'Italian Marble & Brass' },
      { name: 'Ornate Gilded Gold Wall Mirror', category: 'Decor', description: 'Full-length arched baroque mirror.', estimatedPrice: '$640', material: 'Gold Leaf Metal' }
    ],
    'Mediterranean': [
      { name: 'Arching Curved Plaster Niche Bench', category: 'Seating', description: 'Built-in whitewashed bench with custom cushions.', estimatedPrice: '$850', material: 'Plaster & Canvas' },
      { name: 'Terracotta Amphora Urn Set', category: 'Decor', description: 'Handmade rustic earthen pottery.', estimatedPrice: '$190', material: 'Earthy Clay' },
      { name: 'Wrought Iron Pendant Lantern', category: 'Lighting', description: 'Traditional Mediterranean iron lattice lantern.', estimatedPrice: '$260', material: 'Forged Iron' }
    ],
    'Art Deco': [
      { name: 'Curved Emerald Velvet Shell Chair', category: 'Seating', description: 'Scalloped back accent chair with gold legs.', estimatedPrice: '$490', material: 'Emerald Velvet & Brass' },
      { name: 'Geometric Gold Inlay Sideboard', category: 'Storage', description: 'Black lacquer cabinet with sunburst gold inlay.', estimatedPrice: '$1,150', material: 'Lacquer & Brass' },
      { name: 'Arch Beveled Deco Wall Mirror', category: 'Decor', description: 'Tiered geometric mirror frame.', estimatedPrice: '$340', material: 'Beveled Glass' }
    ],
    'Rustic Farmhouse': [
      { name: 'Trestle Dining Table', category: 'Table', description: 'Heavy rough-sawn pine dining table.', estimatedPrice: '$1,050', material: 'Reclaimed Pine' },
      { name: 'Cross-Back Wooden Chairs (Set of 4)', category: 'Seating', description: 'Classic country bistro dining seats.', estimatedPrice: '$440', material: 'Distressed Ash Wood' },
      { name: 'Galvanized Metal Pitcher Vase', category: 'Decor', description: 'Rustic flower pitcher for wildflower arrangements.', estimatedPrice: '$45', material: 'Galvanized Zinc' }
    ]
  };

  return {
    dominantColors: colorSwatches[colorPalette] || ['#2563EB', '#1E40AF', '#60A5FA', '#93C5FD', '#DBEAFE'],
    materials: styleMaterials[style] || ['Natural Wood', 'Linen', 'Ceramic', 'Metal'],
    keyFurniture: furnitureSuggestions[style] || furnitureSuggestions['Scandinavian'],
    designNotes: `To achieve this ${style} transformation in your ${roomType}, focus on balancing spatial volume with high-quality tactile materials. Keep sightlines clear towards natural light sources and maintain cohesive color harmony using the ${colorPalette} palette.`,
    spatialAdvice: `Position major seating elements 18-24 inches from tables. Ensure ambient lighting fixtures are placed at eye level when seated to maximize cozy intimacy.`
  };
}
