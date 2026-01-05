import type { Metadata } from "next";

interface SEOOptions {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

const defaultSiteName = "Xite Platform";
const defaultSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://xite.com";
const defaultOgImage = `${defaultSiteUrl}/xite-logo.png`;

/**
 * Generates comprehensive SEO metadata for Next.js pages
 * Includes title, description, Open Graph (Facebook), Twitter Cards, and robots directives
 */
export function generateSEOMetadata(options: SEOOptions): Metadata {
  const {
    title,
    description,
    ogTitle = options.title,
    ogDescription = options.description,
    ogImage = defaultOgImage,
    ogUrl,
    twitterTitle = options.title,
    twitterDescription = options.description,
    twitterImage = defaultOgImage,
    noindex = false,
    nofollow = false,
  } = options;

  const fullTitle = `${title} | ${defaultSiteName}`;
  const robots =
    [noindex && "noindex", nofollow && "nofollow"].filter(Boolean).join(", ") ||
    undefined;

  return {
    title: fullTitle,
    description,
    robots: robots ? { index: !noindex, follow: !nofollow } : undefined,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: ogUrl,
      siteName: defaultSiteName,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: ogTitle,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: twitterTitle,
      description: twitterDescription,
      images: [twitterImage],
    },
  };
}
