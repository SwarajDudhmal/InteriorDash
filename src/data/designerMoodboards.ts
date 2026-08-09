import type { DesignerMoodboard } from '../types/interior';

export const DESIGNER_MOODBOARDS: DesignerMoodboard[] = [
  {
    id: 'kyoto-wabi-sabi',
    title: 'Kyoto Wabi-Sabi Sanctuary',
    designer: 'Studio Hiroshi & Atelier Zen',
    location: 'Kyoto, Japan',
    style: 'Japandi',
    roomType: 'Living Room',
    colorPalette: 'Warm Neutrals',
    lighting: 'Warm Ambient',
    coverImage: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1200&auto=format&fit=crop',
    quote: 'Embrace imperfection with raw cypress wood, soft paper lanterns, and tactile linen tones.',
    architecturalElements: ['Low-profile Hinoki platform', 'Shoji paper wall diffusion', 'Woven tatami mat trim', 'Clay vessel accents']
  },
  {
    id: 'parisian-haussmannian',
    title: 'Parisian Haussmannian Elegance',
    designer: 'Maison de Valois',
    location: 'Paris, France',
    style: 'Luxury Neoclassic',
    roomType: 'Dining Room',
    colorPalette: 'Emerald & Gold',
    lighting: 'Golden Hour',
    coverImage: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?q=80&w=1200&auto=format&fit=crop',
    quote: 'Ornate crown moldings meet rich emerald velvet and polished Carrara marble fireplaces.',
    architecturalElements: ['Herringbone oak parquet', 'Baroque gilded wall mirrors', 'Carrara marble hearth', 'Brass chandelier']
  },
  {
    id: 'nordic-hygge-lounge',
    title: 'Scandinavian Hygge Lounge',
    designer: 'Studio Freja K.',
    location: 'Stockholm, Sweden',
    style: 'Scandinavian',
    roomType: 'Living Room',
    colorPalette: 'Warm Neutrals',
    lighting: 'Daylight',
    coverImage: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=1200&auto=format&fit=crop',
    quote: 'Bask in natural Nordic morning light surrounded by pale ash timber and bouclé textiles.',
    architecturalElements: ['Slatted oak acoustic wall paneling', 'Chunky New Zealand wool rug', 'Curved ash wood armchair', 'Recessed warm cove LED']
  },
  {
    id: 'desert-organic-modernism',
    title: 'Desert Organic Sanctuary',
    designer: 'Studio O. Architects',
    location: 'Santa Fe, New Mexico',
    style: 'Mediterranean',
    roomType: 'Bedroom',
    colorPalette: 'Terracotta & Sage',
    lighting: 'Golden Hour',
    coverImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop',
    quote: 'Earthy plaster curves, warm clay urns, and sun-washed terracottas bring desert warmth indoors.',
    architecturalElements: ['Curved adobe plaster niche', 'Earthy terracotta tiles', 'Rough wrought iron sconces', 'Washed sage linen drapes']
  }
];
