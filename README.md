# InteriorDash 🏡✨
> **AI-Powered Interior Design & Room Redesign Platform**

InteriorDash is an interactive AI-driven web application that transforms room photos into stunning interior redesigns while preserving architectural layout integrity. Whether you want to restyle a living room into Japandi minimalist, transform a bedroom into Mid-Century Modern, or customize furniture and color palettes without altering wall boundaries, InteriorDash provides instant photorealistic visual renders and spatial furniture recommendations.

---

## 🌟 Key Features

- 📸 **Source Room Photo Upload & Sample Presets**: Upload custom room photos or choose from sample presets across living rooms, bedrooms, kitchens, and office spaces.
- 📐 **Architectural Layout Structure Lock**:
  - **Strict Control**: Locks exact room perspective, walls, windows, and doors to prevent AI from adding unwanted architectural elements.
  - **Balanced Structure**: Retains core room perspective while restyling furniture placement and materials.
  - **Flexible Staging**: Full creative freedom while keeping room scale intact.
- 🎯 **Targeted Focus Controls**: Restyle the entire room, focus exclusively on furniture & decor, or target walls & floor finishes.
- 🎨 **12+ Design Styles**: Modern Minimalist, Scandinavian, Japandi, Industrial Loft, Bohemian Chic, Mid-Century Modern, Coastal Beach, Cyberpunk Neon, Luxury Neoclassic, Mediterranean, Art Deco, and Rustic Farmhouse.
- 🌈 **Color Palettes & Lighting Vibes**: Tailor color schemes (Warm Neutrals, Emerald & Gold, Terracotta & Sage, Charcoal & Marble, Boho Earth, etc.) and lighting ambience (Golden Hour, Daylight, Warm Ambient, Mood Dim, Cyber Neon).
- 🎛️ **Personalization Studio**: Fine-tune custom prompt instructions to tweak specific elements (e.g., "Add a dark oak bookshelf", "Replace rug with jute").
- 🪟 **Interactive Before/After Comparison Slider**: Touch & drag interactive split-view slider to inspect original vs. AI-redesigned room details side by side.
- 💡 **AI Spatial & Furniture Analysis**: Automatically generates interior design reports including color swatch palettes, key material lists, curated furniture suggestions with price estimates, and spatial placement advice.
- 📚 **Design History Drawer**: Automatically saves generated redesigns to local browser storage (`localStorage`) so you can revisit, compare, or export past transformations.
- ⚙️ **Custom AI Providers**: Supports out-of-the-box free rendering via Pollinations AI as well as custom Hugging Face Inference API keys.

---

## 🛠️ Tech Stack

- **Frontend Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tooling**: [Vite 8](https://vite.dev/)
- **Styling**: Modern Responsive CSS & Utility Architecture
- **Icons**: [Lucide React](https://lucide.dev/)
- **Visual Effects**: `canvas-confetti`
- **AI Rendering**: Pollinations AI free tier / Hugging Face Inference API

---

## 🚀 Quick Start Guide

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v18 or higher) and `npm` or `bun` installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SwarajDudhmal/InteriorDash.git
   cd InteriorDash
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   # or
   bun dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.

---

## 📁 Project Structure

```
InteriorDash/
├── public/                # Static assets & icons
├── src/
│   ├── assets/            # Hero & branding assets
│   ├── components/        # React UI Components
│   │   ├── Header.tsx                 # Navigation bar & status indicators
│   │   ├── RoomUploader.tsx           # Photo uploader & preset selector
│   │   ├── DesignControls.tsx         # Style, color & layout control panel
│   │   ├── ImageComparisonSlider.tsx  # Before/After interactive slider
│   │   ├── PersonalizationEditor.tsx  # Interactive tweak & prompt editor
│   │   ├── InteriorAnalysis.tsx       # AI furniture & color analysis card
│   │   ├── DesignHistory.tsx          # Saved redesigns drawer
│   │   ├── ApiSettingsModal.tsx       # AI provider settings modal
│   │   └── Footer.tsx                 # Footer branding
│   ├── data/              # Sample room presets data
│   ├── services/          # AI prompt builders & API integration service
│   ├── types/             # TypeScript type definitions
│   ├── App.tsx            # Main application state & flow
│   ├── index.css          # Core CSS styling & animations
│   └── main.tsx           # Application entry point
├── package.json
├── vite.config.ts
└── README.md
```

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

