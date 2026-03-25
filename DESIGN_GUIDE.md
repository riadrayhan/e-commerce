# DailyMart Design System

## 🎨 Visual Design Overview

Your e-commerce platform features a modern, clean design system optimized for daily essentials shopping.

## Color Palette

### Primary Brand Color
- **Blue** - `#5B7CE6` (Modern, trustworthy)
  - Used for: Main buttons, links, highlights, primary CTA
  - Conveys: Trust, reliability, professionalism

### Accent Color
- **Orange** - `#E8652F` (Energetic, warm)
  - Used for: Secondary actions, stock badges, highlights
  - Conveys: Energy, freshness, urgency

### Neutral Colors
- **White** - `#FFFFFF` - Card backgrounds, clean spaces
- **Light Gray** - `#F5F5F5` - Section backgrounds
- **Dark Gray** - `#525252` - Body text
- **Medium Gray** - `#A8A8A8` - Secondary text

## Typography

### Font Family
- **Primary**: Geist (modern sans-serif)
- **Monospace**: Geist Mono (for technical content)

### Heading Scale
- **H1** (56px) - Main hero headline
- **H2** (40px) - Section titles
- **H3** (24px) - Card titles
- **H4** (18px) - Subsections
- **P** (16px) - Body text
- **Small** (14px) - Secondary info

### Font Weights
- **Light (300)** - Secondary text
- **Regular (400)** - Body content
- **Medium (500)** - Highlighted text
- **Semibold (600)** - Subheadings
- **Bold (700)** - Headlines

## Component Design

### Buttons

