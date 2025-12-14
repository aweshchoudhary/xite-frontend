"use server";

import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import { getLoggedInUser } from "@/modules/user/utils";
import { revalidatePath } from "next/cache";

export type UpdateOneOutput =
  PrimaryDB.CohortFacultySectionItemGetPayload<object>;

interface AddFacultyItemToSectionParams {
  sectionId: string;
  facultyId: string;
  position: number;
}

/**
 * Adds a faculty item to a section at a specific position,
 * safely re-ordering existing items within a database transaction.
 * @returns An object indicating success or failure.
 */
export async function addFacultyItemToSection({
  sectionId,
  facultyId,
  position,
}: AddFacultyItemToSectionParams) {
  try {
    const finalPosition = position ?? 1;
    const currentUser = await getLoggedInUser();
    const newFacultyItem = await primaryDB.$transaction(async (tx) => {
      // Step 1: Shift existing items to make space for the new one.
      // This now correctly increments each item's position individually.
      await tx.cohortFacultySectionItem.updateMany({
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
          updated_by_id: currentUser.id,
        },
      });

      // Step 2: Create the new item in the now-vacant position.
      const createdItem = await tx.cohortFacultySectionItem.create({
        data: {
          facultyId,
          position: finalPosition,
          parent_section_id: sectionId,
          updated_by_id: currentUser.id,
        },
      });

      return createdItem;
    });

    revalidatePath("/cohorts");

    return { success: true, data: newFacultyItem };
  } catch (error) {
    throw error;
  }
}

export async function removeFacultyItemFromSection({
  itemId,
}: {
  itemId: string;
}) {
  const data = await primaryDB.cohortFacultySectionItem.delete({
    where: {
      id: itemId,
    },
  });

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
        await primaryDB.cohortFacultySectionItem.update({
          where: {
            id: item.itemId,
          },
          data: {
            position: item.position,
            updated_by: {
              connect: {
                id: currentUser.id,
              },
            },
          },
        });
      })
    );

    revalidatePath("/cohorts");

    return { success: true, message: "Order updated successfully." };
  } catch (error) {
    console.error("Error updating card order:", error);
    return { success: false, message: "Failed to update order." };
  }
}
