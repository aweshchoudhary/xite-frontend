"use server";

import { primaryDB } from "@/modules/common/database/prisma/connection";

export async function getFacultyByIdAction(id: string) {
  try {
    const faculty = await primaryDB.faculty.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        profile_image: true,
        description: true,
        title: true,
        academic_partner: {
          select: {
            id: true,
            name: true,
            logo_url: true,
          },
        },
      },
    });

    if (!faculty) {
      throw new Error("Faculty not found");
    }

    return faculty;
  } catch (error) {
    console.error("Error fetching faculty:", error);
    throw error;
  }
}
