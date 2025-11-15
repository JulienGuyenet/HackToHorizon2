# Logo Specifications and Brand Assets

## Overview
This document provides specifications for logo integration in the HackToHorizon inventory management system, following the VIOTTE Building graphic charter.

## Logo Requirements

### 1. Formats Required

All logos must be provided in the following formats:

#### Primary Format
- **SVG** (Scalable Vector Graphics)
  - Preferred for web use
  - Infinitely scalable without quality loss
  - Small file size
  - Path: `/public/assets/logos/logo-[name].svg`

#### Fallback Formats
- **PNG 2x** (200% resolution for retina displays)
  - Size: 192x192px minimum
  - Transparent background
  - Path: `/public/assets/logos/logo-[name]@2x.png`

- **PNG 3x** (300% resolution for high-DPI displays)
  - Size: 288x288px minimum
  - Transparent background
  - Path: `/public/assets/logos/logo-[name]@3x.png`

- **PDF** (for print and vector manipulation)
  - Vector format
  - CMYK color space for print
  - Path: `/public/assets/logos/logo-[name].pdf`

### 2. Logo Versions

Each logo must be provided in the following versions:

#### Full Color Version
- Normal brand colors
- For use on white or light backgrounds
- Filename: `logo-[name].svg`

#### Monochrome Dark
- Black or dark brown (#4A3F3A)
- For use on light backgrounds
- Filename: `logo-[name]--dark.svg`

#### Monochrome Light / White
- White (#FFFFFF)
- For use on dark backgrounds (header, overlays)
- Filename: `logo-[name]--white.svg`

#### Reduced/Favicon Version
- Simplified icon version
- 48x48px minimum
- For use as favicon or small icon
- Filename: `logo-[name]--icon.svg`

### 3. Size Specifications

#### Header Logo (Left)
- **Display Height**: 48-64px
- **Maximum Width**: 200px
- **Padding**: 8px minimum around logo
- **Container**: `.header-logo-left`
- **Usage**: Primary organizational logo

#### Header Logo (Right)
- **Display Height**: 48-80px (can be slightly larger if decorative)
- **Maximum Width**: 200px
- **Padding**: 8px minimum around logo
- **Container**: `.header-logo-right`
- **Usage**: Partner or secondary logo

#### Favicon
- **Size**: 48x48px, 32x32px, 16x16px
- **Format**: ICO, PNG
- **Usage**: Browser tab icon

### 4. Color Specifications

#### Primary Color Palette
```css
/* Main brand colors from graphic charter */
--color-brown-dark: #4A3F3A    /* Header background, primary text */
--color-brown-medium: #5C4F48  /* Secondary elements */
--color-brown-light: #D9C9B8   /* Accents, buttons */
--color-white: #FFFFFF         /* Text on dark, backgrounds */
--color-teal: #2C9BA6          /* Accent, active states */
```

#### Logo Color Rules
1. On dark brown header (#4A3F3A): Use white version
2. On white backgrounds: Use full color or dark version
3. On light backgrounds: Use full color version
4. Maintain minimum contrast ratio of 4.5:1 (WCAG AA)

### 5. Usage Rules

#### Protection Zone
- **Minimum**: 8px clear space around logo at standard display size
- **Recommended**: 16px for comfortable spacing
- **Calculation**: Equal to the height of the smallest logo element

#### Proportions
- **Never stretch or skew** the logo
- **Always maintain aspect ratio**
- **Use object-fit: contain** in CSS

#### Minimum Sizes
- **Web display**: 32px height minimum
- **Print**: 0.5 inch (12.7mm) height minimum
- **Digital screens**: 48px height minimum for clarity

### 6. File Naming Convention

```
logo-[organization]--[variant].[extension]

Examples:
- logo-viotte.svg               (Primary logo, full color)
- logo-viotte--white.svg        (White version for dark header)
- logo-viotte--dark.svg         (Dark version for light backgrounds)
- logo-viotte--icon.svg         (Icon/favicon version)
- logo-partner1.svg             (Partner logo)
- logo-partner1--white.svg      (Partner logo white version)
```

### 7. Accessibility Requirements

#### Alt Text
Provide descriptive alt text for all logo images:

```html
<!-- Primary logo -->
<img src="/assets/logos/logo-viotte--white.svg" 
     alt="Logo Région Bourgogne Franche-Comté - Bâtiment VIOTTE" />

<!-- Partner logo -->
<img src="/assets/logos/logo-partner--white.svg" 
     alt="Logo [Partner Organization Name]" />
```

#### Responsive Behavior
- **Desktop (>1024px)**: Full size logos
- **Tablet (768-1024px)**: Reduce to 80% size
- **Mobile (<768px)**: Use icon version or reduce to 70% size

### 8. Implementation Example

```html
<!-- Header with logos -->
<header class="app-header">
    <div class="header-logo-left">
        <img src="/assets/logos/logo-viotte--white.svg" 
             alt="Logo Région Bourgogne Franche-Comté"
             height="48" />
    </div>
    <div class="header-center">
        <h1>Système de Gestion d'Inventaire</h1>
        <p>Bâtiment VIOTTE - Gestion Interactive</p>
    </div>
    <div class="header-logo-right">
        <img src="/assets/logos/logo-partner--white.svg" 
             alt="Logo Partenaire"
             height="64" />
    </div>
</header>
```

```css
/* CSS for logo containers */
.header-logo-left img,
.header-logo-right img {
    height: 100%;
    width: auto;
    object-fit: contain;
    max-width: 200px;
}
```

### 9. Delivery Checklist

Before final delivery, ensure all logo assets include:

- [ ] SVG files (color, white, dark variants)
- [ ] PNG files @2x and @3x resolution
- [ ] PDF vector files
- [ ] Icon/favicon versions (48x48, 32x32, 16x16)
- [ ] Documented color codes (Hex, RGB, CMYK)
- [ ] Alt text descriptions for each logo
- [ ] Usage guidelines document
- [ ] Clear protection zone measurements
- [ ] Examples of correct and incorrect usage

### 10. Brand Assets Directory Structure

```
/public/assets/logos/
├── logo-viotte.svg                    # Primary logo (full color)
├── logo-viotte--white.svg             # White version for dark backgrounds
├── logo-viotte--dark.svg              # Dark version for light backgrounds
├── logo-viotte--icon.svg              # Icon version
├── logo-viotte@2x.png                 # PNG fallback 2x
├── logo-viotte@3x.png                 # PNG fallback 3x
├── logo-partner1.svg                  # Partner logo
├── logo-partner1--white.svg           # Partner white version
├── logo-partner1@2x.png               # Partner PNG 2x
├── logo-partner1@3x.png               # Partner PNG 3x
├── favicon.ico                        # Browser favicon
├── favicon-16x16.png                  # Favicon 16px
├── favicon-32x32.png                  # Favicon 32px
└── favicon-48x48.png                  # Favicon 48px
```

## Contact

For questions about logo specifications or to submit logo assets, please contact the design team or project maintainer.

---

**Last Updated**: November 2024  
**Version**: 1.0  
**Graphic Charter**: VIOTTE Building Design System
