import { unstable_cache as nextCache } from "next/cache";
import { primaryDB } from "@/modules/common/database";
import { cacheConfig, CacheTag, cacheKeys } from "./cache-config";

/**
 * Enhanced Database Helper with Caching
 * Provides cached database operations following Next.js 15 best practices
 */

export interface CacheOptions {
  revalidate?: number;
  tags?: CacheTag[];
}

/**
 * Create a cached database query
 */
export function createCachedQuery<T extends unknown[], R>(
  queryFn: (...args: T) => Promise<R>,
  keyPrefix: string,
  defaultOptions: CacheOptions = {}
) {
  return nextCache(queryFn, [keyPrefix], {
    revalidate: defaultOptions.revalidate,
    tags: defaultOptions.tags,
  });
}

/**
 * Cached database operations for common patterns
 */
export const cachedDB = {
  // Find many with caching
  findMany: <T>(
    model: keyof typeof primaryDB,
    args: unknown,
    options: CacheOptions & { keyPrefix: string }
  ) => {
    const cacheKey = `${options.keyPrefix}-findMany`;
    return nextCache(
      async () => {
        // @ts-expect-error - Dynamic model access
        return await primaryDB[model].findMany(args);
      },
      [cacheKey, JSON.stringify(args)],
      {
        revalidate: options.revalidate,
        tags: options.tags,
      }
    )();
  },

  // Find unique with caching
  findUnique: <T>(
    model: keyof typeof primaryDB,
    args: unknown,
    options: CacheOptions & { keyPrefix: string }
  ) => {
    const cacheKey = `${options.keyPrefix}-findUnique`;
    return nextCache(
      async () => {
        // @ts-expect-error - Dynamic model access
        return await primaryDB[model].findUnique(args);
      },
      [cacheKey, JSON.stringify(args)],
      {
        revalidate: options.revalidate,
        tags: options.tags,
      }
    )();
  },

  // Count with caching
  count: <T>(
    model: keyof typeof primaryDB,
    args: unknown,
    options: CacheOptions & { keyPrefix: string }
  ) => {
    const cacheKey = `${options.keyPrefix}-count`;
    return nextCache(
      async () => {
        // @ts-expect-error - Dynamic model access
        return await primaryDB[model].count(args);
      },
      [cacheKey, JSON.stringify(args)],
      {
        revalidate: options.revalidate,
        tags: options.tags,
      }
    )();
  },
} as const;

/**
 * Revalidation helpers
 */
export const revalidateHelpers = {
  // Revalidate all cache entries with specific tags
  byTags: async (tags: CacheTag[]) => {
    const { revalidateTag } = await import("next/cache");
    tags.forEach((tag) => revalidateTag(tag));
  },

  // Revalidate specific entity
  entity: async (entity: CacheTag, id?: string) => {
    const { revalidateTag } = await import("next/cache");
    revalidateTag(entity);
    if (id) {
      revalidateTag(`${entity}-${id}`);
    }
  },

  // Revalidate user-specific data
  user: async (userId: string) => {
    const { revalidateTag } = await import("next/cache");
    revalidateTag(`user-${userId}`);
  },
} as const;

/**
 * Stale-while-revalidate implementation
 */
export function createSWRQuery<T extends unknown[], R>(
  queryFn: (...args: T) => Promise<R>,
  keyPrefix: string,
  options: {
    staleTime?: number; // Time before data becomes stale
    cacheTime?: number; // Time before data is garbage collected
    tags?: CacheTag[];
  } = {}
) {
  const {
    staleTime = 60 * 5, // 5 minutes default
    cacheTime = 60 * 30, // 30 minutes default
    tags = [],
  } = options;

  return nextCache(queryFn, [keyPrefix], {
    revalidate: staleTime,
    tags,
  });
}