**Primary Button**
- Background: Blue (#5B7CE6)
- Text: White
- Size: 48px height (desktop), 40px (mobile)
- Rounded corners: 8px
- Hover: Slight shadow increase

**Secondary Button**
- Background: Light gray (#F5F5F5)
- Text: Dark gray (#525252)
- Border: 1px gray border
- Hover: Background darkens slightly

**Icon Buttons**
- Size: 32px × 32px
- Icon size: 16px
- Rounded: 8px
- Hover: Background tint

### Cards

- **Background**: Pure white or slightly tinted
- **Border**: 1px light gray
- **Padding**: 16px (mobile), 24px (desktop)
- **Radius**: 8px
- **Hover**: Subtle shadow, border tint to blue
- **Transition**: 300ms smooth

### Product Cards

**Layout**
```
┌──────────────────┐
│   Product Image  │  ← 192px height, object-cover
├──────────────────┤
│  Product Name    │  ← 2 lines max (truncated)
│  Description     │  ← 2 lines max (truncated)
├──────────────────┤
│ ₹2,999    Stock  │  ← Price left, stock right
│ [Add to Cart]    │  ← Full width button
└──────────────────┘
```

**States**
- **Normal**: Light shadow
- **Hover**: Scale up slightly, darker shadow, blue border
- **Out of Stock**: 50% opacity overlay with text
- **On Cart**: Visual feedback on add button

### Hero Section

- **Background**: Gradient (blue to transparent)
- **Layout**: 2-column (desktop), 1-column (mobile)
- **Features Grid**: 2×2 on desktop, stacked on mobile
- **CTA Buttons**: Primary + Secondary side by side

### Search Bar

- **Height**: 40px
- **Padding**: 12px left (for icon)
- **Border**: 1px gray
- **Radius**: 8px
- **Icon**: Magnifying glass (16px)
- **Placeholder**: Muted gray text

### Header/Navigation

- **Height**: 64px (desktop), 56px + search (mobile)
- **Background**: Card color with subtle border
- **Sticky**: Top: 0, z-index: 50
- **Logo**: 40px × 40px rounded container
- **Cart Counter**: Red badge at top-right

## Spacing Scale

Used consistently throughout:
- **2px** - Fine details
- **4px** - Small gaps
- **8px** - Component padding
- **12px** - Medium spacing
- **16px** - Card padding
- **24px** - Section padding
- **32px** - Large spacing
- **48px** - Extra large spacing
- **64px** - Hero section padding
- **96px** - Major section breaks

## Layout Breakpoints

- **Mobile**: 0px - 640px (single column, stacked layout)
- **Tablet**: 641px - 1024px (2-3 columns)
- **Desktop**: 1025px+ (4-column grid, full features)

## Responsive Adjustments

### Mobile (< 640px)
- Single column grid
- Full-width cards
- Smaller padding (16px → 12px)
- Smaller font sizes (16px → 14px)
- Stacked buttons
- Bottom-docked navigation

### Tablet (641px - 1024px)
- 2-3 column grid
- Adjusted padding
- Side-by-side navigation
- Flexible spacing

### Desktop (1025px+)
- 4-column product grid
- Maximum width: 1280px
- Full feature utilization
- Hover states fully enabled

## Interactive Elements

### Hover States
- **Links**: Color change to blue, underline
- **Buttons**: Shadow increase, slight scale
- **Cards**: Border tint, shadow growth
- **Images**: Slight scale (105%)
- **Transition**: 200-300ms cubic-bezier

### Active States
- **Buttons**: Darker shade, inset shadow
- **Tab/Nav**: Underline or background highlight
- **Transitions**: Instant for feel

### Focus States
- **Keyboard Nav**: 2px blue outline
- **Ring color**: Blue (#5B7CE6)
- **Offset**: 4px

### Disabled States
- **Opacity**: 50%
- **Cursor**: not-allowed
- **No hover effects**: Disabled

## Loading States

- **Skeleton Screens**: Gray placeholder blocks
- **Animation**: Pulse effect (opacity: 0.5 → 1.0)
- **Duration**: 2 seconds
- **Applied to**: Images, cards, content blocks

## Empty States

- **Icon**: Large (64px), muted gray
- **Headline**: Semibold, dark gray
- **Message**: Regular, medium gray
- **CTA**: Primary button below

## Shadow System

- **Small**: `0 1px 2px rgba(0,0,0,0.05)`
- **Medium**: `0 4px 6px rgba(0,0,0,0.1)`
- **Large**: `0 10px 15px rgba(0,0,0,0.1)`
- **Extra Large**: `0 20px 25px rgba(0,0,0,0.1)`

## Border Radius

- **Small**: 4px (input fields)
- **Medium**: 8px (cards, buttons)
- **Large**: 12px (containers)
- **Extra Large**: 16px (hero sections)

## Icons

- **Size**: 16px (small), 20px (regular), 24px (large)
- **Color**: Inherit from text color
- **Weight**: Consistent 1.5px stroke
- **Library**: lucide-react

## Animation Principles

1. **Purposeful**: Every animation serves a function
2. **Fast**: 200-300ms for most interactions
3. **Smooth**: Cubic-bezier easing
4. **Accessible**: Respects `prefers-reduced-motion`
5. **Consistent**: Same timing across similar elements

## Accessibility

- **Color Contrast**: WCAG AA (minimum 4.5:1 for text)
- **Font Size**: Minimum 14px for body text
- **Touch Targets**: Minimum 44px × 44px
- **Keyboard Navigation**: All interactive elements accessible
- **Alt Text**: All images have descriptive alt text
- **Labels**: Form inputs have associated labels
- **ARIA**: Semantic HTML with ARIA when needed

## Brand Voice

- **Tone**: Friendly, helpful, professional
- **Language**: Clear, simple, action-oriented
- **Messaging**: Trust, speed, reliability
- **Copy Style**: Short sentences, active voice

## Implementation Notes

All colors, spacing, and components are defined in:
- `app/globals.css` - Design tokens (CSS variables)
- `app/page.tsx` - Component implementations
- `components/ui/*` - shadcn/ui components

To customize:
1. Edit color values in `:root` section of `globals.css`
2. Update component classes in JSX files
3. Test across all breakpoints
4. Verify accessibility with tools

---

This design system ensures consistency, quality, and a professional appearance across your entire e-commerce platform.
