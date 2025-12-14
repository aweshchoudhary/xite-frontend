/**
 * Cache Configuration
 * Centralized caching settings for different data types and operations
 */

export const cacheConfig = {
  // Static data that rarely changes
  static: {
    revalidate: 60 * 60 * 24, // 24 hours
    tags: ["static"],
  },

  // User-specific data
  user: {
    revalidate: 60 * 15, // 15 minutes
    tags: ["user"],
  },

  // Frequently updated data
  dynamic: {
    revalidate: 60 * 5, // 5 minutes
    tags: ["dynamic"],
  },

  // Real-time data
  realtime: {
    revalidate: 0, // No cache
    tags: ["realtime"],
  },

  // Entity-specific caching
  entities: {
    programs: {
      revalidate: 60 * 30, // 30 minutes
      tags: ["programs"] as string[],
    },
    cohorts: {
      revalidate: 60 * 15, // 15 minutes
      tags: ["cohorts"] as string[],
    },
    faculty: {
      revalidate: 60 * 60, // 1 hour
      tags: ["faculty"] as string[],
    },
    enterprises: {
      revalidate: 60 * 60, // 1 hour
      tags: ["enterprises"] as string[],
    },
    academicPartners: {
      revalidate: 60 * 60 * 2, // 2 hours
      tags: ["academic-partners"] as string[],
    },
    microsites: {
      revalidate: 60 * 10, // 10 minutes
      tags: ["microsites"] as string[],
    },
  },
} as const;

export type CacheTag =
  | "static"
  | "user"
  | "dynamic"
  | "realtime"
  | "programs"
  | "cohorts"
  | "faculty"
  | "enterprises"
  | "academic-partners"
  | "microsites";

/**
 * Cache utilities for consistent cache key generation
 */
export const cacheKeys = {
  // Generate cache key for entity list
  entityList: (entity: string, filters?: Record<string, unknown>) => {
    const filterKey = filters ? `-${JSON.stringify(filters)}` : "";
    return `${entity}-list${filterKey}`;
  },

  // Generate cache key for single entity
  entitySingle: (entity: string, id: string) => {
    return `${entity}-${id}`;
  },

  // Generate cache key for user-specific data
  userSpecific: (userId: string, entity: string) => {
    return `user-${userId}-${entity}`;
  },
} as const;
