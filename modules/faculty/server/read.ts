"use server";
import { PrimaryDB, primaryDB } from "@/modules/common/database";

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
