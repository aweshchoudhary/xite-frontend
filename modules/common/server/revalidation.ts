"use server";

import { revalidateTag, revalidatePath } from "next/cache";
import { CacheTag } from "@/modules/common/lib/cache-config";

/**
 * Server Actions for Cache Revalidation
 * Provides server actions to trigger cache revalidation
 */

export async function revalidateEntity(entity: CacheTag) {
  try {
    revalidateTag(entity);
    return { success: true };
  } catch (error) {
    console.error("Failed to revalidate entity:", entity, error);
    return { success: false, error: "Failed to revalidate cache" };
  }
}

export async function revalidateEntityById(entity: CacheTag, id: string) {
  try {
    // Revalidate the entity list
    revalidateTag(entity);
    // Revalidate the specific entity
    revalidateTag(`${entity}-${id}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to revalidate entity by id:", entity, id, error);
    return { success: false, error: "Failed to revalidate cache" };
  }
}

export async function revalidateMultipleTags(tags: CacheTag[]) {
  try {
    tags.forEach((tag) => revalidateTag(tag));
    return { success: true };
  } catch (error) {
    console.error("Failed to revalidate multiple tags:", tags, error);
    return { success: false, error: "Failed to revalidate cache" };
  }
}

export async function revalidatePagePath(path: string) {
  try {
    revalidatePath(path);
    return { success: true };
  } catch (error) {
    console.error("Failed to revalidate path:", path, error);
    return { success: false, error: "Failed to revalidate path" };
  }
}

export async function revalidateLayout(path: string) {
  try {
    revalidatePath(path, "layout");
    return { success: true };
  } catch (error) {
    console.error("Failed to revalidate layout:", path, error);
    return { success: false, error: "Failed to revalidate layout" };
  }
}

/**
 * Specific revalidation actions for common operations
 */
export async function revalidateAfterCreate(entity: CacheTag) {
  return revalidateEntity(entity);
}

export async function revalidateAfterUpdate(entity: CacheTag, id: string) {
  return revalidateEntityById(entity, id);
}

export async function revalidateAfterDelete(entity: CacheTag, id: string) {
  // After delete, we need to revalidate the list but not the specific entity
  return revalidateEntity(entity);
}

/**
 * Batch revalidation for related entities
 */
export async function revalidateRelatedEntities(
  primaryEntity: CacheTag,
  relatedEntities: CacheTag[]
) {
  try {
    const allTags = [primaryEntity, ...relatedEntities];
    allTags.forEach((tag) => revalidateTag(tag));
    return { success: true };
  } catch (error) {
    console.error("Failed to revalidate related entities:", error);
    return { success: false, error: "Failed to revalidate related entities" };
  }
}
