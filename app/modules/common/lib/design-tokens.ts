/**
 * Design System Tokens
 * Centralized design tokens for consistent styling across the application
 */

// Typography variants with font optimization
export const typography = {
  h1: "2xl:text-3xl text-2xl font-semibold text-balance", // Use text-balance for headlines
  h2: "2xl:text-2xl text-xl font-medium text-balance",
  h3: "2xl:text-xl text-lg font-medium text-balance",
  body: "text-foreground leading-relaxed", // Better line height for readability
  bodyMuted: "text-muted-foreground leading-relaxed",
  small: "text-sm leading-normal",
  caption: "text-xs text-muted-foreground leading-normal",
  mono: "font-mono text-sm", // Dedicated mono font class
  display: "font-semibold tracking-tight", // For large display text
} as const;

// Spacing utilities
export const spacing = {
  page: "spacing", // Custom utility: responsive page padding
  pageX: "spacing-x", // Custom utility: responsive horizontal padding
  pageY: "spacing-y", // Custom utility: responsive vertical padding
  section: "space-y-10", // Standard section spacing
  component: "space-y-4", // Component internal spacing
  tight: "space-y-2", // Tight spacing
} as const;

// Common layout patterns
export const layout = {
  centered: "flex items-center justify-center",
  flexBetween: "flex items-center justify-between",
  flexStart: "flex items-center justify-start",
  flexEnd: "flex items-center justify-end",
  flexCol: "flex flex-col",
  flexWrap: "flex flex-wrap",
  grid2: "grid grid-cols-1 md:grid-cols-2 gap-6",
  grid3: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
} as const;

// Interactive states
export const interactive = {
  hover: "hover:bg-accent hover:text-accent-foreground",
  focus: "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  disabled: "disabled:pointer-events-none disabled:opacity-50",
  clickable: "cursor-pointer transition-colors",
} as const;

// Status indicators
export const status = {
  success: "text-green-600 dark:text-green-400",
  warning: "text-yellow-600 dark:text-yellow-400",
  error: "text-red-600 dark:text-red-400",
  info: "text-blue-600 dark:text-blue-400",
} as const;

// Shadows and borders
export const elevation = {
  card: "shadow-sm border bg-card text-card-foreground",
  elevated: "shadow-md border bg-card text-card-foreground",
  modal: "shadow-lg border bg-popover text-popover-foreground",
} as const;

// Helper function to combine class names
export function combineClasses(
  ...classes: (string | undefined | null | false)[]
): string {
  return classes.filter(Boolean).join(" ");
}
