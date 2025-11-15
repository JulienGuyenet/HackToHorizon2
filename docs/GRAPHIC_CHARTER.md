# VIOTTE Graphic Charter Implementation Guide

## Overview
This document describes the implementation of the VIOTTE Building graphic charter for the HackToHorizon inventory management system.

## Color Palette

### Primary Colors
```css
--color-brown-dark: #4A3F3A    /* Header background, primary titles */
--color-brown-medium: #5C4F48  /* Secondary elements, hover states */
--color-brown-light: #D9C9B8   /* Accents, secondary buttons */
--color-white: #FFFFFF         /* Text on dark, backgrounds */
```

### Accent Colors
```css
--color-teal: #2C9BA6          /* Active states, highlights, CTAs */
--color-teal-hover: #238991    /* Hover state for teal elements */
--color-gray-light: #8F9AA3    /* Inactive navigation items */
--color-gray-nav: #E5E7E9      /* Navigation background alternative */
```

### Usage Guidelines

#### Dark Brown (#4A3F3A)
- **Primary Use**: Header background
- **Secondary Use**: Primary text, headings
- **Contrast**: Use white text on this background (ratio 8.59:1)

#### Teal (#2C9BA6)
- **Primary Use**: Active navigation tabs, call-to-action buttons
- **Secondary Use**: Links, highlights, underlines
- **Contrast**: Use white text on this background (ratio 3.8:1)

#### Brown Light (#D9C9B8)
- **Primary Use**: Secondary buttons
- **Secondary Use**: Subtle backgrounds, dividers
- **Contrast**: Use dark brown text on this background

## Typography

### Font Families

#### Titles and Headings
- **Font**: Montserrat (Google Fonts)
- **Weights**: 400 (Regular), 500 (Medium), 600 (Semi-Bold), 700 (Bold)
- **Use For**: Page titles, section headings, card titles, stat values

```css
font-family: var(--font-title);
/* or */
font-family: 'Montserrat', sans-serif;
```

#### Body Text
- **Font**: Open Sans (Google Fonts)
- **Weights**: 300 (Light), 400 (Regular), 500 (Medium), 600 (Semi-Bold)
- **Use For**: Paragraphs, labels, navigation, form inputs

```css
font-family: var(--font-body);
/* or */
font-family: 'Open Sans', sans-serif;
```

### Type Scale

```css
/* Page Titles (H1) */
font-size: 1.5rem;     /* 24px - Mobile */
font-size: 1.8rem;     /* 28.8px - Desktop */
font-weight: 700;
font-family: var(--font-title);

/* Section Headings (H2) */
font-size: 1.2rem;     /* 19.2px */
font-weight: 600;
font-family: var(--font-title);

/* Card Titles (H3) */
font-size: 1rem;       /* 16px */
font-weight: 600;
font-family: var(--font-title);

/* Body Text */
font-size: 0.95rem;    /* 15.2px */
font-weight: 400;
font-family: var(--font-body);

/* Small Text */
font-size: 0.85rem;    /* 13.6px */
font-weight: 400;
font-family: var(--font-body);
```

## Layout Structure

### Header
- **Height**: 72px (desktop), auto (mobile)
- **Background**: var(--color-brown-dark)
- **Text Color**: var(--color-white)
- **Structure**: Three-zone layout

```
┌─────────────────────────────────────────────────────┐
│  [Logo Left]    [Title + Subtitle]    [Logo Right]  │
│                                      [Lang Buttons]  │
└─────────────────────────────────────────────────────┘
```

### Navigation
- **Height**: Auto (48-56px typical)
- **Background**: var(--color-white)
- **Border**: 1px solid #e0e0e0 (bottom)
- **Active Indicator**: 3px solid var(--color-teal) (bottom border)

### Content Area
- **Max Width**: 100% (full width)
- **Padding**: 1.5rem (desktop), 1rem (mobile)
- **Background**: #f5f5f5 (page), white (cards)

## Component Specifications

### Buttons

#### Primary Button
```css
background: var(--color-teal);
color: var(--color-white);
padding: 0.7rem 1.5rem;
border-radius: 4px;
font-weight: 500;
transition: all 0.3s;

/* Hover */
background: var(--color-teal-hover);
transform: translateY(-1px);
box-shadow: 0 4px 8px rgba(44, 155, 166, 0.3);
```

#### Secondary Button
```css
background: var(--color-brown-light);
color: var(--color-brown-dark);
padding: 0.7rem 1.5rem;
border-radius: 4px;
font-weight: 500;

/* Hover */
background: #C9B9A8;
```

### Navigation Tabs
```css
/* Inactive */
color: var(--color-gray-light);
border-bottom: 3px solid transparent;

/* Hover */
color: var(--color-brown-dark);
background: rgba(0, 0, 0, 0.02);

/* Active */
color: var(--color-brown-dark);
font-weight: 600;
border-bottom: 3px solid var(--color-teal);
```

