"use server";
import { PrimaryDB } from "@/modules/common/database/prisma/types";
import { primaryDB } from "@/modules/common/database/prisma/connection";

export type GetOneOutput = PrimaryDB.FacultyGetPayload<{
  include: {
    academic_partner: true;
    faculty_subject_areas: {
      include: {
        subject_area: true;
      };
    };
  };
}>;
export type GetAllOutput = GetOneOutput[];

export async function getAll(): Promise<GetAllOutput> {
  try {
    return await primaryDB.faculty.findMany({
      include: {
        academic_partner: true,
        faculty_subject_areas: {
          include: {
            subject_area: true,
          },
        },
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getOne({
  id,
}: {
  id: string;
}): Promise<GetOneOutput | null> {
  try {
    const faculty = await primaryDB.faculty.findUnique({
      where: { id },
      include: {
        academic_partner: true,
        faculty_subject_areas: {
          include: {
            subject_area: true,
          },
        },
      },
    });

    return faculty;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
