# Quieted Design System
*Inspired by OpenAI's Design Language*

## Typography

### Font Family
- **Primary**: Inter (system fallback: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif)
- **Code/Monospace**: "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, monospace

### Font Weights
- **Light**: 300
- **Regular**: 400 
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700

### Font Sizes & Line Heights
```css
/* Headings */
--text-xs: 0.75rem;     /* 12px */
--text-sm: 0.875rem;    /* 14px */
--text-base: 1rem;      /* 16px */
--text-lg: 1.125rem;    /* 18px */
--text-xl: 1.25rem;     /* 20px */
--text-2xl: 1.5rem;     /* 24px */
--text-3xl: 1.875rem;   /* 30px */
--text-4xl: 2.25rem;    /* 36px */
--text-5xl: 3rem;       /* 48px */

/* Line Heights */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
```

## Color Palette

### Primary Colors
```css
/* Neutral Grays */
--gray-50: #f9fafb;
--gray-100: #f3f4f6; 
--gray-200: #e5e7eb;
--gray-300: #d1d5db;
--gray-400: #9ca3af;
--gray-500: #6b7280;
--gray-600: #4b5563;
--gray-700: #374151;
--gray-800: #1f2937;
--gray-900: #111827;
--gray-950: #030712;

/* Semantic Colors */
--primary: #10a37f;      /* OpenAI Green */
--primary-hover: #0d8f72;
--primary-light: #e6f7f4;

--accent: #6366f1;       /* Indigo */
--accent-hover: #5854eb;
--accent-light: #eef2ff;

--success: #059669;
--warning: #d97706;
--error: #dc2626;
--info: #2563eb;
```

### Background Colors
```css
--bg-primary: #ffffff;
--bg-secondary: #f9fafb;
--bg-tertiary: #f3f4f6;
--bg-dark: #111827;
--bg-overlay: rgba(0, 0, 0, 0.5);
```

### Text Colors
```css
--text-primary: #111827;
--text-secondary: #4b5563;
--text-tertiary: #6b7280;
--text-muted: #9ca3af;
--text-inverse: #ffffff;
```

## Spacing Scale

### Margin & Padding
```css
--space-0: 0;
--space-1: 0.25rem;    /* 4px */
--space-2: 0.5rem;     /* 8px */
--space-3: 0.75rem;    /* 12px */
--space-4: 1rem;       /* 16px */
--space-5: 1.25rem;    /* 20px */
--space-6: 1.5rem;     /* 24px */
--space-8: 2rem;       /* 32px */
--space-10: 2.5rem;    /* 40px */
--space-12: 3rem;      /* 48px */
--space-16: 4rem;      /* 64px */
--space-20: 5rem;      /* 80px */
--space-24: 6rem;      /* 96px */
```

## Border Radius

```css
--radius-none: 0;
--radius-sm: 0.125rem;   /* 2px */
--radius-md: 0.375rem;   /* 6px */
--radius-lg: 0.5rem;     /* 8px */
--radius-xl: 0.75rem;    /* 12px */
--radius-2xl: 1rem;      /* 16px */
--radius-full: 9999px;   /* Perfect circle */
```

## Shadows & Elevation

```css
/* Subtle shadows for cards and modals */
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);

/* Focus rings */
--ring-primary: 0 0 0 3px rgba(16, 163, 127, 0.1);
--ring-accent: 0 0 0 3px rgba(99, 102, 241, 0.1);
```

## Animation & Transitions

### Duration
```css
--duration-fast: 150ms;
--duration-normal: 200ms;
--duration-slow: 300ms;
--duration-slower: 500ms;
```

### Easing Functions
```css
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-smooth: cubic-bezier(0.25, 0.1, 0.25, 1);
```

### Common Transitions
```css
--transition-colors: color var(--duration-normal) var(--ease-in-out),
                    background-color var(--duration-normal) var(--ease-in-out),
                    border-color var(--duration-normal) var(--ease-in-out);

--transition-opacity: opacity var(--duration-normal) var(--ease-in-out);
--transition-transform: transform var(--duration-normal) var(--ease-smooth);
--transition-all: all var(--duration-normal) var(--ease-in-out);
```

