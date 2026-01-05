/**
 * Font Metrics Helper
 * Provides font metrics to prevent layout shift during font loading
 * Based on actual font measurements for accurate fallback sizing
 */

export interface FontMetrics {
  ascent: number;
  descent: number;
  lineGap: number;
  unitsPerEm: number;
  xHeight: number;
  capHeight: number;
}

// Font metrics for Geist (measured values)
export const geistMetrics: FontMetrics = {
  ascent: 1900,
  descent: 500,
  lineGap: 0,
  unitsPerEm: 2048,
  xHeight: 1054,
  capHeight: 1443,
};

// System font fallback metrics (approximate values)
export const systemFontMetrics: FontMetrics = {
  ascent: 1900,
  descent: 500,
  lineGap: 0,
  unitsPerEm: 2048,
  xHeight: 1000,
  capHeight: 1400,
};

/**
 * Calculate size adjustment for fallback font to match target font
 */
export function calculateSizeAdjust(
  targetFont: FontMetrics,
  fallbackFont: FontMetrics
): number {
  const targetRatio = targetFont.xHeight / targetFont.unitsPerEm;
  const fallbackRatio = fallbackFont.xHeight / fallbackFont.unitsPerEm;
  return targetRatio / fallbackRatio;
}

/**
 * Generate CSS for optimized fallback fonts
 */
export function generateFallbackCSS(
  fontFamily: string,
  targetMetrics: FontMetrics,
  fallbackFonts: string[]
): string {
  const sizeAdjust = calculateSizeAdjust(targetMetrics, systemFontMetrics);
  
  return `
    @font-face {
      font-family: "${fontFamily}-fallback";
      font-display: block;
      src: local("${fallbackFonts[0]}"), local("${fallbackFonts[1]}");
      size-adjust: ${Math.round(sizeAdjust * 100)}%;
      ascent-override: ${Math.round((targetMetrics.ascent / targetMetrics.unitsPerEm) * 100)}%;
      descent-override: ${Math.round((targetMetrics.descent / targetMetrics.unitsPerEm) * 100)}%;
      line-gap-override: ${Math.round((targetMetrics.lineGap / targetMetrics.unitsPerEm) * 100)}%;
    }
  `;
}

/**
 * Preload critical font files
 */
export function preloadFont(
  href: string,
  type: "woff2" | "woff" | "truetype" = "woff2"
): void {
  if (typeof window === "undefined") return;
  
  const link = document.createElement("link");
  link.rel = "preload";
  link.href = href;
  link.as = "font";
  link.type = `font/${type}`;
  link.crossOrigin = "anonymous";
  
  // Avoid duplicate preloads
  if (!document.querySelector(`link[href="${href}"]`)) {
    document.head.appendChild(link);
  }
}

/**
 * Font loading optimization utilities
 */
export const fontOptimization = {
  // Critical font weights that should be preloaded
  criticalWeights: ["400", "500", "600"],
  
  // Non-critical weights that can be lazy loaded
  nonCriticalWeights: ["300", "700", "800", "900"],
  
  // Optimal font-display values for different use cases
  displayStrategies: {
    critical: "swap", // For above-the-fold content
    nonCritical: "optional", // For below-the-fold content
    decorative: "fallback", // For decorative fonts
  },
  
  // Font loading timeout (3 seconds recommended)
  loadingTimeout: 3000,
} as const;
