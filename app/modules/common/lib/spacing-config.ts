/**
 * Spacing Configuration
 * Centralized spacing settings for consistent layout across the application
 */

export const LAYOUT_SPACING = {
  page: {
    mobile: "p-4",
    tablet: "md:p-6",
    desktop: "lg:p-8",
    wide: "xl:p-10",
  },
  card: {
    mobile: "p-4",
    tablet: "md:p-6",
    desktop: "lg:p-8",
  },
  section: {
    mobile: "space-y-4",
    tablet: "md:space-y-6",
    desktop: "lg:space-y-8",
  },
} as const;

export const PAGE_PADDING = "p-4 md:p-6 lg:p-8 xl:p-10";
export const CARD_PADDING = "p-4 md:p-6 lg:p-8";
export const SECTION_SPACING = "space-y-4 md:space-y-6 lg:space-y-8";
