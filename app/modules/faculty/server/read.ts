"use server";
import { PrimaryDB } from "@/modules/common/database/prisma/types";
import {
  getManyRecords,
  getRecord,
} from "@/modules/common/database/controllers/faculty/read";

export type GetOneOutput = PrimaryDB.FacultyGetPayload<{
  include: {
    academic_partner: true;
    faculty_subject_areas: {
      include: {
        subject_area: true;
      };
    };
    subtopics: {
      include: {
        topic: true;
      };
    };
  };
}>;
export type GetAllOutput = GetOneOutput[];

export async function getAll(): Promise<GetAllOutput> {
  try {
    return await getManyRecords({
      include: {
        academic_partner: true,
        faculty_subject_areas: {
          include: {
            subject_area: true,
          },
        },
        subtopics: {
          include: {
            topic: true,
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
    const faculty = await getRecord({
      recordId: id,
      include: {
        academic_partner: true,
        faculty_subject_areas: {
          include: {
            subject_area: true,
          },
        },
        subtopics: {
          include: {
            topic: true,
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
