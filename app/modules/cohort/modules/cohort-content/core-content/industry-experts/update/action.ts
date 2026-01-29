"use server";

import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import { getLoggedInUser } from "@/modules/user/utils";
import { revalidatePath } from "next/cache";
import {
  logCreate,
  logDelete,
  logUpdate,
} from "@/modules/common/lib/audit-logger";
import { getAuthUser } from "@/modules/common/authentication/firebase/action";

export type UpdateOneOutput =
  PrimaryDB.CohortIndustryExpertsSectionItemGetPayload<object>;

interface AddExpertItemToSectionParams {
  sectionId: string;
  expertId: string;
  position: number;
}

/**
 * Adds a expert item to a section at a specific position,
 * safely re-ordering existing items within a database transaction.
 * @returns An object indicating success or failure.
 */
export async function addExpertItemToSection({
  sectionId,
  expertId,
  position,
}: AddExpertItemToSectionParams) {
  try {
    const finalPosition = position ?? 1;
    const currentUser = await getLoggedInUser();
    const newExpertItem = await primaryDB.$transaction(async (tx) => {
      // Step 1: Shift existing items to make space for the new one.
      // This now correctly increments each item's position individually.
      await tx.cohortIndustryExpertsSectionItem.updateMany({
        where: {
          parent_section_id: sectionId,
          position: {
            gte: finalPosition,
          },
        },
        data: {
          position: {
            increment: 1,
          },
          updated_by_id: currentUser?.dbUser?.id,
        },
      });

      // Step 2: Create the new item in the now-vacant position.
      const createdItem = await tx.cohortIndustryExpertsSectionItem.create({
        data: {
          facultyId: expertId,
          position: finalPosition,
          parent_section_id: sectionId,
          updated_by_id: currentUser?.dbUser?.id,
        },
      });

      return createdItem;
    });

    try {
      const user = await getAuthUser();
      if (user) {
        await logCreate(
          user.uid,
          user.name || user.email || "Unknown User",
          "CohortIndustryExpertsSectionItem",
          newExpertItem.id,
          sectionId,
          "postgresql",
          newExpertItem,
          { sectionId, expertId, position: finalPosition },
        );
      }
    } catch (auditError) {
      console.error("Failed to create audit log:", auditError);
    }

    revalidatePath("/cohorts");

    return { success: true, data: newExpertItem };
  } catch (error) {
    throw error;
  }
}

export async function removeExpertItemFromSection({
  itemId,
}: {
  itemId: string;
}) {
  const initialItem =
    await primaryDB.cohortIndustryExpertsSectionItem.findUnique({
      where: { id: itemId },
    });

  const data = await primaryDB.cohortIndustryExpertsSectionItem.delete({
    where: {
      id: itemId,
    },
  });

  try {
    const user = await getAuthUser();
    if (user && initialItem) {
      await logDelete(
        user.uid,
        user.name || user.email || "Unknown User",
        "CohortIndustryExpertsSectionItem",
        itemId,
        itemId,
        "postgresql",
        initialItem,
        { sectionId: initialItem.parent_section_id },
      );
    }
  } catch (auditError) {
    console.error("Failed to create audit log:", auditError);
  }

  revalidatePath("/cohorts");
  return data;
}

interface Item {
  id: number;
  name: string;
  position: number;
  itemId: string;
}

export async function updateCardOrder(items: Item[]) {
  try {
    const currentUser = await getLoggedInUser();
    // Update database with new positions
    await Promise.all(
      items.map(async (item) => {
        await primaryDB.cohortIndustryExpertsSectionItem.update({
          where: {
            id: item.itemId,
          },
          data: {
            position: item.position,
            updated_by_id: currentUser?.dbUser?.id,
          },
        });
      }),
    );

    try {
      const user = await getAuthUser();
      if (user) {
        await logUpdate(
          user.uid,
          user.name || user.email || "Unknown User",
          "CohortIndustryExpertsSectionItem",
          "order",
          "Industry experts card order",
          "postgresql",
          undefined,
          items,
          { action: "update_card_order", itemCount: items.length },
        );
      }
    } catch (auditError) {
      console.error("Failed to create audit log:", auditError);
    }

    revalidatePath("/cohorts");

    return { success: true, message: "Order updated successfully." };
  } catch (error) {
    console.error("Error updating card order:", error);
    return { success: false, message: "Failed to update order." };
  }
}
