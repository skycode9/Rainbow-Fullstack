# Typography System Documentation

## Overview

This project uses a modern typography system with **Poppins** as the primary font and **Manrope** as the secondary font, replacing the previous Gilroy setup. Both fonts are loaded from Google Fonts with comprehensive weight support.

## Font Stack

### Primary Font (Poppins)
- **Usage**: Headings, display text, and primary UI elements
- **Weights**: 100, 200, 300, 400, 500, 600, 700, 800, 900
- **Characteristics**: Modern, geometric, highly readable

### Secondary Font (Manrope)
- **Usage**: Body text, descriptions, and secondary content
- **Weights**: 200, 300, 400, 500, 600, 700, 800
- **Characteristics**: Clean, versatile, excellent for body text

### Fallback Stack
Both font families include comprehensive fallbacks:
```css
"Poppins", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif
```

## CSS Variables

### Font Families
```css
--font-primary: Poppins + fallbacks
--font-secondary: Manrope + fallbacks  
--font-mono: SF Mono + fallbacks
```

### Font Weights
```css
--font-thin: 100
--font-extralight: 200
--font-light: 300
--font-normal: 400
--font-medium: 500
--font-semibold: 600
--font-bold: 700
--font-extrabold: 800
--font-black: 900
```

### Font Sizes
```css
--text-xs: 0.75rem    /* 12px */
--text-sm: 0.875rem   /* 14px */
--text-base: 1rem     /* 16px */
--text-lg: 1.125rem   /* 18px */
--text-xl: 1.25rem    /* 20px */
--text-2xl: 1.5rem    /* 24px */
--text-3xl: 1.875rem  /* 30px */
--text-4xl: 2.25rem   /* 36px */
--text-5xl: 3rem      /* 48px */
--text-6xl: 3.75rem   /* 60px */
--text-7xl: 4.5rem    /* 72px */
--text-8xl: 6rem      /* 96px */
--text-9xl: 8rem      /* 128px */
```

### Line Heights
```css
--leading-none: 1
--leading-tight: 1.25
--leading-snug: 1.375
--leading-normal: 1.5
--leading-relaxed: 1.625
--leading-loose: 2
```

## Utility Classes

### Font Family Classes
```css
.font-primary    /* Poppins */
.font-secondary  /* Manrope */
.font-mono       /* Monospace */
```

### Heading Classes
```css
.heading-1  /* 60px, bold, tight leading */
.heading-2  /* 48px, semibold, tight leading */
.heading-3  /* 36px, semibold, snug leading */
.heading-4  /* 30px, medium, snug leading */
.heading-5  /* 24px, medium, snug leading */
.heading-6  /* 20px, medium, normal leading */
```

### Body Text Classes
```css
.body-large   /* 18px, normal weight, relaxed leading */
.body-normal  /* 16px, normal weight, normal leading */
.body-small   /* 14px, normal weight, normal leading */
```

### Display Text Classes
```css
.display-large   /* 96px, extrabold, no leading */
.display-medium  /* 72px, bold, no leading */
```

### Utility Classes
```css
.caption  /* 12px, medium, uppercase, spaced */
.label    /* 14px, medium, normal leading */
```

## Usage Examples

### React/JSX
```jsx
// Headings
<h1 className="heading-1">Main Title</h1>
<h2 className="heading-2">Section Title</h2>

// Body text
<p className="body-normal">Regular paragraph text</p>
<p className="body-large">Larger body text for emphasis</p>

// Display text
<div className="display-large">Hero Text</div>

// Labels and captions
<span className="label">Form Label</span>
<span className="caption">Image Caption</span>
```

### CSS Custom Properties
```css
.custom-text {
  font-family: var(--font-primary);
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  line-height: var(--leading-tight);
}
```

## Responsive Behavior

The typography system includes responsive adjustments:

### Tablet (≤768px)
- `.heading-1`: Reduces to 36px
- `.heading-2`: Reduces to 30px
- `.display-large`: Reduces to 60px
- `.display-medium`: Reduces to 48px

### Mobile (≤480px)
- `.heading-1`: Reduces to 30px
- `.heading-2`: Reduces to 24px
- `.display-large`: Reduces to 48px
- `.display-medium`: Reduces to 36px

## Best Practices

1. **Use semantic HTML**: Always use appropriate heading tags (h1-h6) with utility classes
2. **Consistent hierarchy**: Maintain logical heading order
3. **Responsive design**: Test typography on different screen sizes
4. **Accessibility**: Ensure sufficient contrast and readable font sizes
5. **Performance**: Fonts are loaded with `font-display: swap` for better loading performance

## Migration from Gilroy

If you're updating existing components:

1. Replace `font-family: "Gilroy"` with `font-family: var(--font-primary)`
2. Use the new utility classes instead of custom font declarations
3. Update font weights to use CSS variables
4. Test responsive behavior with the new font stack

## Browser Support

- **Modern browsers**: Full support with Google Fonts
- **Older browsers**: Graceful fallback to system fonts
- **Font loading**: Optimized with `font-display: swap`
