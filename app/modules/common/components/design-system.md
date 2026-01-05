# Design System Documentation

## Overview

This project uses a comprehensive design system built on **Tailwind CSS** and **shadcn/ui** components for consistent UI patterns.

## Color System

### Primary Colors

- **Primary**: `oklch(0.546 0.1373 246.63)` - Main brand color
- **Primary Foreground**: `oklch(0.97 0.014 254.604)` - Text on primary
- **Primary Accent**: `oklch(0.9617 0.0197 239.9)` - Accent variant

### Semantic Colors

- **Background**: Light/Dark adaptive background
- **Foreground**: Primary text color
- **Muted**: Secondary text and subtle backgrounds
- **Accent**: Interactive elements
- **Destructive**: Error states and dangerous actions
- **Success**: Success states (via badge variants)

### Sidebar Colors

Custom sidebar color scheme for consistent navigation styling.

## Typography

### Headings

- **h1**: `2xl:text-3xl text-2xl font-semibold` - Page titles
- **h2**: `2xl:text-2xl text-xl` - Section headers
- **h3**: `2xl:text-xl text-lg` - Subsection headers

### Body Text

- Default: `text-foreground`
- Muted: `text-muted-foreground`
- Small: `text-sm`

## Spacing System

### Custom Utilities

- **spacing**: `2xl:p-16 xl:px-16 xl:py-10 lg:p-10 p-5` - Responsive page padding
- **spacing-x**: Horizontal spacing only
- **spacing-y**: Vertical spacing only

### Standard Spacing

Uses Tailwind's standard spacing scale (4px increments).

## Components

### Layout Components

- `ListPageLayout` - Standard list page structure
- `DetailPageHeader` - Page headers with actions
- `InfoSection` - Information display containers
- `InfoCard` - Individual info units

### UI Components (shadcn/ui)

- **Form Elements**: Button, Input, Textarea, Select, Checkbox
- **Data Display**: Table, Badge, Avatar, Card
- **Navigation**: Sidebar, Dropdown Menu, Tabs
- **Feedback**: Alert, Toast (Sonner), Skeleton
- **Overlays**: Dialog, Popover, Sheet, Tooltip
- **Advanced**: Calendar, Carousel, Command, Accordion

## Component Variants

### Button Variants

- `default` - Primary action button
- `destructive` - Delete/dangerous actions
- `outline` - Secondary actions
- `secondary` - Tertiary actions
- `ghost` - Minimal styling
- `link` - Text-like button

### Badge Variants

- `default` - Standard badge
- `secondary` - Muted badge
- `destructive` - Error badge
- `outline` - Outlined badge
- `success` - Success state (custom)

## Dark Mode

Full dark mode support with automatic color scheme switching based on system preference or user selection.

## Best Practices

### Color Usage

- Use semantic color names (primary, muted, accent) instead of specific colors
- Leverage CSS variables for consistent theming
- Use badge variants for status indicators

### Spacing

- Use the `spacing` utility for page-level padding
- Use standard Tailwind spacing for component-level spacing
- Maintain consistent gaps between elements

### Typography

- Use heading utilities (h1, h2, h3) for consistent typography
- Use muted-foreground for secondary text
- Maintain proper contrast ratios

### Component Composition

- Prefer composition over customization
- Use layout components for consistent page structure
- Leverage existing UI components before creating new ones

## Responsive Design

All components follow mobile-first responsive design:

- Base styles for mobile
- `md:` for tablets
- `lg:` for small desktops
- `xl:` for large desktops
- `2xl:` for extra large screens