## Component Styles

### Buttons

#### Primary Button
```css
.btn-primary {
  background: var(--primary);
  color: white;
  border: none;
  border-radius: var(--radius-lg);
  padding: var(--space-3) var(--space-6);
  font-weight: 500;
  font-size: var(--text-sm);
  transition: var(--transition-colors);
  box-shadow: var(--shadow-sm);
}

.btn-primary:hover {
  background: var(--primary-hover);
  box-shadow: var(--shadow-md);
}

.btn-primary:focus {
  outline: none;
  box-shadow: var(--ring-primary);
}
```

#### Secondary Button
```css
.btn-secondary {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-lg);
  padding: var(--space-3) var(--space-6);
  font-weight: 500;
  font-size: var(--text-sm);
  transition: var(--transition-all);
}

.btn-secondary:hover {
  background: var(--gray-50);
  border-color: var(--gray-400);
}
```

### Input Fields
```css
.input {
  background: white;
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-lg);
  padding: var(--space-3) var(--space-4);
  font-size: var(--text-sm);
  color: var(--text-primary);
  transition: var(--transition-colors);
  width: 100%;
}

.input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: var(--ring-primary);
}

.input::placeholder {
  color: var(--text-muted);
}
```

### Cards
```css
.card {
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  box-shadow: var(--shadow-sm);
  transition: var(--transition-all);
}

.card:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--gray-300);
}
```

### Navigation
```css
.nav-link {
  color: var(--text-secondary);
  font-weight: 500;
  font-size: var(--text-sm);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
  transition: var(--transition-colors);
  text-decoration: none;
}

.nav-link:hover {
  color: var(--text-primary);
  background: var(--gray-100);
}

.nav-link.active {
  color: var(--primary);
  background: var(--primary-light);
}
```

## Layout Principles

### Max Widths
```css
--max-width-xs: 20rem;    /* 320px */
--max-width-sm: 24rem;    /* 384px */
--max-width-md: 28rem;    /* 448px */
--max-width-lg: 32rem;    /* 512px */
--max-width-xl: 36rem;    /* 576px */
--max-width-2xl: 42rem;   /* 672px */
--max-width-3xl: 48rem;   /* 768px */
--max-width-4xl: 56rem;   /* 896px */
--max-width-content: 50rem; /* 800px - Our main content width */
```

### Container Styles
```css
.container {
  max-width: var(--max-width-content);
  margin: 0 auto;
  padding: 0 var(--space-4);
}

@media (min-width: 768px) {
  .container {
    padding: 0 var(--space-8);
  }
}
```

## Responsive Breakpoints

```css
/* Mobile First Approach */
--breakpoint-sm: 640px;   /* Small tablets */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Small laptops */
--breakpoint-xl: 1280px;  /* Laptops */
--breakpoint-2xl: 1536px; /* Large screens */
```

## Dark Mode Support

### Dark Theme Colors
```css
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #111827;
    --bg-secondary: #1f2937;
    --bg-tertiary: #374151;
    
    --text-primary: #f9fafb;
    --text-secondary: #d1d5db;
    --text-tertiary: #9ca3af;
    --text-muted: #6b7280;
    
    --gray-200: #374151;
    --gray-300: #4b5563;
    --gray-400: #6b7280;
  }
}
```

## Accessibility

### Focus States
- All interactive elements must have visible focus indicators
- Focus rings should use primary color with reduced opacity
- Minimum contrast ratio of 4.5:1 for normal text
- Minimum contrast ratio of 3:1 for large text

### Motion Preferences
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Implementation Notes

1. **Inter Font**: Load from Google Fonts or self-host for better performance
2. **CSS Custom Properties**: Define all variables in `:root` for global access
3. **Mobile First**: Design and code for mobile, then enhance for larger screens
4. **Semantic HTML**: Use proper HTML elements for better accessibility
5. **Progressive Enhancement**: Ensure core functionality works without JavaScript

## Next Steps

1. Install Inter font family
2. Create CSS custom properties file
3. Update existing components to use new design system
4. Implement hover states and animations
5. Add dark mode toggle functionality
6. Test accessibility compliance