### Form Inputs
```css
border: 1px solid #ddd;
border-radius: 4px;
padding: 0.6rem;

/* Focus */
border-color: var(--color-teal);
box-shadow: 0 0 0 3px rgba(44, 155, 166, 0.1);
outline: none;
```

### Cards
```css
background: white;
border: 1px solid #e0e0e0;
border-radius: 8px;
padding: 1rem;

/* Hover (optional) */
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
```

## Responsive Breakpoints

### Desktop First Approach
```css
/* Large Desktop */
@media (min-width: 1440px) { /* ... */ }

/* Desktop */
@media (max-width: 1280px) { /* ... */ }

/* Tablet */
@media (max-width: 1024px) {
  /* Reduce logo sizes to 80% */
  /* Adjust header padding */
  /* Smaller font sizes */
}

/* Mobile */
@media (max-width: 768px) {
  /* Stack header elements vertically */
  /* Full-width filters */
  /* Single column layouts */
}

/* Small Mobile */
@media (max-width: 480px) {
  /* Further size reductions */
  /* Minimum touch targets 44x44px */
}
```

## Accessibility

### Contrast Ratios (WCAG 2.1)
- **Brown Dark on White**: 8.59:1 ✓ AAA
- **Teal on White**: 3.8:1 ✓ AA (Large Text)
- **White on Brown Dark**: 8.59:1 ✓ AAA
- **White on Teal**: 3.8:1 ✓ AA

### Focus States
All interactive elements must have visible focus indicators:
```css
:focus {
  outline: 2px solid var(--color-teal);
  outline-offset: 2px;
}

/* Or custom focus ring */
:focus {
  box-shadow: 0 0 0 3px rgba(44, 155, 166, 0.3);
  outline: none;
}
```

### Keyboard Navigation
- Tab order follows visual order
- Skip links for main content
- ARIA labels for icon buttons

## Logo Integration

### Placement
- **Left Logo**: Primary organization logo
- **Right Logo**: Partner or secondary logo

### Specifications
- **Height**: 48px (desktop), 40px (tablet), 32px (mobile)
- **Max Width**: 200px
- **Padding**: 8px minimum clear space
- **Format**: SVG preferred, PNG fallback

### File Naming
```
logo-[name]--[variant].svg

Examples:
- logo-viotte--white.svg
- logo-partner--white.svg
```

See `/docs/LOGO_SPECIFICATIONS.md` for complete details.

## Animation & Transitions

### Standard Timing
```css
transition: all 0.3s ease;
```

### Hover Effects
```css
/* Subtle lift */
transform: translateY(-1px);

/* Shadow */
box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
```

### Loading States
```css
/* Spinner */
border: 5px solid #f3f3f3;
border-top: 5px solid var(--color-teal);
animation: spin 1s linear infinite;
```

## Future Enhancements

### Hero Section
When implementing hero sections for specific pages:
```css
.hero-section {
  position: relative;
  height: 400px;
  background-image: url('/assets/images/hero-bg.jpg');
  background-size: cover;
  background-position: center;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--color-overlay); /* rgba(0, 0, 0, 0.45) */
}

.hero-content {
  position: relative;
  z-index: 1;
  color: white;
  text-align: center;
  padding: 4rem 2rem;
}
```

### Floor Selection Tabs
Large interactive floor selection buttons:
```css
.floor-tabs {
  display: flex;
  justify-content: center;
  gap: 2rem;
  padding: 2rem;
}

.floor-tab {
  font-family: var(--font-title);
  font-size: 3rem;
  font-weight: 700;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding-bottom: 0.5rem;
  border-bottom: 4px solid transparent;
  cursor: pointer;
  transition: all 0.3s;
}

.floor-tab:hover {
  border-bottom-color: white;
}

.floor-tab.active {
  border-bottom-color: var(--color-teal);
}
```

## CSS Variables Quick Reference

```css
:root {
  /* Colors */
  --color-brown-dark: #4A3F3A;
  --color-brown-medium: #5C4F48;
  --color-brown-light: #D9C9B8;
  --color-white: #FFFFFF;
  --color-overlay: rgba(0, 0, 0, 0.45);
  --color-teal: #2C9BA6;
  --color-teal-hover: #238991;
  --color-gray-light: #8F9AA3;
  --color-gray-nav: #E5E7E9;
  
  /* Typography */
  --font-title: 'Montserrat', sans-serif;
  --font-body: 'Open Sans', sans-serif;
  
  /* Spacing */
  --header-height: 72px;
  --logo-height: 48px;
  --logo-padding: 8px;
}
```

## Resources

- **Logo Specifications**: `/docs/LOGO_SPECIFICATIONS.md`
- **Google Fonts**: https://fonts.google.com/
- **Color Contrast Checker**: https://webaim.org/resources/contrastchecker/
- **WCAG Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/

---

**Version**: 1.0  
**Last Updated**: November 2024  
**Maintained By**: Design & Development Team
