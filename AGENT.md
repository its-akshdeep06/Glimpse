# AGENT.md — Full Technical Blueprint & Codebase Documentation

This document serves as the authoritative, single-source-of-truth technical blueprint for **MODULE — QR Atelier**. It contains the complete architectural overview, component inventory, data flow specifications, state management rules, and local storage patterns necessary for any AI agent or developer to immediately understand and maintain this repository.

---

## 1. Project Overview & System Architecture

**MODULE — QR Atelier** is a client-side, zero-backend React web application for creating, customizing, rendering, and managing QR codes.

- **Stack**: React 18, Vite 8, Tailwind CSS, Framer Motion, TanStack React Query.
- **Routing**: `react-router-dom` with 2 main pages (`/` Landing Page, `/app` Generator Page/Workspace) and a `*` 404 handler.
- **Persistence**: Hybrid browser storage. IndexedDB (`module-qr` database) handles projects, recents, favorites, downloads, and temporary drafts. `localStorage` handles user preferences (`module.settings`) and auto-increment naming counters.
- **QR Encoding**: Standard Reed-Solomon QR encoder (Byte mode, Versions 1–40, Error Correction Levels L/M/Q/H) implemented natively in JS ([`src/lib/qr/encoder.js`](file:///c:/Users/Akshdeep%20Singh/OneDrive/Desktop/Aksh/Codes/Glimpse/Qrgen-main/src/lib/qr/encoder.js)). Zero external AI or backend dependencies.

---

## 2. Comprehensive Directory Structure & File Map

```
c:/Users/Akshdeep Singh/OneDrive/Desktop/Aksh/Codes/Glimpse/Qrgen-main/
├── index.html                       # HTML entry point with meta tags & root div
├── package.json                     # Dependencies & npm scripts
├── vite.config.js                   # Vite configuration (React plugin & '@' path alias)
├── tailwind.config.js               # Tailwind design system configuration (custom colors, fonts)
├── AGENT.md                         # Project documentation for AI agents & developers
└── src/
    ├── main.jsx                     # Application entry point rendering <App />
    ├── App.jsx                      # Main router, QueryClientProvider, global overlays (ThemeManager, CustomCursor, Toaster)
    ├── index.css                    # Design system tokens, root variables, utility classes
    ├── hooks/
    │   ├── useQRProject.js          # Core custom hook managing active project state, history (undo/redo), validation, & persistence
    │   ├── useTheme.js              # Theme switcher hook (dark/light/system)
    │   └── use-mobile.jsx           # Responsive screen width detection hook
    ├── services/
    │   ├── qrService.js             # Matrix generation, geometric calculation, SVG rendering, PNG/SVG exports, share/copy helpers
    │   └── storageService.js        # IndexedDB abstraction & localStorage settings manager
    ├── utils/
    │   └── validation.js            # Input schemas, field definitions, sanitization, & defaults for all 10 QR content types
    ├── lib/
    │   ├── query-client.js          # Shared TanStack React Query client instance
    │   ├── sections.js              # Sidebar section navigation schema
    │   ├── templates.js             # 8 curated visual design presets (Monolith, Azure Signal, etc.)
    │   ├── utils.js                 # Tailwind class merger utility (cn) & iframe detection
    │   ├── PageNotFound.jsx         # Modern 404 error page component
    │   └── qr/
    │       └── encoder.js           # Low-level native Reed-Solomon QR matrix generator
    ├── pages/
    │   ├── LandingPage.jsx          # Public landing page showcasing product features, design samples, & CTA
    │   └── GeneratorPage.jsx        # Main application page wrapping the Workspace component
    └── components/
        ├── ScrollToTop.jsx          # Automatic route change scroll resets
        ├── ThemeManager.jsx         # Syncs document class with active theme selection
        ├── app/                     # Main generator workspace components
        │   ├── Workspace.jsx        # Top-level workspace layout orchestrator & section navigator
        │   ├── QRForm.jsx           # Dynamic input form renderer matching selected QR content type
        │   ├── CustomizerPanel.jsx  # Styling controls accordion (Appearance, Color, Logo, Size, Quality)
        │   ├── LivePreview.jsx      # Real-time animated QR preview canvas with download/share actions
        │   ├── GalleryGrid.jsx      # Card grid for saved Recents, Favorites, and Downloads
        │   ├── SectionHeader.jsx    # Standardized workspace section header bar
        │   ├── SettingsView.jsx     # App settings & storage management interface
        │   ├── TemplatesGrid.jsx    # Visual template selector grid
        │   └── customizer/          # Individual customizer panel tabs
        │       ├── AppearanceTab.jsx# Module shape selection (square, rounded, dot)
        │       ├── ColorField.jsx   # Color picker & hex code input component
        │       ├── LogoControl.jsx  # File upload & scaling controls for center logo overlays
        │       ├── QualityTab.jsx   # Error correction level selector (L, M, Q, H)
        │       ├── RangeField.jsx   # Standardized range slider with live readout
        │       └── SizeTab.jsx      # Canvas pixel resolution selector
        ├── brand/
        │   └── LogoMark.jsx         # Vector brand logo mark
        ├── fx/                      # Modern UI micro-interactions & visual effects
        │   ├── CropMarks.jsx        # Decorative technical alignment corners
        │   ├── CustomCursor.jsx     # Custom follower cursor animation
        │   ├── GridField.jsx        # Animated background grid overlay
        │   ├── LensCard.jsx         # Interactive glass lens blur card effect
        │   ├── LiquidNumber.jsx     # Animated number counter transitions
        │   ├── Magnetic.jsx         # Magnetic hover effect wrapper for buttons
        │   ├── Reveal.jsx           # Framer Motion reveal on scroll/view
        │   ├── SplitText.jsx        # Typography animation effect
        │   └── TiltCard.jsx         # 3D tilt interaction card container
        ├── landing/                 # Landing page sections
        │   ├── CurtainFooter.jsx    # Landing page footer section
        │   ├── DesignSection.jsx   # Design feature showcase
        │   ├── FormatsSection.jsx  # Export formats feature highlight
        │   ├── Hero.jsx             # Hero title & interactive CTA
        │   ├── HeroQR.jsx           # Interactive hero QR preview card
        │   ├── HeroReadout.jsx      # Live statistics/readout badges
        │   ├── LandingNav.jsx       # Landing page navigation bar
        │   ├── PrivacySection.jsx  # Zero-backend privacy commitment display
        │   ├── ProcessSection.jsx  # 3-step creation process walkthrough
        │   ├── TemplateBelt.jsx     # Animated template marquee belt
        │   └── TypesMarquee.jsx     # Scrolling marquee of supported QR types
        ├── qr/
        │   └── QRArt.jsx            # Dynamic SVG renderer using Framer Motion animations
        └── ui/                      # Standard Shadcn UI primitive components (button, dialog, input, slider, select, toast, etc.)
```

---

## 3. Core Component Hierarchy & Data Flow

### 3.1 Workspace Component Tree

```
GeneratorPage
 └── Workspace
      ├── Sidebar Navigation (Sections: create, recents, templates, favorites, downloads, settings)
      ├── Header (Project title editing, Undo/Redo, Favorite toggle, Save button)
      └── Main Workspace View
           ├── Section: 'create'
           │    ├── QRForm (Renders inputs based on active project.type)
           │    ├── CustomizerPanel
           │    │    ├── AppearanceTab
           │    │    ├── ColorField / RangeField
           │    │    ├── LogoControl
           │    │    ├── SizeTab
           │    │    └── QualityTab
           │    └── LivePreview
           │         └── QRArt (SVG geometry & matrix rendering)
           ├── Section: 'templates' -> TemplatesGrid
           ├── Section: 'recents' | 'favorites' | 'downloads' -> GalleryGrid
           └── Section: 'settings' -> SettingsView
```

### 3.2 Key Data Hooks & Services

1. **[`useQRProject`](file:///c:/Users/Akshdeep%20Singh/OneDrive/Desktop/Aksh/Codes/Glimpse/Qrgen-main/src/hooks/useQRProject.js)**:
   - Holds the primary state object `project` containing:
     - `id`, `name`, `type` (url, text, wifi, vcard, email, phone, sms, location, event, crypto)
     - `fields` (key-value dictionary matching validation schemas)
     - `encoded` (the actual formatted string payload outputted by validation helpers)
     - `customization` (colors, moduleStyle, margin, size, errorCorrection, logo, gradient)
   - Handles history (undo stack up to 30 steps) and auto-saves draft state to IndexedDB using `storageService.saveDraft()`.

2. **[`validation.js`](file:///c:/Users/Akshdeep%20Singh/OneDrive/Desktop/Aksh/Codes/Glimpse/Qrgen-main/src/utils/validation.js)**:
   - Contains content definitions and sanitization formulas for all 10 QR data types.
   - Example: For `wifi`, formats fields into standard `WIFI:T:<encryption>;S:<ssid>;P:<password>;;`.

3. **[`qrService.js`](file:///c:/Users/Akshdeep%20Singh/OneDrive/Desktop/Aksh/Codes/Glimpse/Qrgen-main/src/services/qrService.js)**:
   - Translates formatted payload strings into 2D boolean matrices using `encodeQR()`.
   - Computes layout geometries (finders, modules, center logo overlay padding).
   - Generates SVG vectors and canvas-rendered PNG image blobs for exports/downloads.

4. **[`storageService.js`](file:///c:/Users/Akshdeep%20Singh/OneDrive/Desktop/Aksh/Codes/Glimpse/Qrgen-main/src/services/storageService.js)**:
   - Handles all local storage operations cleanly via IndexedDB.
   - Collections: `recents`, `favorites`, `downloads`, `meta`.

---

## 4. Guidelines for Future Agent Development

1. **Zero AI / External API Dependencies**: Keep all QR generation local. Never introduce backend calls or AI SDK wrappers.
2. **Component Integrity**: Ensure UI components in `src/components/ui/` remain standard Shadcn primitives and continue using Tailwind utility classes.
3. **Validation & Content Integrity**: When adding or modifying QR content types, update `TYPE_CONFIGS` and sanitization functions in [`src/utils/validation.js`](file:///c:/Users/Akshdeep%20Singh/OneDrive/Desktop/Aksh/Codes/Glimpse/Qrgen-main/src/utils/validation.js).
4. **State Persistence**: Always verify changes against `useQRProject` state transitions and confirm draft auto-save behavior in IndexedDB.
5. **Change Logging**: All code updates must first be documented in `AGENT.md`. The final version of any modification should be reflected in this document before being merged.
## 5. Changelog

All code modifications must be logged here **before** being merged. Each entry should include:
- Date (YYYY-MM-DD)
- Brief description of change
- Files affected
- Reference to the commit or PR

The latest entry should appear at the top of this section.
